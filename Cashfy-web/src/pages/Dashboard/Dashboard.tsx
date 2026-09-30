
import { useShallow } from 'zustand/shallow'
import { MonthlyExpenses } from '../../components/ui/MonthlyExpenses/MonthlyExpenses'
import { TotalBalance } from '../../components/ui/TotalBalance/TotalBalance'
import { WeeklyExpense } from '../../components/ui/WeeklyExpense/WeeklyExpense'
import { userStore } from '../../store/userStore'
import styles from './Dashboard.module.css'
import { useEffect } from 'react'
import { useCategory } from '../../hooks/useCategory'
import { useTransaction } from '../../hooks/useTransaction'

export const Dashboard = () => {
    const { getAllTransactions } = useTransaction()
    const { getAllCategories } = useCategory()

    const { user } = userStore(useShallow((state) => ({
        user: state.user,
    })));

    useEffect(() => {
        const loadData = async () => {
            try {
                await getAllTransactions();
                await getAllCategories();
            } catch (e) {
                console.log("Error loading data: ", e);
            }
        };

        void loadData();
    }, [])

    return (
        <div className={styles.container}>
            <h1>¡Hello {user?.username}!</h1>
            <h3>Welcome to Cashfy,
                Summary of your current financial health</h3>
            <div className={styles.balanceContainer}>
                <TotalBalance />
            </div>
            <div className={styles.MonthlyWeeklyExpenses}>
                <MonthlyExpenses />
                <WeeklyExpense />
            </div>
        </div>
    )
}