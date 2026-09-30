
import { useEffect, useMemo, useState } from 'react';
import { TransactionCard } from '../../components/ui/TransactionCard/TransactionCard'
import { TransactionModal } from '../../components/ui/TransactionModal/TransactionModal'
import styles from './Transactions.module.css'
import { useTransaction } from '../../hooks/useTransaction';
import type { CreateTransactionRequest, Transaction } from '../../types/Transaction';
import { useCategory } from '../../hooks/useCategory';

export const Transactions = () => {
    const { transactions, getAllTransactions, addNewTransaction, putEditTransaction, putDeleteTransaction } = useTransaction()
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all' );
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 

    const { categories, getAllCategories } = useCategory()

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await getAllTransactions();
                await getAllCategories();
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [])

    const handleOpenCreate = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleAddTransaction = async (data: CreateTransactionRequest) => {
        try {
            await addNewTransaction(data);
            setIsModalOpen(false);
        } catch (error) {
            setError('Error adding transaction');
        }
    };

    const handleEditTransaction = (id: string) => {
        const transaction = transactions.find((c) => c.id === id);
        if (!transaction) {
            setError('Transaction not found');
            return;
        }
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleSaveEditTransaction = async (data: CreateTransactionRequest) => {
        if (!editingTransaction?.id) return;

        try {
            await putEditTransaction(editingTransaction.id, data);
            await getAllTransactions();
            setEditingTransaction(null);
            setIsModalOpen(false);
        } catch (error) {
            setError('Error updating transaction');
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        try {
            await putDeleteTransaction(id);
        } catch (error) {
            setError('Error deleting transaction');
        }
    };

    const handleCloseModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(false);
    };

    const filteredTransactions = useMemo(() => {
        let result = transactions;

        if (selectedCategoryId !== 'all') { 
            result = result.filter((transaction) => {
                return (
                    transaction.categoryId === selectedCategoryId ||
                    transaction.category === selectedCategoryId
                );
            });
        }

        return [...result].sort((a, b) => { 
            if (sortOrder === 'desc') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [transactions, selectedCategoryId, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage)); 

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1); 
    }, [filteredTransactions.length, currentPage, totalPages]);

    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage); 
    }, [filteredTransactions, currentPage]);

    return (
        <div className={styles.container}>
            <div className={styles.tittleButton}>
                <h1>Transaction history</h1>
                <button onClick={handleOpenCreate}>Add Transaction</button>
            </div>
            <div className={styles.filtersContainer}>
                <div className={styles.filters}>

                <label htmlFor="category">Category:</label>
                <select
                    name="category"
                    id="category"
                    value={selectedCategoryId}
                    onChange={(event) => setSelectedCategoryId(event.target.value)}
                >
                    <option value="all">All</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className={styles.filters}>

                <label htmlFor="order">Order by:</label>
                <select
                    name="order"
                    id="order"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
                >
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                </select>
                </div>
            </div>
            <div className={styles.cardsContainer}>
                {loading && <p>Loading transaction...</p>}
                {error && <p>{error}</p>}
                {filteredTransactions.length === 0 ? (
                    <p>No transactions found.</p>
                ) : (
                    paginatedTransactions.map((transaction) => {
                        const associatedCategory = categories.find(
                            (cat) =>
                                cat.id === transaction.categoryId ||
                                cat.id === transaction.category ||
                                cat.name.toLowerCase() === transaction.category?.toLowerCase()
                        );
                        return (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                handleEditTransaction={handleEditTransaction}
                                handleDeleteTransaction={handleDeleteTransaction}
                                category={associatedCategory}
                            />
                        );
                    })
                )}
            </div>
            <div className={styles.paginationContainer}> 
                <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    &lt; 
                </button>
                <span className={styles.pageInfo}>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
            {isModalOpen &&
                <TransactionModal
                    isOpen={isModalOpen}
                    selectedTransaction={editingTransaction}
                    onClose={handleCloseModal}
                    onCreate={handleAddTransaction}
                    onSave={handleSaveEditTransaction}
                    categories={categories}
                />
            }
        </div>
    )
}