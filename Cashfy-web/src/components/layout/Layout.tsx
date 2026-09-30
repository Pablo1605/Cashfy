import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { Footer } from "../ui/Footer/Footer";
import { Header } from "../ui/Header/Header";
import { useTheme } from "../../theme/ThemeContext";

const Layout = () => {
    const { toggleTheme, theme } = useTheme()
    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.main}>
                <button className={styles.themeButton} onClick={toggleTheme}>
                    {theme === "light" ? (<span className="material-symbols-outlined">
                        brightness_2
                    </span>) : (<span className="material-symbols-outlined">
                        sunny
                    </span>)}

                </button>
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
