import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'teacher' | 'vendor'>('teacher');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role
            }
          }
        });
        if (error) throw error;
        alert('Signup successful! Check your email for confirmation if required, or you can now log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="bento-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="bento-title" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '24px' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {errorMsg && (
          <div style={{ background: 'var(--pending-bg)', color: 'var(--pending-color)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-control"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-control"
              required
            />
          </div>

          {isSignUp && (
            <div className="input-group" style={{ marginTop: '16px' }}>
              <label>I am a...</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="teacher" 
                    checked={role === 'teacher'} 
                    onChange={() => setRole('teacher')} 
                  />
                  Teacher
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="vendor" 
                    checked={role === 'vendor'} 
                    onChange={() => setRole('vendor')} 
                  />
                  Vendor
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '24px' }} disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginLeft: '8px', fontWeight: '500', fontFamily: 'inherit' }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
