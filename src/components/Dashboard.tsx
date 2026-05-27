import type { Session } from '../App';

type Props = {
  sessions: Session[];
};

export default function Dashboard({ sessions }: Props) {
  const totalEarned = sessions.reduce((sum, s) => sum + s.amount, 0);
  const pendingAmount = sessions.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.amount, 0);
  const paidAmount = sessions.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="glass-panel" style={{ marginBottom: '32px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Earnings Overview</h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Earned</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fff' }}>${totalEarned}</div>
        </div>
        <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--pending-color)' }}>${pendingAmount}</div>
        </div>
        <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Paid Out</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success-color)' }}>${paidAmount}</div>
        </div>
      </div>
    </div>
  );
}
