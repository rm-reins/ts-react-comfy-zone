import axios from "axios";
import { z } from "zod";

const API_URL = `${import.meta.env.CLIENT_URL}/api/trpc`;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const ImageResponseSchema = z.object({
  url: z.string().url(),
  id: z.string(),
});

export type ImageResponse = z.infer<typeof ImageResponseSchema>;

export const uploadProductImage = async (
  file: File
): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return ImageResponseSchema.parse(response.data);
};

export const uploadReviewImage = async (file: File): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload/review", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return ImageResponseSchema.parse(response.data);
};
