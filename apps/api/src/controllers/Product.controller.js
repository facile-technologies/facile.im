import { Op } from "sequelize";
import { Product, ProductFile, ProfileProduct, UserProfile, ProductCustomization, ProfileProductSetting } from "../models/Association.js";
import fs from "fs";
import path from "path";
import HelperMethods from "../utils/helper.js";
import JoiValidation from "../utils/joiValidation.js";

// Validate every user-supplied URL (product_url + LINK entries) before persisting.
// Only http/https is allowed; rejects javascript:/data:/vbscript: and malformed URLs
// (anti stored-XSS). Returns a Joi ValidationError to hand to next() → 422, or null.
// Server-generated /uploads/... file URLs are NOT user input and are never checked here.
const validateProductUrls = (product_url, files) => {
  if (product_url) {
    const { error } = JoiValidation.validateHttpUrl(product_url, "Product URL");
    if (error) return error;
  }
  if (files) {
    const parsed = Array.isArray(files) ? files : JSON.parse(files);
    for (const f of parsed) {
      // Only LINK entries carry user-supplied URLs; allow empty/absent optional URLs.
      if (f?.type === "LINK" && f.url) {
        const { error } = JoiValidation.validateHttpUrl(f.url, "Link URL");
        if (error) return error;
      }
    }
  }
  return null;
};

export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      type,
      title,
      description,
      price,
      currency,
      sale_price,
      is_on_sale,
      cta_text,
      success_heading,
      success_subheading,
      product_url,
      files, // Array of { name, type, url, size } for links
      profile_ids, // Array of profile IDs to map to
    } = req.body;

    // Reject unsafe/malformed URLs before creating anything (anti stored-XSS).
    const urlError = validateProductUrls(product_url, files);
    if (urlError) return next(urlError);

    const productImage = req.files?.productImage?.[0]?.filename
      ? `/uploads/products/${req.files.productImage[0].filename}`
      : null;

    // 1. Create Product
    const product = await Product.create({
      user_id: userId,
      type,
      title,
      description,
      price,
      currency,
      sale_price,
      is_on_sale: is_on_sale === "true" || is_on_sale === true,
      cta_text,
      success_heading,
      success_subheading,
      product_url,
      image_url: productImage,
    });

    // 2. Handle Digital Product Files/Links
    if (type === "DIGITAL") {
      const fileMetadata = req.body.fileMetadata
        ? JSON.parse(req.body.fileMetadata)
        : [];

      // Handle physical files from multer
      if (req.files?.productFile) {
        const fileRecords = req.files.productFile.map((file, index) => {
          const metadata = fileMetadata[index] || {};
          const fileImage = req.files.productFileImage?.[index]?.filename
            ? `/uploads/products/${req.files.productFileImage[index].filename}`
            : null;

          return {
            product_id: product.id,
            name: metadata.title || file.originalname,
            type: "FILE",
            url: `/uploads/product_files/${file.filename}`,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            image_url: fileImage,
          };
        });
        await ProductFile.bulkCreate(fileRecords);
      }

      // Handle raw links from body
      if (files) {
        const parsedFiles = Array.isArray(files) ? files : JSON.parse(files);
        
        let linkImageIndex = 0;
        const linkRecords = parsedFiles
          .filter((f) => f.type === "LINK")
          .map((f, index) => {
            const linkImage = req.files?.productLinkImage?.[linkImageIndex]?.filename
              ? `/uploads/products/${req.files.productLinkImage[linkImageIndex].filename}`
              : f.image_url || null;
            
            if (req.files?.productLinkImage?.[linkImageIndex]) {
              linkImageIndex++;
            }

            return {
              product_id: product.id,
              name: f.name || f.title,
              type: "LINK",
              url: f.url,
              size: null,
              image_url: linkImage,
            };
          });
        if (linkRecords.length > 0) {
          await ProductFile.bulkCreate(linkRecords);
        }
      }
    }

    // 3. Map to Profiles if provided
    if (profile_ids) {
      const profileIdsArray = Array.isArray(profile_ids)
        ? profile_ids
        : JSON.parse(profile_ids);
      
      const mappingRecords = profileIdsArray.map((profileId) => ({
        user_profile_id: profileId,
        product_id: product.id,
      }));
      await ProfileProduct.bulkCreate(mappingRecords);

      // Ensure a ProductCustomization row exists for every mapped profile
      await Promise.all(
        profileIdsArray.map((profileId) =>
          ProductCustomization.findOrCreate({
            where: { user_profile_id: profileId },
            defaults: { user_id: userId, user_profile_id: profileId },
          })
        )
      );
    }

    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductFile, as: "files" },
        { model: UserProfile, as: "profiles" },
      ],
    });

    // Normalize URLs
    const productData = fullProduct.toJSON();
    productData.image_url = HelperMethods.withBaseUrl(productData.image_url);
    if (productData.files) {
      productData.files = productData.files.map((file) => ({
        ...file,
        url: file.type === "FILE" ? HelperMethods.withBaseUrl(file.url) : file.url,
        image_url: HelperMethods.withBaseUrl(file.image_url),
      }));
    }

    return res.status(201).json({
      STATUS: "SUCCESS",
      MESSAGE: "Product created successfully",
      DATA: productData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({
      where: { user_id: userId },
      include: [
        { model: ProductFile, as: "files" },
        { model: UserProfile, as: "profiles" },
      ],
      order: [["created_at", "DESC"]],
    });

    const productsData = products.map((product) => {
      const p = product.toJSON();
      p.image_url = HelperMethods.withBaseUrl(p.image_url);
      if (p.files) {
        p.files = p.files.map((file) => ({
          ...file,
          url: file.type === "FILE" ? HelperMethods.withBaseUrl(file.url) : file.url,
          image_url: HelperMethods.withBaseUrl(file.image_url),
        }));
      }
      return p;
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      DATA: productsData,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, user_id: userId },
      include: [
        { model: ProductFile, as: "files" },
        { model: UserProfile, as: "profiles" },
      ],
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found" });
    }

    const productData = product.toJSON();
    productData.image_url = HelperMethods.withBaseUrl(productData.image_url);
    if (productData.files) {
      productData.files = productData.files.map((file) => ({
        ...file,
        url: file.type === "FILE" ? HelperMethods.withBaseUrl(file.url) : file.url,
        image_url: HelperMethods.withBaseUrl(file.image_url),
      }));
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      DATA: productData,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, user_id: userId },
      include: [{ model: ProductFile, as: "files" }],
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found" });
    }

    // ── 1. Update scalar fields ────────────────────────────────────────────────
    // Normalize body keys — trims accidental whitespace from field names (e.g. "delete_file_ids ")
    const body = Object.fromEntries(Object.entries(req.body).map(([k, v]) => [k.trim(), v]));
    const {
      title, description, price, currency, sale_price, is_on_sale,
      cta_text, success_heading, success_subheading, product_url,
      delete_file_ids,
      files,
      fileMetadata,
    } = body;

    // Reject unsafe/malformed URLs before persisting anything (anti stored-XSS).
    const urlError = validateProductUrls(product_url, files);
    if (urlError) return next(urlError);

    const scalarUpdate = {};
    if (title !== undefined)              scalarUpdate.title = title;
    if (description !== undefined)        scalarUpdate.description = description;
    if (price !== undefined)              scalarUpdate.price = price;
    if (currency !== undefined)           scalarUpdate.currency = currency;
    if (sale_price !== undefined)         scalarUpdate.sale_price = sale_price;
    if (is_on_sale !== undefined)         scalarUpdate.is_on_sale = is_on_sale === "true" || is_on_sale === true;
    if (cta_text !== undefined)           scalarUpdate.cta_text = cta_text;
    if (success_heading !== undefined)    scalarUpdate.success_heading = success_heading;
    if (success_subheading !== undefined) scalarUpdate.success_subheading = success_subheading;
    if (product_url !== undefined)        scalarUpdate.product_url = product_url;

    // ── 2. Replace product image ───────────────────────────────────────────────
    if (req.files?.productImage?.[0]) {
      // Delete old image from disk
      if (product.image_url) {
        const oldImgPath = path.join(process.cwd(), "public", product.image_url);
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }
      scalarUpdate.image_url = `/uploads/products/${req.files.productImage[0].filename}`;
    }

    if (Object.keys(scalarUpdate).length > 0) {
      await product.update(scalarUpdate);
    }

    // ── 3. Delete files by ID ──────────────────────────────────────────────────
    if (delete_file_ids) {
      const idsToDelete = Array.isArray(delete_file_ids)
        ? delete_file_ids.map(Number)
        : JSON.parse(delete_file_ids).map(Number);

      console.log("[updateProduct] delete_file_ids raw:", delete_file_ids);
      console.log("[updateProduct] idsToDelete parsed:", idsToDelete);
      console.log("[updateProduct] product.id:", product.id);

      // Query directly — more reliable than filtering association-loaded instances
      const filesToDelete = await ProductFile.findAll({
        where: { id: { [Op.in]: idsToDelete }, product_id: product.id },
      });

      for (const f of filesToDelete) {
        if (f.type === "FILE") {
          const filePath = path.join(process.cwd(), "public", f.url);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          if (f.image_url) {
            const thumbPath = path.join(process.cwd(), "public", f.image_url);
            if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
          }
        }
      }

      await ProductFile.destroy({
        where: { id: { [Op.in]: idsToDelete }, product_id: product.id },
      });
    }

    // ── 4. Add new uploaded FILES (digital downloads) ─────────────────────────
    if (req.files?.productFile?.length > 0) {
      const parsedMeta = fileMetadata ? JSON.parse(fileMetadata) : [];
      const newFileRecords = req.files.productFile.map((file, index) => {
        const metadata = parsedMeta[index] || {};
        const fileImage = req.files?.productFileImage?.[index]?.filename
          ? `/uploads/products/${req.files.productFileImage[index].filename}`
          : null;
        return {
          product_id: product.id,
          name: metadata.title || file.originalname,
          type: "FILE",
          url: `/uploads/product_files/${file.filename}`,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          image_url: fileImage,
        };
      });
      await ProductFile.bulkCreate(newFileRecords);
    }

    // ── 5. Add new LINK entries ────────────────────────────────────────────────
    if (files) {
      const parsedFiles = Array.isArray(files) ? files : JSON.parse(files);
      const linkEntries = parsedFiles.filter((f) => f.type === "LINK");

      let linkImageIndex = 0;
      const linkRecords = linkEntries.map((f) => {
        const linkImage = req.files?.productLinkImage?.[linkImageIndex]?.filename
          ? `/uploads/products/${req.files.productLinkImage[linkImageIndex].filename}`
          : f.image_url || null;
        if (req.files?.productLinkImage?.[linkImageIndex]) linkImageIndex++;
        return {
          product_id: product.id,
          name: f.name || f.title,
          type: "LINK",
          url: f.url,
          size: null,
          image_url: linkImage,
        };
      });
      if (linkRecords.length > 0) await ProductFile.bulkCreate(linkRecords);
    }

    // ── 6. Return full updated product ────────────────────────────────────────
    const fullProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductFile, as: "files" }],
    });

    const productData = fullProduct.toJSON();
    productData.image_url = HelperMethods.withBaseUrl(productData.image_url);
    if (productData.files) {
      productData.files = productData.files.map((file) => ({
        ...file,
        url: file.type === "FILE" ? HelperMethods.withBaseUrl(file.url) : file.url,
        image_url: HelperMethods.withBaseUrl(file.image_url),
      }));
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Product updated successfully",
      DATA: productData,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, user_id: userId },
      include: [{ model: ProductFile, as: "files" }],
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found" });
    }

    // Delete associated files from storage
    if (product.files) {
      product.files.forEach((file) => {
        if (file.type === "FILE") {
          const filePath = path.join(process.cwd(), "public", file.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    // Delete product image
    if (product.image_url) {
      const imgPath = path.join(process.cwd(), "public", product.image_url);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await product.destroy();

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const mapProductToProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, profile_ids } = req.body; 

    const product = await Product.findOne({
      where: { id: product_id, user_id: userId },
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found" });
    }

    // Clear existing mappings
    await ProfileProduct.destroy({ where: { product_id } });

    // Create new mappings
    if (profile_ids && Array.isArray(profile_ids)) {
      const mappingRecords = profile_ids.map((profileId) => ({
        user_profile_id: profileId,
        product_id,
      }));
      await ProfileProduct.bulkCreate(mappingRecords);

      // Ensure a ProductCustomization row exists for every mapped profile
      await Promise.all(
        profile_ids.map((profileId) =>
          ProductCustomization.findOrCreate({
            where: { user_profile_id: profileId },
            defaults: { user_id: product.user_id, user_profile_id: profileId },
          })
        )
      );
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Product mapped to profiles successfully",
    });
  } catch (error) {
    console.error("Error mapping product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const unmapProductFromProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, profile_ids } = req.body; 

    console.log("Unmapping request:", { product_id, userId, profile_ids });

    const product = await Product.findOne({
      where: { id: product_id, user_id: userId },
    });

    if (!product) {
      return res.status(404).json({ 
        STATUS: "ERROR", 
        MESSAGE: "Product not found",
        DEBUG: {
            received_id: product_id,
            request_user_id: userId
        }
      });
    }

    if (profile_ids && Array.isArray(profile_ids)) {
      await ProfileProduct.destroy({
        where: {
          product_id,
          user_profile_id: profile_ids,
        },
      });
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Product unmapped from profiles successfully",
    });
  } catch (error) {
    console.error("Error unmapping product:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const getProfileProducts = async (req, res) => {
  try {
    const { user_profile_id } = req.params;

    // 1. Fetch Section Customization
    const customization = await ProductCustomization.findOne({
      where: { user_profile_id },
    });

    // 2. Fetch Mapped Products with Files and Individual Settings
    const products = await Product.findAll({
      include: [
        {
          model: UserProfile,
          as: "profiles",
          where: { id: user_profile_id },
          attributes: [], // We don't need profile data, just the filter
        },
        { model: ProductFile, as: "files" },
        { 
          model: ProfileProductSetting, 
          as: "displaySettings",
          where: { user_profile_id },
          required: false, 
        },
      ],
      order: [
        [{ model: ProfileProductSetting, as: "displaySettings" }, "sequence", "ASC"],
        ["created_at", "DESC"],
      ],
    });

    // 3. Normalize URLs
    const normalizedCustomization = customization ? customization.toJSON() : null;
    const normalizedProducts = products.map((product) => {
      const p = product.toJSON();
      p.image_url = HelperMethods.withBaseUrl(p.image_url);
      if (p.files) {
        p.files = p.files.map((file) => ({
          ...file,
          url: file.type === "FILE" ? HelperMethods.withBaseUrl(file.url) : file.url,
          image_url: HelperMethods.withBaseUrl(file.image_url),
        }));
      }
      
      // Flatten display settings if they exist
      const settings = p.displaySettings?.[0] || null;
      p.is_visible = settings ? settings.is_visible : true;
      p.sequence = settings ? settings.sequence : 0;
      delete p.displaySettings;

      return p;
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      DATA: {
        customization: normalizedCustomization,
        products: normalizedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching profile products:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};
