import { useState } from 'react';
import styles from "./SignIn.module.css"
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

export const SignIn = () => {
    const [error, setError] = useState<String | null>("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const { setLogin } = useUser()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setError(null)
        try {
            await setLogin({ username, password })
            navigate("/", { replace: true })
        } catch {
            setError("Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    const toSignUp = () => {
        navigate("/sign-up")
    }

    return (
        <div className={styles.container}>
            <section className={styles.signInSection}>
                <header>
                    <h1>Login</h1>
                </header>
                <main>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password" >Password</label>
                            <div className={styles.passwordInputGroup}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggleButton}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <span className="material-symbols-outlined">
                                        visibility_off
                                    </span> : <span className="material-symbols-outlined">
                                        visibility
                                    </span>}
                                </button>
                            </div>
                        <div className={styles.buttonMessage}>
                            {error && <p className="error-text">{error}</p>}
                            <button className={styles.buttonIs} type="submit" disabled={loading} >{loading ? "entering..." : "Login"}</button>
                        </div>
                        </div>
                    </form>
                </main>
            </section>
            <section className={styles.messageSection}>
                <h1>¡Welcome back!</h1>
                <h4>Don’t have an account?</h4>
                <button onClick={toSignUp}>Sign up</button>
            </section>
        </div>
    )
}