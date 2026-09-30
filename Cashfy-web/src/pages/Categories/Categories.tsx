import { useEffect, useMemo, useState } from 'react';
import { CategoryCard } from '../../components/ui/CategoryCard/CategoryCard';
import { CetegoryModal } from '../../components/ui/CetegoryModal/CetegoryModal';
import { useCategory } from '../../hooks/useCategory';
import styles from './Categories.module.css';
import type { Category, CreateCategoryRequest } from '../../types/Category';

export const Categories = () => {
    const { categories, getAllCategories, addNewCategory, putEditCategory, putDeleteCategory } = useCategory();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                await getAllCategories();
            } finally {
                setLoading(false);
            }
        };

        void loadCategories();
    }, []);

    const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [categories.length, currentPage, totalPages]);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return categories.slice(startIndex, startIndex + itemsPerPage);
    }, [categories, currentPage]);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleAddCategory = async (data: CreateCategoryRequest) => {
        try {
            await addNewCategory(data);
            setIsModalOpen(false);
        } catch (error) {
            setError('Error adding category');
        }
    };

    const handleEditCategory = (id: string) => {
        const category = categories.find((c) => c.id === id);
        if (!category) {
            setError('Category not found');
            return;
        }
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSaveEditCategory = async (data: CreateCategoryRequest) => {
        if (!editingCategory?.id) return;

        try {
            await putEditCategory(editingCategory.id, data);
            setEditingCategory(null);
            setIsModalOpen(false);
        } catch (error) {
            setError('Error updating category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await putDeleteCategory(id);
        } catch (error) {
            setError('Error deleting category');
        }
    };

    const handleCloseModal = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tittleButton}>
                <h1>Category maintenance</h1>
                <button onClick={handleOpenCreate}>Add Category</button>
            </div>
            <div className={styles.cardsContainer}>
                {loading && <p>Loading categories...</p>}
                {error && <p>{error}</p>}
                {categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    paginatedCategories.map((category) => (
                        <CategoryCard 
                         key={category.id} 
                         category={category}
                         handleEditCategory={handleEditCategory}
                         handleDeleteCategory={handleDeleteCategory}
                        />
                    ))
                )}
            </div>
            <div className={styles.paginationContainer}>
                <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className={styles.pageInfo}>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
            {isModalOpen &&
            <CetegoryModal
                isOpen={isModalOpen}
                selectedCategory={editingCategory}
                onClose={handleCloseModal}
                onCreate={handleAddCategory}
                onSave={handleSaveEditCategory}
            />
            }
        </div>
    );
};