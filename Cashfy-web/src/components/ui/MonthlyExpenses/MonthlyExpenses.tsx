import styles from './MonthlyExpenses.module.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { useCategory } from '../../../hooks/useCategory';
import { useTransaction } from '../../../hooks/useTransaction';
import type { Transaction } from '../../../types/Transaction';
import type { Category } from '../../../types/Category';

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_CATEGORY_COLOR = '#c7c7c7';

const hexToRgba = (hex: string, alpha: number): string => { 
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return `rgba(199, 199, 199, ${alpha})`;

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const resolveCategory = (transaction: Transaction, categories: Category[]): Category | undefined => { 
    return categories.find( 
        (cat) =>
            cat.id === transaction.categoryId ||
            cat.id === transaction.category ||
            cat.name.toLowerCase() === transaction.category?.toLowerCase()
    );
};

export const MonthlyExpenses = () => {

    const { categories, getAllCategories } = useCategory()
    const { transactions, getAllTransactions } = useTransaction()

    useEffect(() => {
        void getAllCategories()
        void getAllTransactions()
    }, [])

    const { labels, data, backgroundColors, borderColors, totalExpense, topCategory } = useMemo(() => { 
        const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');

        type CategoryAggregate = { name: string; color: string; amount: number };
        const expensesByCategory: Record<string, CategoryAggregate> = {}; 

        expenseTransactions.forEach(transaction => {
            const category = resolveCategory(transaction, categories);
            const key = category?.id ?? 'uncategorized';
            const name = category?.name ?? 'Sin categoría';
            const color = category?.color ?? DEFAULT_CATEGORY_COLOR;

            if (!expensesByCategory[key]) { 
                expensesByCategory[key] = { name, color, amount: 0 };
            }

            expensesByCategory[key].amount += Number(transaction.amount);
        });

        const sortedCategories = Object.values(expensesByCategory).sort((a, b) => b.amount - a.amount); 

        let total = 0;
        let topCat = '';
        sortedCategories.forEach((entry, index) => { 
            total += entry.amount; 
            if (index === 0) topCat = entry.name; 
        });

        return { 
            labels: sortedCategories.map((entry) => entry.name), 
            data: sortedCategories.map((entry) => entry.amount),
            backgroundColors: sortedCategories.map((entry) => hexToRgba(entry.color, 0.5)),
            borderColors: sortedCategories.map((entry) => entry.color),
            totalExpense: total,
            topCategory: topCat,
        };
    }, [transactions, categories]) 

    return (
        <div className={styles.monthlyExpense}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>Monthly Expenses</h2>
                <p>Total spent: <strong>${totalExpense.toFixed(2)}</strong></p>
                {topCategory && <p>Highest spending category: <strong>{topCategory}</strong></p>}
            </div>
            <div className={styles.pieChart}>

                <Pie data={{
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                }} />
            </div>
        </div>
    )
}