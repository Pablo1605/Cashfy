import apiClient from "./http";
import type { Transaction, TransactionType, CreateTransactionRequest, UpdateTransactionRequest } from "../types/Transaction";

export type TransactionFilterParams = {
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
    category?: string;
};

export const getTransactions = async (filters?: TransactionFilterParams): Promise<Transaction[]> => {
    const response = await apiClient.get("/api/transactions", {
        params: filters,
    });
    return response.data;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/api/transactions/${id}`);
    return response.data;
};

export const createTransaction = async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post("/api/transactions", data);
    return response.data;
};

export const updateTransaction = async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.put(`/api/transactions/${id}`, data);
    return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/transactions/${id}`);
};