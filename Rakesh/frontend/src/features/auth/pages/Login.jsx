import React, { useState } from 'react'
import '../style/form.scss'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState(null)

  const { loading, handleLogin } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await handleLogin(username, password)
      navigate('/feed')
    } catch (err) {
      setError(err.message || "Invalid username or password")
    }
  }

  return (
    <main className="auth-main">
      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <h1>Insta</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                onInput={(e) => { setusername(e.target.value) }}
                type="text"
                name='username'
                placeholder='Username' />
            </div>
            <div className="input-group">
              <input
                onInput={(e) => { setpassword(e.target.value) }}
                type="password"
                name='password'
                placeholder='Password' />
            </div>
            
            <button className='button primary-button' disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
          
          <div className="form-actions">
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
        </div>

        <div className="bottom-box">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Login
