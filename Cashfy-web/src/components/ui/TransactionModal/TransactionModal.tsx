import { useEffect, useMemo, useState, type FC } from "react";
import type { CreateTransactionRequest, Transaction, TransactionType } from "../../../types/Transaction";
import styles from "./TransactionModal.module.css"
import { useCategory } from "../../../hooks/useCategory";
import type { Category } from "../../../types/Category";

interface TransactionModalProps {
    isOpen: boolean;
    selectedTransaction: Transaction | null;
    onClose: () => void;
    onCreate: (data: CreateTransactionRequest) => Promise<void>;
    onSave: (data: CreateTransactionRequest) => Promise<void>;
    categories: Category[];
}

export const TransactionModal: FC<TransactionModalProps> = ({ isOpen, selectedTransaction, onClose, onCreate, onSave, categories }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [amount, setAmount] = useState(0);
    const [categoryId, setCategory] = useState('')
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")

    const {getAllCategories} = useCategory()
    useEffect(()=> {
        getAllCategories()
    }, [])

    const filteredCategories = useMemo(
        () => categories.filter((category) => category.type === type),
        [categories, type]
    );

    const handleTypeChange = (newType: TransactionType) => { 
        setType(newType);
        setCategory(''); 
    };

    const resolveCategoryId = (transaction: Transaction | null) => {
        if (!transaction) return '';
        if (transaction.categoryId) return transaction.categoryId;
        if (transaction.category) {
            const matchedCategory = categories.find(
                (category) =>
                    category.id === transaction.category ||
                    category.name.toLowerCase() === transaction.category?.toLowerCase()
            );
            return matchedCategory?.id ?? transaction.category;
        }
        return '';
    };

    useEffect(() => {
        if (selectedTransaction) {
            setType(selectedTransaction.type);
            setAmount(selectedTransaction.amount);
            setCategory(resolveCategoryId(selectedTransaction));
            setDate(selectedTransaction.date);
            setDescription(selectedTransaction.description);
            setError(null);
        } else {
            setType("EXPENSE");
            setAmount(0);
            setCategory('');
            setDate("");
            setDescription("");
            setError(null);
        }
    }, [selectedTransaction, categories]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount <= 0 || !type || !categoryId || !date || !description?.trim()) {
            setError("All fields are required");
            return;
        }

        const payload: CreateTransactionRequest = {
            amount,
            type,
            categoryId,
            date,
            description,
        };

        try {
            setLoading(true);
            setError(null);

            if (selectedTransaction) {
                await onSave(payload);
            } else {
                await onCreate(payload);
            }

            onClose();
        } catch {
            setError("Failed to save transaction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    const formatDateForInput = (dateValue: string) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return ""; 
    
    return d.toISOString().split('T')[0];
};

    return (
        <div className={styles.containerPrincipal}>
            <div className={styles.containerSecundario}>
                <button className={styles.buttonExitModal} type="button" onClick={onClose} disabled={loading}>
                    X
                </button>
                <h1>TransactionModal</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p>{error}</p>}
                    <div className={styles.checkBoxContainer}>
                        <label htmlFor="type">Type of movement</label>
                        <div className={styles.checkBox}>
                            <div>
                                <label htmlFor="expense">Expense:</label>
                                <input
                                    type="checkbox"
                                    id="expense"
                                    name="expense"
                                    value="EXPENSE"
                                    checked={type === "EXPENSE"}
                                    onChange={() => handleTypeChange("EXPENSE")}
                                />
                            </div>
                            <div>
                                <label htmlFor="income">Income:</label>
                                <input
                                    type="checkbox"
                                    id="income"
                                    name="income"
                                    value="INCOME"
                                    checked={type === "INCOME"}
                                    onChange={() => handleTypeChange("INCOME")}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={formatDateForInput(date)}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.buttonModal} type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}