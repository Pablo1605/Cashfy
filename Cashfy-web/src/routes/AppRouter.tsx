import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "../auth/ProtectedRoute"
import Layout from "../components/layout/Layout"
import { Dashboard } from "../pages/Dashboard/Dashboard"
import { Transactions } from "../pages/Transactions/Transactions"
import { SignIn } from "../pages/SignIn/SignIn"
import { SignUp } from "../pages/SignUp/SignUp"
import { Categories } from "../pages/Categories/Categories"

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/categories" element={<Categories />} />
            </Route>

            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="*" element={<Navigate to={"/sign-in"} replace />} />
        </Routes>
    )
}