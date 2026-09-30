import type { FC } from 'react';
import type { Transaction } from '../../../types/Transaction';
import styles from './TransactionCard.module.css'
import type { Category } from '../../../types/Category';

interface TransactionCardProps {
    transaction: Transaction;
    handleEditTransaction: (id: string) => void;
    handleDeleteTransaction: (id: string) => void;
    category: Category | undefined;
}

export const TransactionCard: FC<TransactionCardProps> = ({ transaction, handleEditTransaction, handleDeleteTransaction, category }) => {
    return (
        <div className={styles.card}>
            <div className={styles.infoContainer}>

                <div className={styles.dateIcon}>
                    <p>{transaction.date}</p>
                    {category ? (
                        <span style={{ color: category.color || '#000000' }}>
                            {category.icon} {category.name}
                        </span>
                    ) : (
                        <span>📁 {transaction.category || "No category"}</span>
                    )}
                </div>
                <div className={styles.descriptionType}>

                <p>{transaction.description}</p>
                <p>{transaction.type}</p>
                </div>
            </div>
            <div className={styles.cardButtons}>
                <button onClick={() => {
                    handleEditTransaction(transaction.id)
                }}>Edit</button>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            </div>
            <p>${transaction.amount}</p>
        </div>
    )
}