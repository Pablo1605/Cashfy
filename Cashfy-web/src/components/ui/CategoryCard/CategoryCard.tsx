import type { FC } from 'react';
import type { Category } from '../../../types/Category';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
    category: Category;
    handleEditCategory: (id: string) => void;
    handleDeleteCategory: (id: string) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, handleEditCategory, handleDeleteCategory }) => {
    return (
        <div className={styles.card}>
            <div className={styles.infoContainer}>

            <p className={styles.name} style={{ color: category.color || '#000000' }}>
                {category.icon || '🏷️'} {category.name}
            </p>
            <p>{category.type}</p>
            </div>
            <div className={styles.cardButtons}>
                <button onClick={() => handleEditCategory(category.id)}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </div>
        </div>
    )
}