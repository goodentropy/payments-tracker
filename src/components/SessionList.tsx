import type { Session } from '../App';

type Props = {
  sessions: Session[];
  onToggleStatus: (id: string) => void;
};

export default function SessionList({ sessions, onToggleStatus }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No sessions logged yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '500px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Session History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sessions.map(session => (
          <div 
            key={session.id} 
            style={{ 
              background: 'rgba(15, 23, 42, 0.4)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.2s ease'
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{session.type}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {session.date} • {session.hours} hrs
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>${session.amount}</div>
              <button 
                onClick={() => onToggleStatus(session.id)}
                className={`badge ${session.status === 'Paid' ? 'success' : 'pending'}`}
                style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                title="Click to toggle status"
              >
                {session.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
