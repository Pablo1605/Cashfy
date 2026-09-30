import { create } from "zustand";
import type { Transaction } from "../types/Transaction";

interface TransactionState {
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
    addTransaction: (transaction: Transaction) => void;
    editTransaction: (oldTransaction: Transaction, newTransaction: Transaction) => void;
    editTransactionById: (id: string, newTransaction: Transaction) => void;
    removeTransaction: (transaction: Transaction) => void;
    removeTransactionById: (id: string) => void;
}

export const transactionStore = create<TransactionState>((set) => ({
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
    editTransaction: (oldTransaction, newTransaction) => set((state) => ({
        transactions: state.transactions.map((t) => (t === oldTransaction ? newTransaction : t))
    })),
    editTransactionById: (id, newTransaction) => set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? newTransaction : t))
    })),
    removeTransaction: (transaction) => set((state) => ({ transactions: state.transactions.filter((t) => t !== transaction) })),
    removeTransactionById: (id) => set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),
}));
