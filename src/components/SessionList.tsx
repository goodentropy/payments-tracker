import type { Session } from '../App';

type Props = {
  sessions: Session[];
  onToggleStatus: (id: string, currentStatus: string) => void;
};

export default function SessionList({ sessions, onToggleStatus }: Props) {
  return (
    <div className="bento-card col-span-8" style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <div className="bento-title">Session History</div>
      
      {sessions.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No sessions logged yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.map(session => (
            <div 
              key={session.id} 
              style={{ 
                background: 'var(--bg-color)', 
                borderRadius: '10px', 
                padding: '16px 20px',
                border: '1px solid var(--bento-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>{session.type}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {session.date} • {session.hours} hrs
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>${session.amount}</div>
                <button 
                  onClick={() => onToggleStatus(session.id, session.status)}
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
      )}
    </div>
  );
}
