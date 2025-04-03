import axios from "axios";

const API_URL = `${import.meta.env.CLIENT_URL}/api/trpc`;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadReviewImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload/review", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
