// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import '../styles/responsive.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await registerWithEmail(email, password, name.trim());
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err.code));
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

        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join PlacesFinder and start exploring</p>

        {error && (
          <div className="pf-alert error" style={{ marginBottom: 18 }}>
            <span>⚠️</span><span style={{ fontSize: 14 }}>{error}</span>
          </div>
        )}

        <button type="button" className="btn-ghost-pf" style={{ width: '100%', justifyContent: 'center', marginBottom: 4 }} onClick={handleGoogle} disabled={loading}>
          <FcGoogle size={18} /> Continue with Google
        </button>

        <div className="auth-divider">or</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label-pf">Full Name</label>
            <div className="input-group-pf">
              <FiUser className="input-icon" />
              <input className="pf-input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="form-label-pf">Email</label>
            <div className="input-group-pf">
              <FiMail className="input-icon" />
              <input className="pf-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="form-label-pf">Password</label>
            <div className="input-group-pf">
              <FiLock className="input-icon" />
              <input
                className="pf-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: 46 }}
              />
              <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPw(v => !v)}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label-pf">Confirm Password</label>
            <div className="input-group-pf">
              <FiLock className="input-icon" />
              <input className="pf-input" type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
          </div>

          <button className="btn-primary-pf" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function getFriendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  return map[code] || 'Registration failed. Please try again.';
}
