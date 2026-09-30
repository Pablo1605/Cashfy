export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
    id: string;
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
    category?: string;
    categoryId?: string;
};

export type CreateTransactionRequest = {
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
    categoryId: string;
};

export type UpdateTransactionRequest = CreateTransactionRequest;