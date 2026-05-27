import type { Session } from '../App';

type Props = {
  sessions: Session[];
};

export default function Calendar({ sessions }: Props) {
  // Generate a simple 30-day view for the current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    // Pad month and day with leading zero for matching YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    const daySessions = sessions.filter(s => s.date === dateStr);
    return {
      date: i + 1,
      isToday: d.toDateString() === today.toDateString(),
      sessions: daySessions
    };
  });

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bento-card col-span-12" style={{ height: '100%' }}>
      <div className="bento-title">Activity Calendar ({today.toLocaleString('default', { month: 'long', year: 'numeric' })})</div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header-day">{day}</div>
        ))}
        
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="calendar-day empty"></div>
        ))}
        
        {days.map(day => (
          <div 
            key={day.date} 
            className={`calendar-day ${day.isToday ? 'active' : ''} ${day.sessions.length > 0 ? 'has-session' : ''}`}
          >
            <span>{day.date}</span>
            {day.sessions.length > 0 && (
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {day.sessions.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="indicator" title={`${s.type} - ${s.hours}hrs`} />
                ))}
                {day.sessions.length > 3 && <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>+</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
