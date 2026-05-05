import React, { useState } from 'react'
import '../style/form.scss'
import { Link } from 'react-router'

const ForgotPassword = () => {
  const [email, setemail] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)
    try {
      // Simulate API call for resetting password
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage("If an account exists with that email, a password reset link has been sent.")
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-main">
      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <h1>Insta</h1>
            <p>Trouble logging in? Enter your email and we'll send you a link to get back into your account.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                onInput={(e) => { setemail(e.target.value) }}
                type="email"
                name='email'
                placeholder='Email address' />
            </div>
            
            <button className='button primary-button' disabled={loading}>
              {loading ? "Sending..." : "Send login link"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
          </form>
          
          <div className="form-actions">
            <div style={{display: 'flex', alignItems: 'center', margin: '15px 0', width: '100%'}}>
               <div style={{flex: 1, height: '1px', backgroundColor: 'var(--border-color)'}}></div>
               <span style={{margin: '0 10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold'}}>OR</span>
               <div style={{flex: 1, height: '1px', backgroundColor: 'var(--border-color)'}}></div>
            </div>
            <Link to="/register" style={{color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold'}}>Create new account</Link>
          </div>
        </div>

        <div className="bottom-box">
          <p><Link to="/login" style={{color: 'var(--text-primary)'}}>Back to login</Link></p>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword
