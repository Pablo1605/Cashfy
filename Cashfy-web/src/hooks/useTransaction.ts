import { useShallow } from "zustand/shallow";
import { transactionStore } from "../store/transactionStore";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    type TransactionFilterParams,
} from "../api/transactionApi";
import type { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from "../types/Transaction";

export const useTransaction = () => {
    const { transactions, setTransactions, addTransaction, editTransactionById, removeTransactionById } = transactionStore(useShallow((state) => ({
        transactions: state.transactions,
        setTransactions: state.setTransactions,
        addTransaction: state.addTransaction,
        editTransactionById: state.editTransactionById,
        removeTransactionById: state.removeTransactionById,
    })));

    const getAllTransactions = async (filters?: TransactionFilterParams): Promise<Transaction[]> => {
        const fetchedTransactions = await getTransactions(filters);
        setTransactions(fetchedTransactions);
        return fetchedTransactions;
    };

    const getTransaction = async (id: string): Promise<Transaction> => {
        return getTransactionById(id);
    };

    const addNewTransaction = async (data: CreateTransactionRequest): Promise<Transaction> => {
        const createdTransaction = await createTransaction(data);
        addTransaction(createdTransaction);
        return createdTransaction;
    };

    const putEditTransaction = async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
        const updatedTransaction = await updateTransaction(id, data);
        editTransactionById(id, updatedTransaction);
        return updatedTransaction;
    };

    const putDeleteTransaction = async (id: string): Promise<void> => {
        await deleteTransaction(id);
        removeTransactionById(id);
    };

    return { transactions, getAllTransactions, getTransaction, addNewTransaction, putEditTransaction, putDeleteTransaction };
};