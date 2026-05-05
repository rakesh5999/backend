import React, { useState } from 'react'
import '../style/form.scss'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState(null)

  const { loading, handleRegister } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await handleRegister(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    }
  }

  return (
    <main className="auth-main">
      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <h1>Insta</h1>
            <p>Sign up to see photos and videos from your friends.</p>
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
                onInput={(e) => { setemail(e.target.value) }}
                type="text"
                name='email'
                placeholder='Email address' />
            </div>
            <div className="input-group">
              <input
                onInput={(e) => { setpassword(e.target.value) }}
                type="password"
                name='password'
                placeholder='Password' />
            </div>
            
            <button className='button primary-button' disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        <div className="bottom-box">
          <p>Have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Register
