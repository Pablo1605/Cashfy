
import styles from "./Header.module.css";
import { userStore } from "../../../store/userStore";
import { useNavigate } from "react-router";

export const Header = () => {
    const navigate = useNavigate();
    const { logout } = userStore()

    const toDashboard = () => {
        navigate("/")
    }

    const toTransactions = () => {
        navigate("/transactions")
    }

    const toCategories = () => {
        navigate("/categories")
    }

    const isDashboard = location.pathname === "/";
    const isTransactions = location.pathname === "/transactions";
    const isCategories = location.pathname === "/categories";

    return (
        <div className={styles.principalContainer}>
            <div className={styles.secondaryContainer}>
                    <h2><img className={styles.logo} src="CashFy.svg" alt="CashFy"/></h2>
                <div className={styles.pageButtons}>
                    <button className={`${styles.buttonStyle} ${isDashboard ? styles.activeButton : ""}`} onClick={toDashboard}>Dashboard</button>
                    <button className={`${styles.buttonStyle} ${isTransactions ? styles.activeButton : ""}`} onClick={toTransactions}>Transactions</button>
                    <button className={`${styles.buttonStyle} ${isCategories ? styles.activeButton : ""}`} onClick={toCategories}>Categories</button>
                </div>
                <div>
                    <button className={styles.logOutButton} onClick={logout}><span className="material-symbols-outlined">
                        logout
                    </span> Log out</button>
                </div>
            </div>
        </div>
    )
}