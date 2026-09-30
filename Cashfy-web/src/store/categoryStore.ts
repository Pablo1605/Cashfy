import { create } from "zustand";
import type { Category } from "../types/Category";

interface CategoryState {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    editCategory: (oldCategory: Category, newCategory: Category) => void;
    editCategoryById: (id: string, newCategory: Category) => void;
    removeCategory: (category: Category) => void;
    removeCategoryById: (id: string) => void;
    activeCategory: Category | null;
    setActiveCategory: (category: Category | null) => void;
}

export const categoryStore = create<CategoryState>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
    editCategory: (oldCategory, newCategory) => set((state) => ({
        categories: state.categories.map((c) => (c === oldCategory ? newCategory : c))
    })),
    editCategoryById: (id, newCategory) => set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? newCategory : c))
    })),
    removeCategory: (category) => set((state) => ({ categories: state.categories.filter((c) => c !== category) })),
    removeCategoryById: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
    activeCategory: null,
    setActiveCategory: (category) => set({ activeCategory: category }),
}));