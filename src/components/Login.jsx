import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Leaf } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Authentication API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(); // Mock successful login
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate OAuth pop-up delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="glass-panel" style={{ padding: '40px', maxWidth: '440px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      >
        <div style={{ background: 'var(--accent-glow)', padding: '16px', borderRadius: '20px' }}>
          <Leaf color="var(--accent-primary)" size={40} />
        </div>
      </motion.div>
      
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '2rem' }}>Welcome Back</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Sign in to your FARM AI dashboard</p>

      {/* Adding a form here allows the browser to prompt the user to save their password */}
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} /> Email Address
          </label>
          <input 
            required 
            type="email" 
            name="email"
            autoComplete="username"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-control" 
            placeholder="farmer@farmai.com" 
          />
        </div>

        <div className="form-group" style={{ textAlign: 'left' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Password
          </label>
          <input 
            required 
            type="password" 
            name="password"
            autoComplete="current-password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control" 
            placeholder="••••••••" 
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading}
          style={{ padding: '14px', fontSize: '1.1rem', marginTop: '10px' }}
        >
          {isLoading ? 'Signing In...' : (
             <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogIn size={20} /> Sign In
             </span>
          )}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0', color: 'var(--text-secondary)' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        <span style={{ margin: '0 15px', fontSize: '0.9rem' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
      </div>

      <button 
        type="button" 
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="btn-outline"
        style={{ 
          width: '100%', 
          padding: '14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          color: 'var(--text-primary)',
          fontSize: '1.05rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          <path d="M1 1h22v22H1z" fill="none"/>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
