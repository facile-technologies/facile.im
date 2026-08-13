import { ProfileProductSetting } from "../models/Association.js";

export const updateProfileProductSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      user_profile_id,
      product_id,
      is_visible,
      sequence,
    } = req.body;

    if (!user_profile_id || !product_id) {
      return res.status(400).json({ 
        STATUS: "ERROR", 
        MESSAGE: "user_profile_id and product_id are required" 
      });
    }

    const [setting, created] = await ProfileProductSetting.findOrCreate({
      where: { user_profile_id, product_id, user_id: userId },
      defaults: {
        is_visible,
        sequence,
      },
    });

    if (!created) {
      await setting.update({
        is_visible: is_visible !== undefined ? is_visible : setting.is_visible,
        sequence: sequence !== undefined ? sequence : setting.sequence,
      });
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: `Product display settings ${created ? "created" : "updated"} successfully`,
      DATA: setting,
    });
  } catch (error) {
    console.error("Error updating profile product settings:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const getProfileProductSettings = async (req, res) => {
  try {
    const { user_profile_id } = req.params;
    const userId = req.user.id;

    const settings = await ProfileProductSetting.findAll({
      where: { user_profile_id, user_id: userId },
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      DATA: settings,
    });
  } catch (error) {
    console.error("Error fetching profile product settings:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};
