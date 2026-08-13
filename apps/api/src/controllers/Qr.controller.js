import { SERVER_URL_NORMALIZED } from "../config/index.js";
import { UserProfile, PersonalProfile, BusinessProfile, QrCustomization } from "../models/Association.js";
import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colorToHex = (color) => {
  if (!color) return "#000000";
  if (color.startsWith("#")) return color;

  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return color;
};

class QrController {
  /**
   * GET /v1/qr/:user_profile_id
   */
  static getQrDesign = async (req, res, next) => {
    try {
      const { user_profile_id } = req.params;

      const up = await UserProfile.findByPk(user_profile_id, {
        include: [{ model: QrCustomization, as: "qrDesign" }],
      });

      if (!up) {
        return res.status(404).json({ status: "error", message: "Profile not found" });
      }

      let profileData = null;
      if (up.profile_type_name.toLowerCase().includes("personal")) {
        profileData = await PersonalProfile.findByPk(up.profile_id);
      } else if (up.profile_type_name.toLowerCase().includes("business")) {
        profileData = await BusinessProfile.findByPk(up.profile_id);
      }

      if (!profileData) {
        return res.status(404).json({ status: "error", message: "Associated profile data not found" });
      }

      const username = profileData.username || "";
      const profileUrl = `https://facile.in/${username}`;

      // Default design values if not exists
      const design = up.qrDesign || {
        logo_url: null,
        logo_size: "Standard",
        logo_shape: "Round",
        text_content: "Scan Me",
        text_position: "Top",
        qr_color: "#000000",
        bg_color: "#FAFAFA",
        is_gradient: false,
      };

      // Handle logo URL: custom logo or profile image fallback
      let finalLogoUrl = null;
      if (design.logo_url) {
        finalLogoUrl = design.logo_url.startsWith("http")
          ? design.logo_url
          : `${SERVER_URL_NORMALIZED}${design.logo_url.startsWith("/") ? "" : "/"}${design.logo_url}`;
      } else if (profileData.profile_image) {
        finalLogoUrl = profileData.profile_image.startsWith("http")
          ? profileData.profile_image
          : `${SERVER_URL_NORMALIZED}${profileData.profile_image.startsWith("/") ? "" : "/"}${profileData.profile_image}`;
      }

      return res.status(200).json({
        status: "success",
        data: {
          username: username,
          profile_url: profileUrl,
          qr_design: {
            logo: {
              url: finalLogoUrl,
              size: design.logo_size,
              shape: design.logo_shape,
            },
            text: {
              content: design.text_content,
              position: design.text_position,
            },
            colors: {
              foreground: design.qr_color,
              background: design.bg_color,
              is_gradient: design.is_gradient,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching QR design:", error);
      return next(error);
    }
  };

  /**
   * POST /v1/qr/update
   * Multipart/form-data
   */
  static updateQrDesign = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const {
        user_profile_id,
        logo_size,
        logo_shape,
        text_content,
        text_position,
        qr_color,
        is_gradient,
        bg_color
      } = req.body;

      if (!user_profile_id) {
        return res.status(400).json({ status: "error", message: "user_profile_id is required" });
      }

      // Verify UserProfile exists
      const up = await UserProfile.findByPk(user_profile_id);

      if (!up) {
        return res.status(404).json({ status: "error", message: "Profile not found", debug_user_profile_id: user_profile_id });
      }

      // Verify ownership
      if (up.user_id !== userId) {
        return res.status(403).json({ status: "error", message: "Access denied: This profile does not belong to you", debug_profile_owner: up.user_id, debug_token_user: userId });
      }

      let logoUrl = null;
      if (req.file) {
        logoUrl = `/uploads/logo/${req.file.filename}`;
      }

      // Prepare attributes for upsert
      const attributes = {
        user_id: userId,
        user_profile_id: user_profile_id,
        logo_size: logo_size || "Standard",
        logo_shape: logo_shape || "Round",
        text_content: text_content || "Scan Me",
        text_position: text_position || "Top",
        qr_color: qr_color || "#000000",
        is_gradient: is_gradient === "true" || is_gradient === true,
        bg_color: bg_color || "#FAFAFA",
      };

      if (logoUrl) {
        attributes.logo_url = logoUrl;
      }

      // Upsert
      let design = await QrCustomization.findOne({ where: { user_profile_id } });
      if (design) {
        await design.update(attributes);
      } else {
        design = await QrCustomization.create(attributes);
      }

      return res.status(200).json({
        status: "success",
        message: "QR design updated successfully",
        data: design,
      });
    } catch (error) {
      console.error("Error updating QR design:", error);
      return next(error);
    }
  };

  /**
   * GET /v1/qr/download/:user_profile_id
   */
  static downloadQrCode = async (req, res, next) => {
    try {
      const { user_profile_id } = req.params;

      const up = await UserProfile.findByPk(user_profile_id, {
        include: [{ model: QrCustomization, as: "qrDesign" }],
      });

      if (!up) {
        return res.status(404).json({ status: "error", message: "Profile not found" });
      }

      let profileData = null;
      if (up.profile_type_name.toLowerCase().includes("personal")) {
        profileData = await PersonalProfile.findByPk(up.profile_id);
      } else if (up.profile_type_name.toLowerCase().includes("business")) {
        profileData = await BusinessProfile.findByPk(up.profile_id);
      }

      if (!profileData) {
        return res.status(404).json({ status: "error", message: "Associated profile data not found" });
      }

      const username = profileData.username || "facile_user";
      const profileUrl = `https://facile.in/${username}`;

      const design = up.qrDesign || {
        logo_url: null,
        logo_size: "Standard",
        logo_shape: "Round",
        text_content: "Scan Me",
        text_position: "Top",
        qr_color: "#000000",
        bg_color: "#FFFFFF",
        is_gradient: false,
      };

      // Configuration
      const canvasSize = 600;
      const qrSize = 500;
      const margin = (canvasSize - qrSize) / 2;

      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext("2d");

      // 1. Draw Background
      ctx.fillStyle = design.bg_color || "#FFFFFF";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 2. Generate QR Code as DataURL
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: colorToHex(design.qr_color) || "#000000",
          light: "#00000000", // Transparent background for QR
        },
        width: qrSize,
      });

      const qrImage = await loadImage(qrDataUrl);
      ctx.drawImage(qrImage, margin, margin);

      // 3. Handle Logo Placement
      let logoPath = null;
      if (design.logo_url) {
        // Ensure we point to the public directory
        const relativePath = design.logo_url.startsWith("/") ? design.logo_url.substring(1) : design.logo_url;
        logoPath = path.join(__dirname, "../../public", relativePath);
      } else if (profileData.profile_image) {
        const relativePath = profileData.profile_image.startsWith("/") ? profileData.profile_image.substring(1) : profileData.profile_image;
        logoPath = path.join(__dirname, "../../public", relativePath);
      }

      if (logoPath && fs.existsSync(logoPath)) {
        try {
          const logo = await loadImage(logoPath);

          const logoSize = design.logo_size === "Small" ? 80 : 120;
          const logoX = (canvasSize - logoSize) / 2;
          const logoY = (canvasSize - logoSize) / 2;

          // Draw Logo Background/White Box
          ctx.fillStyle = "#FFFFFF";
          if (design.logo_shape === "Round") {
            ctx.beginPath();
            ctx.arc(canvasSize / 2, canvasSize / 2, (logoSize / 2) + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.beginPath();
            ctx.arc(canvasSize / 2, canvasSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
            ctx.restore();
          } else {
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
          }
        } catch (logoErr) {
          console.error("Error loading logo for QR:", logoErr);
        }
      }

      // 4. Handle Text Customization
      if (design.text_content && design.text_position !== "None") {
        ctx.fillStyle = design.qr_color || "#000000";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";

        const textY = design.text_position === "Top" ? margin - 15 : canvasSize - margin + 40;
        ctx.fillText(design.text_content, canvasSize / 2, textY);
      }

      // 5. Send Stream
      const buffer = canvas.toBuffer("image/png");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename=QR_${username}.png`);
      return res.send(buffer);

    } catch (error) {
      console.error("Error generating QR code image:", error);
      return next(error);
    }
  };
}

export default QrController;
