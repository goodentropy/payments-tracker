import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '../App';

type Props = {
  onAddSession: (session: Omit<Session, 'id' | 'amount' | 'status' | 'created_at' | 'user_id' | 'paid_at'>) => void;
  isAdding: boolean;
};

export default function SessionForm({ onAddSession, isAdding }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [type, setType] = useState<'Focus Group' | '1-on-1'>('Focus Group');
  const [hours, setHours] = useState<number>(1);

  const presetHours = [0.5, 1, 1.5, 2, 3];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct the full timestamp if a time was provided
    let fullStartTime = null;
    if (startTime) {
      const d = new Date(`${date}T${startTime}`);
      fullStartTime = d.toISOString();
    }

    onAddSession({ 
      date, 
      start_time: fullStartTime, 
      type, 
      hours 
    });
    
    // reset slightly
    setStartTime('');
  };

  return (
    <div className="bento-card col-span-4">
      <div className="bento-title">Quick Log After Zoom</div>
      <form onSubmit={handleSubmit}>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
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
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="time">Time (Optional)</label>
            <input 
              type="time" 
              id="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="input-control" 
            />
          </div>
        </div>

        <div className="input-group">
          <label>Session Type</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Focus Group', '1-on-1'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t as any)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: type === t ? 'var(--accent-color)' : 'var(--input-bg)',
                  color: type === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  border: `1px solid ${type === t ? 'var(--accent-color)' : 'var(--input-border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.15s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Duration</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presetHours.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setHours(h)}
                style={{
                  flex: '1 0 calc(33% - 8px)',
                  padding: '8px',
                  background: hours === h ? 'var(--text-primary)' : 'var(--input-bg)',
                  color: hours === h ? 'var(--bg-color)' : 'var(--text-secondary)',
                  border: `1px solid ${hours === h ? 'var(--text-primary)' : 'var(--input-border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.15s ease'
                }}
              >
                {h} hr{h !== 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '8px' }} disabled={isAdding}>
          {isAdding ? 'Adding...' : `Log ${hours} hr${hours !== 1 ? 's' : ''} ($${hours * 50})`}
        </button>
      </form>
    </div>
  );
}
