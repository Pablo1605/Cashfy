import { useState } from 'react';
import { registerUser } from '../../api/userApi';
import styles from "./SignUp.module.css"
import {  useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [error, setError] = useState<String | null>(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null)
        try {
            await registerUser({ username, password, email })
            navigate("/login", { replace: true })
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message as string | undefined;
            setError(backendMessage ?? "No se pudo registrar");
        } finally {
            setLoading(false)
        }
    }

    const toSignIn = () => {
        navigate("/sign-in")
    }

    return (
        <div className={styles.container}>
            <section className={styles.signUpSection}>
                <header>
                    <h1>Create an account</h1>
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
                                <label htmlFor="email" >Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                <button className={styles.buttonIr} type="submit" disabled={loading}>{loading ? "Registrando..." : "Register"}</button>
                            </div>
                            </div>
                        </form>
                    </main>
            </section>
            <section className={styles.messageSection}>
                <h1>¡Welcome!</h1>
                <h4>Already have an account?</h4>
                <button onClick={toSignIn}>Sign in</button>
            </section>
        </div>
    )
}