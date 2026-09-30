import { useShallow } from "zustand/shallow";
import { categoryStore } from "../store/categoryStore";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categoryApi";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types/Category";

export const useCategory = () => {
    const { categories, setCategories, addCategory, editCategoryById, removeCategoryById } = categoryStore(useShallow((state) => ({
        categories: state.categories,
        setCategories: state.setCategories,
        addCategory: state.addCategory,
        editCategoryById: state.editCategoryById,
        removeCategoryById: state.removeCategoryById,
    })));

    const getAllCategories = async (): Promise<Category[]> => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        return fetchedCategories;
    };

    const addNewCategory = async (data: CreateCategoryRequest): Promise<Category> => {
        const createdCategory = await createCategory(data);
        addCategory(createdCategory);
        return createdCategory;
    };

    const putEditCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
        const updatedCategory = await updateCategory(id, data);
        editCategoryById(id, updatedCategory);
        return updatedCategory;
    };

    const putDeleteCategory = async (id: string): Promise<void> => {
        await deleteCategory(id);
        removeCategoryById(id); 
    };

    return { categories, getAllCategories, addNewCategory, putEditCategory, putDeleteCategory };
};