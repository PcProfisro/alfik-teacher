/* teacher-1d.jsx — 1D · História.
 * Based on 1B with: no topbar actions / scope toggle, no Kategória filter,
 * no Všetky/Moje. First column is date+time; lesson chips are read-only.
 */

// Mock playback history — newest first.
const HISTORY = [
  { mId: 'm1',  date: '14.3.2026', time: '11:05' },
  { mId: 'm5',  date: '14.3.2026', time: '10:42' },
  { mId: 'm10', date: '14.3.2026', time: '10:18' },
  { mId: 'm2',  date: '13.3.2026', time: '13:45' },
  { mId: 'm7',  date: '13.3.2026', time: '11:22' },
  { mId: 'm6',  date: '13.3.2026', time: '10:15' },
  { mId: 'm3',  date: '12.3.2026', time: '14:08' },
  { mId: 'm8',  date: '12.3.2026', time: '11:50' },
  { mId: 'm4',  date: '11.3.2026', time: '13:30' },
  { mId: 'm9',  date: '11.3.2026', time: '10:05' },
];

// History assignments (read-only) — derived from MaterialsTable seed.
const HISTORY_ASSIGNED = {
  m1:  ['l1'],
  m10: ['l1', 'l3'],
  m8:  ['l1', 'l4'],
  m2:  ['l2'],
  m7:  ['l2', 'l3'],
  m3:  [],
  m4:  ['l4'],
  m5:  ['l5'],
  m6:  ['l1', 'l2', 'l3', 'l4', 'l5'],
  m9:  ['l5'],
};

function HistoryTable({ entries }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--alf-shadow-card)', overflow: 'visible' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 80px 1fr 200px',
        gap: 16, padding: '14px 22px',
        fontSize: 11, fontWeight: 700, color: 'var(--alf-ink-mute)',
        letterSpacing: '.06em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--alf-line)',
      }}>
        <span>Dátum a čas</span>
        <span></span>
        <span>Názov</span>
        <span>Moje hodiny</span>
      </div>

      {entries.map((h, idx) => {
        const m = MATERIALS.find(mm => mm.id === h.mId);
        if (!m) return null;
        const isLast = idx === entries.length - 1;
        const lessonIds = HISTORY_ASSIGNED[m.id] || [];
        return (
          <div key={idx} style={{
            display: 'grid',
            gridTemplateColumns: '120px 80px 1fr 200px',
            gap: 16, padding: '12px 22px', alignItems: 'center',
            borderBottom: isLast ? 'none' : '1px solid var(--alf-line)',
            transition: 'background .12s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--alf-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{h.date}</div>
              <div style={{ fontSize: 12, color: 'var(--alf-ink-mute)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{h.time}</div>
            </div>
            <PlayButton material={m} size={56} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.25 }}>{m.name}</div>
              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <CategoryPath material={m} />
                <SvpPath material={m} />
              </div>
            </div>
            <LessonChips assignedIds={lessonIds} onToggle={() => {}} readOnly chipColor="var(--alf-sky)" />
          </div>
        );
      })}
    </div>
  );
}

function Teacher_1D_History() {
  const [tag, setTag] = React.useState('all');
  const tags = [
    { id: 'all',           label: 'Všetky' },
    { id: 'testy',         label: 'Testy' },
    { id: 'pesničky',      label: 'Pesničky' },
    { id: 'videá',         label: 'Videá' },
    { id: 'maľovanky',     label: 'Maľovanky' },
    { id: 'grafomotorika', label: 'Grafomotorika' },
  ];
  const filtered = HISTORY.filter((h) => {
    if (tag === 'all') return true;
    const m = MATERIALS.find(mm => mm.id === h.mId);
    return m?.tags.includes(tag);
  });
  const ageLabel = 'Všetky';

  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="history" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar title="História" hideAge search={false} />

        <div style={{ flex: 1, padding: '20px 36px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filters — tags + age only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 6, padding: 4, background: '#fff', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
              {tags.map((t) => (
                <button key={t.id} onClick={() => setTag(t.id)} style={{
                  padding: '6px 16px', borderRadius: 99, border: 'none',
                  background: tag === t.id ? 'var(--alf-sky-bg)' : 'transparent',
                  color: tag === t.id ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>

            <span style={{ flex: 1 }} />

            <div className="alf-search" style={{ width: 260 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input placeholder="Hľadať..." />
            </div>
          </div>

          <HistoryTable entries={filtered} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--alf-ink-mute)' }}>
            <span>{filtered.length} záznamov · za posledných 5 dní</span>
            <button className="alf-btn-pill">Načítať staršie</button>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { Teacher_1D_History });
