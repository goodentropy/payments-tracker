import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import Dashboard from './components/Dashboard';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';
import Calendar from './components/Calendar';
import Auth from './components/Auth';
import VendorDashboard from './components/VendorDashboard';
import { supabase } from './lib/supabase';

export type Session = {
  id: string;
  date: string;
  start_time?: string | null;
  type: 'Focus Group' | '1-on-1';
  hours: number;
  amount: number;
  status: 'Pending' | 'Paid';
  created_at?: string;
  user_id?: string;
  paid_at?: string | null;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'teacher' | 'vendor' | null>(null);
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? 'teacher');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? 'teacher');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && role === 'teacher') {
      fetchSessions();
    }
  }, [user, role]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }
      if (data) {
        setSessions(data as Session[]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const addSession = async (sessionData: Omit<Session, 'id' | 'amount' | 'status' | 'created_at' | 'user_id' | 'paid_at'>) => {
    setIsAdding(true);
    const amount = sessionData.hours * 50; 
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          { 
            date: sessionData.date,
            start_time: sessionData.start_time,
            type: sessionData.type, 
            hours: sessionData.hours, 
            amount: amount,
            status: 'Pending',
            user_id: user?.id
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting session:', error);
        alert('Failed to add session. Check console.');
      } else if (data) {
        setSessions([data[0] as Session, ...sessions]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Paid' : 'Pending';
    const paidAt = newStatus === 'Paid' ? new Date().toISOString() : null;
    
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus, paid_at: paidAt })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating status:', error);
        return;
      }
      
      setSessions(sessions.map(s => s.id === id ? { ...s, status: newStatus as 'Pending' | 'Paid', paid_at: paidAt } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="header" style={{ marginBottom: '32px' }}>
        <div>
          <h1>TeachersValidate</h1>
          <p>Earnings & Feedback Tracker</p>
        </div>
        {user && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Logged in as {user.email} <span className="badge" style={{ background: '#3f3f46', marginLeft: '8px' }}>{role}</span>
            </div>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--bento-border)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
              Log Out
            </button>
          </div>
        )}
      </header>

      {!user ? (
        <Auth />
      ) : role === 'vendor' ? (
        <VendorDashboard />
      ) : (
        loadingSessions ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
            Loading your sessions...
          </div>
        ) : (
          <div className="bento-grid">
            <Dashboard sessions={sessions} />
            <SessionForm onAddSession={addSession} isAdding={isAdding} />
            <SessionList sessions={sessions} onToggleStatus={toggleStatus} />
            <Calendar sessions={sessions} />
          </div>
        )
      )}
    </div>
  );
}

export default App;
