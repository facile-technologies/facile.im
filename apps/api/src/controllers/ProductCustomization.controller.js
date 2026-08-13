import { ProductCustomization } from "../models/Association.js";

export const getProductCustomization = async (req, res) => {
  try {
    const { user_profile_id } = req.params;
    const userId = req.user.id;

    const customization = await ProductCustomization.findOne({
      where: { user_profile_id, user_id: userId },
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      DATA: customization,
    });
  } catch (error) {
    console.error("Error fetching product customization:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const updateProductCustomization = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      user_profile_id,
      layout,
      main_color,
      button_bg_color,
      button_text_color,
      is_visible,
      sequence,
    } = req.body;

    if (!user_profile_id) {
      return res.status(400).json({ STATUS: "ERROR", MESSAGE: "user_profile_id is required" });
    }

    const [customization, created] = await ProductCustomization.findOrCreate({
      where: { user_profile_id, user_id: userId },
      defaults: {
        layout,
        main_color,
        button_bg_color,
        button_text_color,
        is_visible,
        sequence,
      },
    });

    if (!created) {
      await customization.update({
        layout,
        main_color,
        button_bg_color,
        button_text_color,
        is_visible,
        sequence,
      });
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: `Product customization ${created ? "created" : "updated"} successfully`,
      DATA: customization,
    });
  } catch (error) {
    console.error("Error updating product customization:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};
