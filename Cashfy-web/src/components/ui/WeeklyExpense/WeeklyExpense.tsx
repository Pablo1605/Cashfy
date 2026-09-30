import { Bar } from 'react-chartjs-2';
import styles from './WeeklyExpense.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTransaction } from '../../../hooks/useTransaction';
import { useCategory } from '../../../hooks/useCategory';
import { useEffect } from 'react';
import type { Transaction } from '../../../types/Transaction';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const WeeklyExpense = () => {
    const { transactions, getAllTransactions } = useTransaction()
    const { getAllCategories } = useCategory()

    useEffect(() => {
        void getAllTransactions()
        void getAllCategories()
    }, [])

    const getLast7DaysLabels = () => { 
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i)); 
            return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        });
    };

    const getExpensesData = (transactions: Transaction[]) => { 
        const labels = getLast7DaysLabels();

        const expensesByDate = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => { 
                const localDate = typeof t.date === 'string' ? t.date.replace(/-/g, '\/') : t.date; 
                const dateStr = new Date(localDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }); 
                if (acc[dateStr] !== undefined) { 
                    acc[dateStr] += Number(t.amount); 
                }
                return acc;
            }, labels.reduce((acc, label) => ({ ...acc, [label]: 0 }), {})); 
        return labels.map(label => expensesByDate[label] || 0);
    };

    const getIncomeData = (transactions: Transaction[]) => {
        const labels = getLast7DaysLabels();

        const expensesByDate = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, t) => {
                const localDate = typeof t.date === 'string' ? t.date.replace(/-/g, '\/') : t.date;
                const dateStr = new Date(localDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                if (acc[dateStr] !== undefined) {
                    acc[dateStr] += Number(t.amount);
                }
                return acc;
            }, labels.reduce((acc, label) => ({ ...acc, [label]: 0 }), {}));
        return labels.map(label => expensesByDate[label] || 0);  
    }

    return (
        <div className={styles.table}>
            <h2>Transactions in last 7 days</h2>
            <p>Total expenses: <strong>${getExpensesData(transactions).reduce((a, b) => a + b, 0).toFixed(2)}</strong>  -  Total incomes: <strong>${getIncomeData(transactions).reduce((a, b) => a + b, 0).toFixed(2)}</strong> </p>
            <div className={styles.barChart}>

                <Bar
                    data={{
                        labels: getLast7DaysLabels(),
                        datasets: [
                            {
                                label: 'Expenses',
                                data: getExpensesData(transactions),
                                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                                borderColor: 'rgb(245, 91, 91)',
                                borderWidth: 1
                            },
                            {
                                label: 'Incomes',
                                data: getIncomeData(transactions),
                                backgroundColor: 'rgba(54, 235, 84, 0.2)',
                                borderColor: 'rgb(54, 235, 114)',
                                borderWidth: 1
                            }
                        ]
                    }}
                />
            </div>
        </div>
    )
}  