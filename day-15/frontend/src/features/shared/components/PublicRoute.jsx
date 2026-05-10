import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import SplashScreen from './SplashScreen'

const PublicRoute = () => {
    const { user, authLoading } = useAuth()

    if (authLoading) {
        return <SplashScreen />
    }

    if (user) {
        return <Navigate to="/feed" replace />
    }

    return <Outlet />
}

export default PublicRoute
