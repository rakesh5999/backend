import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import Layout from './Layout'
import SplashScreen from './SplashScreen'

const ProtectedRoute = () => {
    const { user, authLoading } = useAuth()

    if (authLoading) {
        return <SplashScreen />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Layout />
}

export default ProtectedRoute
