// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { resetPassword } from '../services/authService';
import '../styles/responsive.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      const map = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setError(map[err.code] || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="pf-logo-icon">📍</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>PlacesFinder</span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <FiCheckCircle size={48} style={{ color: 'var(--accent)', marginBottom: 16 }} />
            <h2 className="auth-title">Check your email</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn-primary-pf" style={{ display: 'inline-flex' }}>
              <FiArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Reset password</h2>
            <p className="auth-sub">Enter your email and we'll send you a reset link</p>

            {error && (
              <div className="pf-alert error" style={{ marginBottom: 18 }}>
                <span>⚠️</span><span style={{ fontSize: 14 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label-pf">Email Address</label>
                <div className="input-group-pf">
                  <FiMail className="input-icon" />
                  <input className="pf-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button className="btn-primary-pf" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-footer">
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <FiArrowLeft size={13} /> Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
