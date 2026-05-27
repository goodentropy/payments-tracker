import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';
import Calendar from './components/Calendar';
import { supabase } from './lib/supabase';

export type Session = {
  id: string;
  date: string;
  type: 'Focus Group' | '1-on-1';
  hours: number;
  amount: number;
  status: 'Pending' | 'Paid';
  created_at?: string;
};

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Error fetching sessions:', error);
        // Fallback to empty array if table doesn't exist yet
        return;
      }
      if (data) {
        setSessions(data as Session[]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionData: Omit<Session, 'id' | 'amount' | 'status' | 'created_at'>) => {
    setIsAdding(true);
    const amount = sessionData.hours * 50; // Core EdTech use case: $50/hr
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          { 
            date: sessionData.date, 
            type: sessionData.type, 
            hours: sessionData.hours, 
            amount: amount,
            status: 'Pending'
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
    
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating status:', error);
        return;
      }
      
      setSessions(sessions.map(s => s.id === id ? { ...s, status: newStatus as 'Pending' | 'Paid' } : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <div>
          <h1>TeachersValidate</h1>
          <p>Earnings & Feedback Tracker</p>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          Loading sessions...
        </div>
      ) : (
        <div className="bento-grid">
          <Dashboard sessions={sessions} />
          <SessionList sessions={sessions} onToggleStatus={toggleStatus} />
          <SessionForm onAddSession={addSession} isAdding={isAdding} />
          <Calendar sessions={sessions} />
        </div>
      )}
    </div>
  );
}

export default App;
