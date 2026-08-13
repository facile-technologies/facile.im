import api from "../store/api/api";
const profileID = localStorage.getItem("userProfileID");

/**
 * Fetch all products for the logged-in user
 * @returns { STATUS, DATA[] } Array of product objects
 */
export const getProducts = async () => {
  try {
    const response = await api.get("/v1/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const getProductsByID = async () => {
  try {
    const response = await api.get(`/v1/products/profile/${profileID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Map a product to multiple profiles
 * @param {number} productId - Product ID
 * @param {number[]} profileIds - Array of user_profile_ids
 */
export const mapProductToProfiles = async (productId, profileIds) => {
  try {
    const response = await api.post("/v1/products/map", {
      product_id: productId,
      profile_ids: profileIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error mapping product to profiles:", error);
    throw error;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product details
 */
export const createProduct = async (formData) => {
  try {
    const response = await api.post("/v1/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product details
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/v1/products/${productId}`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {number} productId - Product ID
 */
export const deleteProduct = async ({ product_id, profile_ids }) => {
  try {
    const response = await api.delete(`/v1/products/unmap`, {
      data: {
        product_id,
        profile_ids,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const productCustomizationSettings = async (data) => {
  try {
    const response = await api.post("/v1/products/settings", data); // ✅ JSON
    return response.data;
  } catch (error) {
    console.error("Error updating product settings:", error);
    throw error;
  }
};
export const productCustomization = async (data) => {
  try {
    const response = await api.post("/v1/products/customization", data); // ✅ no headers
    return response.data;
  } catch (error) {
    console.error("Error saving customization:", error);
    throw error;
  }
};

export default {
  getProducts,
  mapProductToProfiles,
  createProduct,
  updateProduct,
  deleteProduct,
};
