import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import Layout from './Layout'

const ProtectedRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}><h1 style={{color: 'var(--text-primary)'}}>Loading...</h1></main>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Layout />
}

export default ProtectedRoute
