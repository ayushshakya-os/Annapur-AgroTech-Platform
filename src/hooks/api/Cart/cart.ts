import AxiosWrapper from "../AxiosWrapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchCart = async (userId: string) => {
  const res = await AxiosWrapper.get(`${API_URL}/cart/${userId}`, {
    withCredentials: true,
  });
  return res.data.cart;
};

export const addToCartApi = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const res = await AxiosWrapper.post(
    `${API_URL}/cart/${userId}/add`,
    { productId, quantity },
    { withCredentials: true }
  );
  return res.data.cart;
};

export const updateCartItemApi = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const res = await AxiosWrapper.put(
    `${API_URL}/cart/${userId}/update/${productId}`,
    { quantity },
    { withCredentials: true }
  );
  return res.data.cart;
};

export const removeFromCartApi = async (userId: string, productId: string) => {
  const res = await AxiosWrapper.delete(
    `${API_URL}/cart/${userId}/remove/${productId}`,
    { withCredentials: true }
  );
  return res.data.cart;
};

export const clearCartApi = async (userId: string) => {
  const res = await AxiosWrapper.delete(`${API_URL}/cart/${userId}/clear`, {
    withCredentials: true,
  });
  return res.data.cart;
};
