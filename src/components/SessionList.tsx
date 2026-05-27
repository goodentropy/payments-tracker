import type { Session } from '../App';

type Props = {
  sessions: Session[];
  onToggleStatus: (id: string, currentStatus: string) => void;
};

export default function SessionList({ sessions, onToggleStatus }: Props) {
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatPaidTime = (isoString?: string | null) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `Paid ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="bento-card col-span-8" style={{ overflowY: 'auto', maxHeight: '450px' }}>
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
                <div style={{ fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {session.type}
                  {session.start_time && (
                    <span className="badge" style={{ background: '#27272a', color: '#d4d4d8', fontSize: '0.75rem', fontWeight: 'normal' }}>
                      {formatTime(session.start_time)}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {session.date} • {session.hours} hrs
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    ${session.amount}
                  </div>
                  {session.status === 'Paid' && session.paid_at && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--success-color)' }}>
                      {formatPaidTime(session.paid_at)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => onToggleStatus(session.id, session.status)}
                  className={`badge ${session.status === 'Paid' ? 'success' : 'pending'}`}
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', alignSelf: session.paid_at ? 'flex-start' : 'center', marginTop: session.paid_at ? '2px' : '0' }}
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
