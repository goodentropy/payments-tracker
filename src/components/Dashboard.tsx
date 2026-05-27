import type { Session } from '../App';

type Props = {
  sessions: Session[];
};

export default function Dashboard({ sessions }: Props) {
  const totalHours = sessions.reduce((sum, s) => sum + Number(s.hours), 0);
  const totalEarned = sessions.reduce((sum, s) => sum + Number(s.amount), 0);
  const pendingAmount = sessions.filter(s => s.status === 'Pending').reduce((sum, s) => sum + Number(s.amount), 0);
  const paidAmount = sessions.filter(s => s.status === 'Paid').reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div className="bento-card col-span-12" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Total Hours</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {totalHours.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>hrs</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--bento-border)', paddingLeft: '32px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Total Earned</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          ${totalEarned.toFixed(2)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--bento-border)', paddingLeft: '32px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Pending</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '500', color: 'var(--pending-color)', letterSpacing: '-0.02em' }}>
          ${pendingAmount.toFixed(2)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--bento-border)', paddingLeft: '32px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Paid Out</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '500', color: 'var(--success-color)', letterSpacing: '-0.02em' }}>
          ${paidAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
