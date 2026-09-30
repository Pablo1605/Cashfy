export type CategoryType = "INCOME" | "EXPENSE";


export type Category = {
    id: string;
    userId?: string;
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
};

export type CreateCategoryRequest = {
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
};

export type UpdateCategoryRequest = CreateCategoryRequest;