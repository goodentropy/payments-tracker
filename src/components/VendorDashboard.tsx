import { useState, useEffect } from 'react';
import type { Session } from '../App';
import { supabase } from '../lib/supabase';

export default function VendorDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSessions();
  }, []);

  const fetchAllSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      if (data) setSessions(data as Session[]);
    } catch (err) {
      console.error('Error fetching all sessions:', err);
    } finally {
      setLoading(false);
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
        alert('Failed to update status. Check permissions.');
        return;
      }
      
      setSessions(sessions.map(s => s.id === id ? { ...s, status: newStatus as 'Pending' | 'Paid' } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const totalPending = sessions.filter(s => s.status === 'Pending').reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div className="bento-grid">
      <div className="bento-card col-span-12">
        <div className="bento-title" style={{ marginBottom: '8px' }}>Vendor Overview</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage and process teacher payments across the platform.</p>
        
        <div style={{ display: 'inline-block', background: 'var(--pending-bg)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--bento-border)' }}>
          <div style={{ color: 'var(--pending-color)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Total Outstanding Liability</div>
          <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-primary)' }}>${totalPending.toFixed(2)}</div>
        </div>
      </div>

      <div className="bento-card col-span-12" style={{ overflowY: 'auto', maxHeight: '600px' }}>
        <div className="bento-title">All Logged Sessions</div>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No sessions found in the system.</p>
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
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>
                    {session.type} <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'normal', marginLeft: '8px' }}>Teacher ID: {session.user_id?.substring(0,8)}...</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {session.date} • {session.hours} hrs
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>${session.amount}</div>
                  <button 
                    onClick={() => toggleStatus(session.id, session.status)}
                    className={`badge ${session.status === 'Paid' ? 'success' : 'pending'}`}
                    style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    title="Click to mark as Paid/Pending"
                  >
                    {session.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
