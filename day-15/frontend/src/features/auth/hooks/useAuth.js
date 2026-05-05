import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getme, updateProfile, logout } from "../services/auth.api"

export function useAuth() {

    const context = useContext(AuthContext)
    const { user, setuser, loading: authLoading, setloading } = context
    const [loading, setLoading] = useState(false)

    const handleLogin = async (username, password) => {
        setLoading(true)
        try {
            const response = await login(username, password)
            setuser(response.user)
            return response
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Invalid username or password"
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true)
        try {
            const response = await register(username, email, password)
            setuser(response.user)
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Registration failed. Please try again."
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (imageFile) => {
           const response = await updateProfile(imageFile)
           const fresh = await getme()
           setuser(fresh.user)
       }




    const handleLogout = async () => {
        try {
            await logout()
        } catch (err) {
           
        } finally {
            setuser(null)
        }
    }




    return { user, loading, authLoading, handleLogin, handleRegister, handleUpdateProfile, handleLogout }
}