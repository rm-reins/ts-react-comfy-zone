import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export interface PaginationResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getPagination = ({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
