import apiClient from "./http";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types/Category";

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get("/api/categories");
    return response.data;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post("/api/categories", data);
    return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put(`/api/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
};
