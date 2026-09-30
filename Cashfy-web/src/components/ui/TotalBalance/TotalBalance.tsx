import styles from './TotalBalance.module.css';
import { useEffect, useState } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import type { DashboardSummaryResponse } from '../../../types/Dashboard';

export const TotalBalance = () => {
    const { loadDashboardSummary } = useDashboard();
    const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadDashboardSummary();
            setDashboardData(data);
        };
        void fetchData();
    }, []);

    if (!dashboardData) {
        return (
            <div className={styles.balance}>
                <p>Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className={styles.balance}>
            <div className={styles.balanceContainer}>
                <h2>Total Balance</h2>
                
                <div className={styles.mainBalance}>
                    <span className={styles.balanceLabel}>Available Balance</span>
                    <span className={`${styles.balanceAmount} ${dashboardData.balance >= 0 ? styles.positive : styles.negative}`}>
                        ${dashboardData.balance.toFixed(2)}
                    </span>
                </div>

                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>Total revenue</span>
                        <span className={`${styles.summaryAmount} ${styles.income}`}>
                            +${dashboardData.totalIncome.toFixed(2)}
                        </span>
                    </div>
                    
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>Total expenses</span>
                        <span className={`${styles.summaryAmount} ${styles.expense}`}>
                            -${dashboardData.totalExpense.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>Total income (Current Month)</span>
                        <span className={`${styles.summaryAmount} ${styles.income}`}>
                            +${dashboardData.monthlyIncome.toFixed(2)}
                        </span>
                    </div>
                    
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>Total expenses (Current Month)</span>
                        <span className={`${styles.summaryAmount} ${styles.expense}`}>
                            -${dashboardData.monthlyExpenses.toFixed(2)}
                        </span>
                    </div> 
                </div>
            </div>
        </div>
    );
};