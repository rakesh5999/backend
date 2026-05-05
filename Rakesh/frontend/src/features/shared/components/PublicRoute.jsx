import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const PublicRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1d1d1d' }}><h1 style={{color: 'white'}}>Loading...</h1></main>
    }

    if (user) {
        return <Navigate to="/feed" replace />
    }

    return <Outlet />
}

export default PublicRoute
