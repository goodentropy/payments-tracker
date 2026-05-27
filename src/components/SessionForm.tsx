import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '../App';

type Props = {
  onAddSession: (session: Omit<Session, 'id' | 'amount' | 'status'>) => void;
};

export default function SessionForm({ onAddSession }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'Focus Group' | '1-on-1'>('Focus Group');
  const [hours, setHours] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddSession({ date, type, hours });
    // Reset form to defaults
    setHours(1);
    setType('Focus Group');
  };

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Log Session</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="input-control" 
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="type">Session Type</label>
          <select 
            id="type" 
            value={type} 
            onChange={(e) => setType(e.target.value as 'Focus Group' | '1-on-1')}
            className="input-control"
          >
            <option value="Focus Group">Focus Group</option>
            <option value="1-on-1">1-on-1</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="hours">Hours ($50/hr)</label>
          <input 
            type="number" 
            id="hours" 
            value={hours} 
            onChange={(e) => setHours(parseFloat(e.target.value))}
            className="input-control" 
            min="0.5" 
            step="0.5" 
            required
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
          Add Session
        </button>
      </form>
    </div>
  );
}
