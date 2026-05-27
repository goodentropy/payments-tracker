import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';

export type Session = {
  id: string;
  date: string;
  type: 'Focus Group' | '1-on-1';
  hours: number;
  amount: number;
  status: 'Pending' | 'Paid';
};

function App() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      date: '2026-05-20',
      type: 'Focus Group',
      hours: 1,
      amount: 50,
      status: 'Paid',
    },
    {
      id: '2',
      date: '2026-05-25',
      type: '1-on-1',
      hours: 1.5,
      amount: 75,
      status: 'Pending',
    }
  ]);

  const addSession = (sessionData: Omit<Session, 'id' | 'amount' | 'status'>) => {
    const newSession: Session = {
      ...sessionData,
      id: Math.random().toString(36).substr(2, 9),
      amount: sessionData.hours * 50, // Core EdTech use case: $50/hr
      status: 'Pending'
    };
    setSessions([newSession, ...sessions]);
  };

  const toggleStatus = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Pending' ? 'Paid' : 'Pending' };
      }
      return s;
    }));
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <h1>TeachersValidate</h1>
        <p>Earnings & Feedback Tracker</p>
      </header>

      <Dashboard sessions={sessions} />

      <div className="grid-2">
        <SessionForm onAddSession={addSession} />
        <SessionList sessions={sessions} onToggleStatus={toggleStatus} />
      </div>
    </div>
  );
}

export default App;
