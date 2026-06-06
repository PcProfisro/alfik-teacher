/* teacher-1c.jsx — 1C · Moje hodiny.
 * Materials grouped into lessons. Lesson rows act as collapsible
 * accordions; clicking a lesson reveals its tests with: Play · Názov · Tagy.
 *
 * Shares primitives (LESSONS data, MATERIALS) from shared.jsx.
 */

// Status pill — visual cue for lesson state.
function LessonStatus({ status }) {
  const map = {
    'next':  { bg: 'var(--alf-mint-bg)', fg: '#1E7A5E', label: 'Pripravené' },
    'draft': { bg: '#F0EEF6',            fg: '#6B5DAA', label: 'Návrh' },
  };
  const m = map[status] || map['draft'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 99,
      background: m.bg, color: m.fg,
      fontSize: 12, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: m.fg }} />
      {m.label}
    </span>
  );
}

// Season chip — small uppercase label, season-tinted.
const SEASON_META = {
  'Jeseň': { bg: '#FFE3D6', fg: '#A65A33' },
  'Zima':  { bg: '#DBEEF9', fg: 'var(--alf-sky-deep)' },
  'Jar':   { bg: 'var(--alf-mint-bg)', fg: '#1E7A5E' },
  'Leto':  { bg: 'var(--alf-sun-bg)',  fg: '#8C6500' },
};
function SeasonChip({ season }) {
  const m = SEASON_META[season] || SEASON_META['Jar'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 99,
      background: m.bg, color: m.fg,
      fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase',
    }}>{season}</span>
  );
}

// Text tag pill (used for duration + curricular labels in TestRow).
function TextTag({ children, tone = 'neutral' }) {
  const tones = {
    'neutral':    { bg: 'var(--alf-bg)',         fg: 'var(--alf-ink-soft)', border: 'var(--alf-line)' },
    'curricular': { bg: '#F4EFFE',               fg: '#5B47D6',             border: '#E1D6FA' },
    'time':       { bg: '#fff',                  fg: 'var(--alf-ink-soft)', border: 'var(--alf-line)' },
  };
  const t = tones[tone] || tones['neutral'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 99,
      background: t.bg, color: t.fg,
      border: `1px solid ${t.border}`,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ─── Create Exercise fullscreen modal ──────────────────────────────────────
const EXERCISE_TYPES = [
  { id: 'vob-text',   label: 'Výber odpovede\n(text)',      icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="8" y="8" width="40" height="6" rx="2" fill="#c8d8e8"/><rect x="8" y="18" width="28" height="6" rx="2" fill="#c8d8e8"/><rect x="8" y="30" width="36" height="6" rx="2" fill="#c8d8e8"/><rect x="8" y="40" width="22" height="6" rx="2" fill="#c8d8e8"/><rect x="52" y="8" width="22" height="36" rx="4" fill="#c8d8e8"/><rect x="55" y="14" width="16" height="14" rx="2" fill="#b0c4d8"/></svg> },
  { id: 'vob-img',    label: 'Výber odpovede\n(obrázky)',   icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="10" y="8" width="60" height="20" rx="3" fill="#c8d8e8"/><rect x="14" y="11" width="16" height="14" rx="2" fill="#b0c4d8"/><rect x="10" y="32" width="18" height="18" rx="3" fill="#c8d8e8"/><rect x="31" y="32" width="18" height="18" rx="3" fill="#c8d8e8"/><rect x="52" y="32" width="18" height="18" rx="3" fill="#c8d8e8"/></svg> },
  { id: 'pexeso',     label: 'Pexeso',                      icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="8" y="8" width="16" height="16" rx="2" fill="#b0c4d8"/><rect x="27" y="8" width="16" height="16" rx="2" fill="#c8d8e8"/><rect x="46" y="8" width="16" height="16" rx="2" fill="#b0c4d8"/><rect x="8" y="28" width="16" height="16" rx="2" fill="#c8d8e8"/><rect x="27" y="28" width="16" height="16" rx="2" fill="#b0c4d8"/><rect x="46" y="28" width="16" height="16" rx="2" fill="#c8d8e8"/></svg> },
  { id: 'skupiny',    label: 'Skupiny',                     icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="6" width="30" height="46" rx="4" fill="#c8d8e8"/><rect x="44" y="6" width="30" height="46" rx="4" fill="#c8d8e8"/><rect x="10" y="14" width="22" height="6" rx="2" fill="#b0c4d8"/><rect x="48" y="14" width="22" height="6" rx="2" fill="#b0c4d8"/><rect x="10" y="24" width="22" height="6" rx="2" fill="#b0c4d8"/><rect x="48" y="24" width="22" height="6" rx="2" fill="#b0c4d8"/></svg> },
  { id: 'prir-text',  label: 'Priradenie (text)',            icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="8" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="6" y="20" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="6" y="32" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="46" y="8" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="46" y="20" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="46" y="32" width="28" height="8" rx="2" fill="#c8d8e8"/><line x1="34" y1="12" x2="46" y2="24" stroke="#b0c4d8" strokeWidth="2"/><line x1="34" y1="24" x2="46" y2="12" stroke="#b0c4d8" strokeWidth="2"/></svg> },
  { id: 'prir-img',   label: 'Priradenie (obrázky)',        icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="16" width="18" height="14" rx="2" fill="#c8d8e8"/><rect x="27" y="16" width="18" height="14" rx="2" fill="#c8d8e8"/><rect x="48" y="16" width="18" height="14" rx="2" fill="#c8d8e8"/><rect x="6" y="36" width="18" height="10" rx="2" fill="#b0c4d8"/><rect x="27" y="36" width="18" height="10" rx="2" fill="#b0c4d8"/><rect x="48" y="36" width="18" height="10" rx="2" fill="#b0c4d8"/></svg> },
  { id: 'zor-zv',     label: 'Zoradenie (zvislo)',          icon: <svg viewBox="0 0 80 60" width="72" height="54"><text x="16" y="18" fontSize="10" fill="#b0c4d8" fontWeight="700">1</text><rect x="24" y="10" width="42" height="8" rx="2" fill="#c8d8e8"/><text x="16" y="32" fontSize="10" fill="#b0c4d8" fontWeight="700">2</text><rect x="24" y="24" width="42" height="8" rx="2" fill="#c8d8e8"/><text x="16" y="46" fontSize="10" fill="#b0c4d8" fontWeight="700">3</text><rect x="24" y="38" width="42" height="8" rx="2" fill="#c8d8e8"/></svg> },
  { id: 'zor-vod',    label: 'Zoradenie\n(vodorovne)',      icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="20" width="14" height="18" rx="2" fill="#b0c4d8"/><text x="9" y="32" fontSize="9" fill="#fff" fontWeight="700">1</text><rect x="23" y="20" width="14" height="18" rx="2" fill="#c8d8e8"/><text x="26" y="32" fontSize="9" fill="#b0c4d8" fontWeight="700">4</text><rect x="40" y="20" width="14" height="18" rx="2" fill="#c8d8e8"/><text x="43" y="32" fontSize="9" fill="#b0c4d8" fontWeight="700">3</text><rect x="57" y="20" width="14" height="18" rx="2" fill="#c8d8e8"/><text x="60" y="32" fontSize="9" fill="#b0c4d8" fontWeight="700">2</text></svg> },
  { id: 'popis-obr',  label: 'Popis obrázka',               icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="8" width="34" height="44" rx="3" fill="#c8d8e8"/><rect x="10" y="14" width="26" height="20" rx="2" fill="#b0c4d8"/><rect x="10" y="38" width="20" height="5" rx="2" fill="#b0c4d8"/><rect x="44" y="8" width="30" height="8" rx="2" fill="#c8d8e8"/><rect x="44" y="20" width="30" height="8" rx="2" fill="#c8d8e8"/><rect x="44" y="32" width="30" height="8" rx="2" fill="#c8d8e8"/><rect x="44" y="44" width="20" height="8" rx="2" fill="#c8d8e8"/></svg> },
  { id: 'dvojice',    label: 'Dvojice',                     icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="10" width="26" height="38" rx="3" fill="#c8d8e8"/><rect x="26" y="22" width="28" height="14" rx="2" fill="#c8d8e8"/><rect x="48" y="10" width="26" height="38" rx="3" fill="#c8d8e8"/><line x1="32" y1="29" x2="48" y2="29" stroke="#b0c4d8" strokeWidth="2"/></svg> },
  { id: 'puzzle',     label: 'Puzzle',                      icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="10" y="10" width="24" height="18" rx="2" fill="#c8d8e8"/><path d="M34 18 Q40 14 40 18 Q40 22 34 22Z" fill="#c8d8e8"/><rect x="10" y="32" width="24" height="18" rx="2" fill="#b0c4d8"/><path d="M22 32 Q18 26 22 26 Q26 26 22 32Z" fill="#b0c4d8"/><rect x="40" y="10" width="24" height="18" rx="2" fill="#b0c4d8"/><rect x="40" y="32" width="24" height="18" rx="2" fill="#c8d8e8"/><path d="M52 32 Q48 26 52 26 Q56 26 52 32Z" fill="#c8d8e8"/></svg> },
  { id: 'hadaj',      label: 'Hádaj slovo',                 icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="10" y="8" width="24" height="18" rx="2" fill="#c8d8e8"/><rect x="14" y="12" width="16" height="10" rx="1" fill="#b0c4d8"/><rect x="6" y="30" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="18" y="30" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="30" y="30" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="42" y="30" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="54" y="30" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="6" y="44" width="10" height="10" rx="2" fill="#b0c4d8"/><rect x="18" y="44" width="10" height="10" rx="2" fill="#c8d8e8"/></svg> },
  { id: 'tajnicka',   label: 'Tajnička',                    icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="14" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="18" y="14" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="30" y="14" width="10" height="10" rx="2" fill="#4caf50" opacity=".6"/><rect x="42" y="14" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="54" y="14" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="6" y="28" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="18" y="28" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="30" y="28" width="10" height="10" rx="2" fill="#4caf50" opacity=".6"/><rect x="42" y="28" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="54" y="28" width="10" height="10" rx="2" fill="#c8d8e8"/><rect x="30" y="42" width="10" height="10" rx="2" fill="#4caf50" opacity=".6"/></svg> },
  { id: 'dopln',      label: 'Doplň slová',                 icon: <svg viewBox="0 0 80 60" width="72" height="54"><rect x="6" y="10" width="68" height="8" rx="2" fill="#c8d8e8"/><rect x="6" y="24" width="28" height="8" rx="2" fill="#c8d8e8"/><rect x="38" y="24" width="36" height="8" rx="2" fill="#b0c4d8" opacity=".5"/><line x1="38" y1="32" x2="74" y2="32" stroke="#b0c4d8" strokeWidth="1.5"/><rect x="6" y="38" width="42" height="8" rx="2" fill="#c8d8e8"/></svg> },
];

function CreateExerciseModal({ open, onClose }) {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState('vob-text');
  const [testName, setTestName] = React.useState('Názov testu');

  const filtered = EXERCISE_TYPES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#fff', display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        height: 64, borderBottom: '1px solid #e0e6ef',
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
        background: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
          <img src="uploads/logo-edu-alf.svg" alt="Alfík" style={{ height: 36 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a2a3a', lineHeight: 1.2 }}>{testName}</div>
            <div style={{ fontSize: 11, color: '#8a9bb0', fontWeight: 500 }}>rozpracované</div>
          </div>
        </div>

        <span style={{ flex: 1 }} />

        <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#3a5070', fontWeight: 600, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 3 12a10 10 0 0 0 16.07 7.07"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>
          Vlastnosti
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#3a5070', fontWeight: 600, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Náhľad
        </button>
        <button style={{ background: '#5cb85c', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 22px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
          Uložiť
        </button>
        <button onClick={onClose} style={{ marginLeft: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#8a9bb0', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: '#dde6f0', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 60px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a2a3a', margin: '0 0 28px', textAlign: 'center' }}>
          Pridajte prvú úlohu...
        </h2>

        {/* Search */}
        <div style={{ width: '100%', maxWidth: 680, background: '#fff', borderRadius: 12, border: '1.5px solid #d0dae8', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 28 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a9bb0" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Vyhľadať typ úlohy..." style={{ border: 'none', outline: 'none', fontSize: 15, color: '#1a2a3a', background: 'transparent', flex: 1 }} />
        </div>

        {/* Grid */}
        <div style={{ width: '100%', maxWidth: 680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {filtered.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{
              background: '#fff',
              border: `2px solid ${selected === t.id ? '#4caf50' : '#d0dae8'}`,
              borderRadius: 12,
              padding: '16px 8px 12px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              transition: 'border-color .12s, box-shadow .12s',
              boxShadow: selected === t.id ? '0 0 0 3px rgba(76,175,80,.12)' : 'none',
            }}>
              {t.icon}
              <span style={{
                fontSize: 12, fontWeight: 600, color: '#3a5070', textAlign: 'center', lineHeight: 1.35,
                whiteSpace: 'pre-line',
              }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Test row used inside an expanded lesson — Play · Názov · Tagy · Zmazať.
function TestRow({ m, onDelete, onEdit }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto',
      gap: 10, padding: '7px 22px 7px 56px',
      alignItems: 'center',
      borderBottom: '1px solid var(--alf-line)',
      background: 'rgba(219, 238, 249, .25)',
      transition: 'background .12s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(219, 238, 249, .45)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(219, 238, 249, .25)'}>
      <PlayButton material={m} size={56} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.25 }}>{m.name}</div>
      </div>
      <div style={{ display: 'none' }}>
        {m.tags.slice(0, 1).map(t => <MaterialTagIcon key={t} kind={t} size={30} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {m.mine && (
          <button onClick={(e) => { e.stopPropagation(); onEdit?.(m); }} title="Upraviť materiál" className="alf-btn-pill" style={{
            padding: 0, width: 44, height: 44, justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onDelete?.(m); }} title="Zmazať materiál" className="alf-btn-pill" style={{
          padding: 0, width: 44, height: 44, justifyContent: 'center', color: '#A94545',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>
  );
}

// Lesson row — chevron + season + status + name + age-icon + Upraviť.
function LessonRow({ lesson, expanded, onToggle, onEdit, onDelete, onDeleteTest, onEditTest, onCreateExercise }) {
  const testObjs = lesson.tests.map(id => MATERIALS.find(m => m.id === id)).filter(Boolean);
  const [addOpen, setAddOpen] = React.useState(false);
  const [mineOpen, setMineOpen] = React.useState(false);
  return (
    <>
      <div onClick={onToggle} style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto auto',
        gap: 16, padding: '16px 22px', alignItems: 'center', cursor: 'pointer',
        borderBottom: '1px solid var(--alf-line)',
        background: expanded ? 'var(--alf-sky-bg)' : 'transparent',
        transition: 'background .12s',
      }}
      onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = 'var(--alf-bg)'; }}
      onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: expanded ? 'var(--alf-sky-deep)' : '#fff',
          border: expanded ? 'none' : '1px solid var(--alf-line)',
          color: expanded ? '#fff' : 'var(--alf-ink-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .15s ease',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <SeasonChip season={lesson.season} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: 'var(--alf-mint-bg)', color: '#1E7A5E',
              fontSize: 11, fontWeight: 800, letterSpacing: '.04em',
            }}>
              <span>{AGE_META[lesson.age]?.label || lesson.age}</span>
            </span>
            {lesson.dateRange && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '3px 10px', borderRadius: 99,
                background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-ink)',
                fontSize: 11, fontWeight: 800, letterSpacing: '.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
                <span>{lesson.dateRange}</span>
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 18, fontWeight: 700, color: 'var(--alf-ink)', marginTop: 4, lineHeight: 1.2 }}>{lesson.name}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NotesButton notes={lesson.notes} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit?.(lesson); }} title="Upraviť hodinu" className="alf-btn-pill" style={{ padding: 0, width: 44, height: 44, justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete?.(lesson); }} title="Zmazať hodinu" className="alf-btn-pill" style={{ padding: 0, width: 44, height: 44, justifyContent: 'center', color: '#A94545' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ display: 'flex', gap: 8, padding: '4px 20px 12px', justifyContent: 'flex-end' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setAddOpen(true); }}
            className="alf-btn"
            style={{ justifyContent: 'center', background: 'var(--alf-sky-bg)', borderColor: 'var(--alf-sky-deep)', color: 'var(--alf-sky-deep)', fontWeight: 800, fontSize: 11, letterSpacing: '.06em', gap: 6, padding: '7px 14px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            PRIDAŤ Z KNIŽNICE
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMineOpen(true); }}
            className="alf-btn"
            style={{ justifyContent: 'center', background: 'var(--alf-mint-bg)', borderColor: '#1E7A5E', color: '#1E7A5E', fontWeight: 800, fontSize: 11, letterSpacing: '.06em', gap: 6, padding: '7px 14px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            NAHRAŤ NOVÝ MATERIÁL
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCreateExercise?.(); }}
            className="alf-btn"
            style={{ justifyContent: 'center', background: '#FFF3E0', borderColor: '#E07B2A', color: '#E07B2A', fontWeight: 800, fontSize: 11, letterSpacing: '.06em', gap: 6, padding: '7px 14px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            VYTVORIŤ CVIČENIE
          </button>
        </div>
      )}

      {expanded && testObjs.map((m) => (
        <TestRow key={m.id} m={m} onDelete={onDeleteTest} onEdit={onEditTest} />
      ))}

      {addOpen && <AddMaterialsModal lesson={lesson} onClose={() => setAddOpen(false)} />}
      {mineOpen && <NewMaterialModal open={mineOpen} onClose={() => setMineOpen(false)} />}
    </>
  );
}

// Season filter dropdown — segmented (4 options).
function SeasonFilter({ value, onChange }) {
  const opts = ['Jeseň', 'Zima', 'Jar', 'Leto'];
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: '#fff', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
      <button onClick={() => onChange('all')} style={{
        padding: '6px 14px', borderRadius: 99, border: 'none',
        background: value === 'all' ? 'var(--alf-sky-bg)' : 'transparent',
        color: value === 'all' ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
        fontWeight: 700, fontSize: 13, cursor: 'pointer',
      }}>Všetky</button>
      {opts.map((s) => {
        const active = value === s;
        return (
          <button key={s} onClick={() => onChange(s)} style={{
            padding: '6px 16px', borderRadius: 99, border: 'none',
            background: active ? 'var(--alf-sky-bg)' : 'transparent',
            color: active ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>{s}</button>
        );
      })}
    </div>
  );
}

// ─── New / edit lesson modal ────────────────────────────────────────────
function parseDateRange(r) {
  if (!r) return { from: '', to: '' };
  const [a, b = ''] = r.split('-');
  const to = b.match(/(\d+)\.(\d+)\.(\d+)/);   // d.m.y
  const from = a.match(/(\d+)\.(\d+)\./);       // d.m.
  if (!to) return { from: '', to: '' };
  const pad = (n) => String(n).padStart(2, '0');
  const year = to[3];
  return {
    from: from ? `${year}-${pad(from[2])}-${pad(from[1])}` : '',
    to: `${year}-${pad(to[2])}-${pad(to[1])}`,
  };
}

function NewLessonModal({ open, onClose, lesson }) {
  const isEdit = !!lesson;
  const _range = parseDateRange(lesson?.dateRange);
  const [name, setName] = React.useState(lesson?.name || '');
  const [season, setSeason] = React.useState(lesson?.season || 'Jar');
  const [age, setAge] = React.useState(lesson?.age || '4');
  const [dateFrom, setDateFrom] = React.useState(_range.from);
  const [dateTo, setDateTo] = React.useState(_range.to);
  const [catOpen, setCatOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(lesson?.theme || 'Domáce zvieratá');
  const [svpOpen, setSvpOpen] = React.useState(false);
  const [svp, setSvp] = React.useState(lesson?.svp || 'Živá príroda');
  const [notes, setNotes] = React.useState(lesson?.notes || '');

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15, 30, 55, .42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 640, maxHeight: '100%', background: '#fff', borderRadius: 22,
        boxShadow: '0 30px 80px -20px rgba(15, 30, 55, .35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px 16px', borderBottom: '1px solid var(--alf-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-sky-deep)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Plán hodiny</div>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 22, fontWeight: 800, color: 'var(--alf-ink)', margin: '4px 0 0', letterSpacing: '-.01em' }}>{isEdit ? 'Upraviť hodinu' : 'Nová hodina'}</h2>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
            background: '#fff', color: 'var(--alf-ink-soft)', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 28px 8px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Názov */}
          <Field label="Názov hodiny" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="napr. Spoznávame zvieratá na farme"
              style={inputStyle}
            />
          </Field>

          {/* Obdobie + Vek — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Obdobie">
              <div style={{ display: 'flex', gap: 6 }}>
                {['Jeseň', 'Zima', 'Jar', 'Leto'].map((s) => {
                  const meta = SEASON_META[s];
                  const active = season === s;
                  return (
                    <button key={s} onClick={() => setSeason(s)} style={{
                      flex: 1, padding: '10px 6px', borderRadius: 12,
                      border: `1.5px solid ${active ? meta.fg : 'var(--alf-line)'}`,
                      background: active ? meta.bg : '#fff',
                      color: active ? meta.fg : 'var(--alf-ink-soft)',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      letterSpacing: '.04em', transition: 'all .12s ease',
                    }}>{s}</button>
                  );
                })}
              </div>
            </Field>

            <Field label="Vek">
              <div style={{ display: 'flex', gap: 8 }}>
                {['3', '4', '5'].map((a) => {
                  const meta = AGE_META[a];
                  const active = age === a;
                  return (
                    <button key={a} onClick={() => setAge(a)} style={{
                      flex: 1, padding: '8px 8px', borderRadius: 12,
                      border: `2px solid ${active ? meta.color : 'var(--alf-line)'}`,
                      background: active ? meta.bg : '#fff',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontWeight: 700, fontSize: 13,
                      color: active ? meta.color : 'var(--alf-ink-soft)',
                    }}>
                      <span style={{ whiteSpace: 'nowrap' }}>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Termín — dátumový interval */}
          <Field label="Termín">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <span style={{ color: 'var(--alf-ink-mute)', fontWeight: 800 }}>–</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
          </Field>

          {/* Stav hodiny odstránený */}

          {/* Poznámky */}
          <Field label="Poznámky">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pripomienky, pomôcky, čo pripraviť..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 70, paddingTop: 10, paddingBottom: 10, lineHeight: 1.5 }}
            />
          </Field>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 28px 18px', borderTop: '1px solid var(--alf-line)',
          background: '#FAFBFD',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ fontSize: 12, color: 'var(--alf-ink-mute)' }}>
            {isEdit ? `Hodina obsahuje ${lesson.tests?.length || 0} cvičení.` : 'Cvičenia môžeš pridať po vytvorení hodiny.'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="alf-btn">Zrušiť</button>
            <button onClick={onClose} className="alf-btn is-active">{isEdit ? 'Uložiť zmeny' : 'Vytvoriť hodinu'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '11px 14px', borderRadius: 12,
  border: '1.5px solid var(--alf-line)',
  background: '#fff', color: 'var(--alf-ink)',
  fontFamily: 'var(--alf-font-body)', fontSize: 14, fontWeight: 500,
  outline: 'none', transition: 'border-color .12s ease',
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--alf-ink)', letterSpacing: '.02em' }}>
        {label}{required && <span style={{ color: 'var(--alf-coral)', marginLeft: 4 }}>*</span>}
      </span>
      {children}
    </div>
  );
}

// Notes icon button — shows notes on hover or click (toggle pin).
function NotesButton({ notes }) {
  const [hover, setHover] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const ref = React.useRef(null);
  const open = hover || pinned;
  React.useEffect(() => {
    if (!pinned) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setPinned(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [pinned]);
  if (!notes) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <button onClick={(e) => { e.stopPropagation(); setPinned(p => !p); }}
        title="Poznámky"
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: open ? 'var(--alf-sun-bg)' : '#fff',
          border: `1px solid ${open ? 'var(--alf-sun-deep)' : 'var(--alf-line)'}`,
          color: open ? 'var(--alf-sun-deep)' : 'var(--alf-ink-soft)',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M8 13h6M8 17h4"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 320, padding: '12px 14px', borderRadius: 12,
          background: '#fff', boxShadow: '0 10px 28px -8px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
          zIndex: 50, fontSize: 13, color: 'var(--alf-ink)', lineHeight: 1.5,
          whiteSpace: 'normal', textAlign: 'left', cursor: 'default',
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: 'var(--alf-sun-deep)',
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            Poznámky
          </div>
          {notes}
        </div>
      )}
    </div>
  );
}

// ─── Methodology attachment — docx-style modal ──────────────────────────
function MethodologyButton({ lesson }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        title="Metodická príloha"
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: open ? 'var(--alf-sky-bg)' : '#fff',
          border: `1px solid ${open ? 'var(--alf-sky-deep)' : 'var(--alf-line)'}`,
          color: open ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6"/>
          <path d="M9 13l2 2 4-4"/>
        </svg>
      </button>
      {open && <MethodologyModal lesson={lesson} onClose={() => setOpen(false)} />}
    </>
  );
}

function MethodologyModal({ lesson, onClose }) {
  // Activity content derived from the lesson — but text is rich + invented.
  const themeName = lesson.theme || 'tému';
  const ageLabel = AGE_META[lesson.age]?.label || '4–5 r.';
  const data = {
    duration: '35 – 40 min',
    goal: `Rozvíjať poznanie detí o téme „${themeName}" prostredníctvom hry, pozorovania a komunikácie. Posilniť slovnú zásobu, jemnú motoriku a schopnosť spolupráce v skupine.`,
    aids: [
      'Obrázkové karty s pojmami danej témy (formát A5, laminované)',
      'Pracovné listy — 1 ks na dieťa',
      'Farbičky, ceruzky, lepidlo, nožničky pre každé dieťa',
      'Magnetická tabuľa + magnety',
      'Audio nahrávka piesne (3 – 4 min)',
      'Reálne predmety / hračky súvisiace s témou',
      'Koberec / sed v kruhu',
    ],
    structure: [
      { phase: 'Úvod · 5 min', items: [
        'Privítací rituál v kruhu — pieseň „Dobré ráno, dobrý deň"',
        'Krátky rozhovor — čo si pamätáte z minulej hodiny?',
        'Predstavenie dnešnej témy — ukážka motivačnej karty',
      ] },
      { phase: 'Motivačná aktivita · 7 min', items: [
        'Hra „Hádaj, čo je v košíku" — dieťa hmatom poznáva predmet',
        'Spoločné pomenovanie predmetov, opakovanie po učiteľke',
        'Krátka rozprávka / príbeh nadväzujúci na tému',
      ] },
      { phase: 'Hlavná činnosť · 15 min', items: [
        'Triedenie obrázkových kariet podľa kategórií (skupinová práca, 3 – 4 deti)',
        'Práca s pracovným listom — kreslenie, lepenie, dopĺňanie',
        'Individuálna pomoc deťom, ktoré potrebujú podporu',
        'Slovné komentáre — dieťa popisuje, čo robí ("Ja kreslím...")',
      ] },
      { phase: 'Pohybová chvíľka · 5 min', items: [
        'Pieseň s pohybom — napodobňovanie zvierat / činností',
        'Tanec v kruhu, zastavovanie na signál',
      ] },
      { phase: 'Záver a reflexia · 5 min', items: [
        'Spoločné upratovanie pomôcok',
        'Otázky deťom — Čo bolo najťažšie? Čo sa ti páčilo?',
        'Pochvala, smajlík alebo pečiatka za snahu',
      ] },
    ],
    expected: [
      'Dieťa pomenuje aspoň 5 pojmov z preberanej témy',
      'Dieťa pracuje samostatne s pracovným listom 8 – 10 minút',
      'Dieťa spolupracuje v 3 – 4-člennej skupine',
      'Dieťa správne odpovedá na otvorené otázky („Prečo?", „Ako?")',
    ],
    differentiation: [
      'Pre mladšie deti (3 r.) — jednoduchšie karty, viac sprevádzania učiteľkou',
      'Pre staršie deti (5 r.) — pridať úlohu s počítaním alebo písaním písmen',
      'Pre dieťa s ŠVP — pracovať vo dvojici s rovesníkom, kratšie segmenty',
    ],
    notes: lesson.notes || 'Bez ďalších poznámok.',
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 120,
      background: 'rgba(15, 30, 55, .45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 760, maxHeight: '92%', background: '#fff', borderRadius: 18,
        boxShadow: '0 30px 80px -20px rgba(15, 30, 55, .35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 28px', borderBottom: '1px solid var(--alf-line)',
          display: 'flex', alignItems: 'center', gap: 14,
          background: '#FAFBFD',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-sky-deep)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Metodická príloha</div>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 20, fontWeight: 800, color: 'var(--alf-ink)', margin: '3px 0 0', letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {lesson.name}
            </h2>
            <div style={{ display: 'flex', gap: 14, marginTop: 4, fontSize: 12, color: 'var(--alf-ink-soft)' }}>
              <span><strong style={{ color: 'var(--alf-ink)' }}>Vek:</strong> {ageLabel}</span>
              <span><strong style={{ color: 'var(--alf-ink)' }}>Téma:</strong> {themeName}</span>
              <span><strong style={{ color: 'var(--alf-ink)' }}>Trvanie:</strong> {data.duration}</span>
            </div>
          </div>
          <button className="alf-btn" style={{ flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: -2 }}><path d="M12 2v10m0 0l-4-4m4 4l4-4M5 18v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>
            Stiahnuť .docx
          </button>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
            background: '#fff', color: 'var(--alf-ink-soft)', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Document body — styled as docx */}
        <div className="alf-docscroll" style={{
          flex: 1, overflowY: 'scroll', padding: '32px 48px 40px',
          fontFamily: '"Calibri", "Segoe UI", system-ui, sans-serif',
          color: '#1f2937', fontSize: 14.5, lineHeight: 1.55,
        }}>
          <h1 style={{ fontFamily: '"Calibri", system-ui', fontSize: 24, fontWeight: 700, color: '#1f3a5f', margin: '0 0 4px', letterSpacing: '-.005em' }}>
            Plán pedagogickej činnosti
          </h1>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>
            MŠ Slniečko · trieda Mravce · pani Petra · {lesson.date || ''}
          </div>

          <DocSection title="Cieľ aktivity">
            <p style={{ margin: 0 }}>{data.goal}</p>
          </DocSection>

          <DocSection title="Pomôcky">
            <ul style={ulStyle}>{data.aids.map((a, i) => <li key={i} style={liStyle}>{a}</li>)}</ul>
          </DocSection>

          <DocSection title="Štruktúra hodiny">
            {data.structure.map((s, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{
                  fontWeight: 700, color: '#1f3a5f', fontSize: 14.5,
                  display: 'inline-block', padding: '2px 10px',
                  background: '#EAF2FA', borderRadius: 4, marginBottom: 6,
                }}>{s.phase}</div>
                <ul style={ulStyle}>{s.items.map((it, j) => <li key={j} style={liStyle}>{it}</li>)}</ul>
              </div>
            ))}
          </DocSection>

          <DocSection title="Očakávané výstupy">
            <ul style={ulStyle}>{data.expected.map((e, i) => <li key={i} style={liStyle}>{e}</li>)}</ul>
          </DocSection>

          <DocSection title="Diferenciácia">
            <ul style={ulStyle}>{data.differentiation.map((d, i) => <li key={i} style={liStyle}>{d}</li>)}</ul>
          </DocSection>

          <DocSection title="Poznámky učiteľky">
            <p style={{ margin: 0, fontStyle: 'italic', color: '#475569' }}>{data.notes}</p>
          </DocSection>

          <div style={{ marginTop: 30, paddingTop: 14, borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8', textAlign: 'right' }}>
            Strana 1 / 1 · Alfík — metodická príloha
          </div>
        </div>
      </div>
    </div>
  );
}

const ulStyle = { margin: '0 0 0 22px', padding: 0 };
const liStyle = { marginBottom: 4 };

function DocSection({ title, children }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <h2 style={{
        fontFamily: '"Calibri", system-ui', fontSize: 17, fontWeight: 700,
        color: '#1f3a5f', margin: '0 0 8px',
        borderBottom: '2px solid #1f3a5f', paddingBottom: 3,
      }}>{title}</h2>
      {children}
    </section>
  );
}

// ─── Delete lesson confirmation ─────────────────────────────────────────
function DeleteLessonModal({ lesson, onClose }) {
  if (!lesson) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15, 30, 55, .45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, background: '#fff', borderRadius: 20,
        boxShadow: '0 30px 80px -20px rgba(15, 30, 55, .35)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px 8px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 99, flexShrink: 0,
            background: 'var(--alf-coral-bg)', color: '#A94545',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 18, fontWeight: 800, color: 'var(--alf-ink)', margin: '4px 0 6px', letterSpacing: '-.01em' }}>
              Skutočne chcete zmazať hodinu „{lesson.name}"?
            </h2>
            <div style={{ fontSize: 13.5, color: 'var(--alf-ink-soft)', lineHeight: 1.45 }}>
              Hodina obsahuje {lesson.tests?.length || 0} priradených cvičení. Cvičenia samotné sa nezmažú — len ich priradenie k tejto hodine.
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 28px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} className="alf-btn">Zrušiť</button>
          <button onClick={onClose} className="alf-btn" style={{ background: '#A94545', color: '#fff', borderColor: '#A94545' }}>Zmazať hodinu</button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete material confirmation ───────────────────────────────────────
function DeleteMaterialModal({ material, onClose }) {
  if (!material) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15, 30, 55, .45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, background: '#fff', borderRadius: 20,
        boxShadow: '0 30px 80px -20px rgba(15, 30, 55, .35)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px 8px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 99, flexShrink: 0,
            background: 'var(--alf-coral-bg)', color: '#A94545',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 18, fontWeight: 800, color: 'var(--alf-ink)', margin: '4px 0 6px', letterSpacing: '-.01em' }}>
              Skutočne chcete zmazať materiál „{material.name}"?
            </h2>
            <div style={{ fontSize: 13.5, color: 'var(--alf-ink-soft)', lineHeight: 1.45 }}>
              Materiál bude odstránený len z hodiny, v učebných materiáloch zostane.
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 28px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} className="alf-btn">Zrušiť</button>
          <button onClick={onClose} className="alf-btn" style={{ background: '#A94545', color: '#fff', borderColor: '#A94545' }}>Zmazať materiál</button>
        </div>
      </div>
    </div>
  );
}

// ─── 1C · Kalendár — mesačný pohľad s vyznačenými hodinami ─────────────
function Teacher_1C_Calendar() {
  const nav = React.useContext(TeacherNavCtx);
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear]   = React.useState(today.getFullYear());

  const MONTH_SK = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
  const DAY_SK   = ['Po','Ut','St','Št','Pi','So','Ne'];

  // Parse "d.m.-d.m.yyyy" or "d.m.yyyy" into {from, to} Date objects
  function parseLessonDates(dr) {
    if (!dr) return null;
    try {
      const clean = dr.trim();
      // e.g. "1.6.-12.7.2026" → from=1.6.2026, to=12.7.2026
      const parts = clean.split('-');
      if (parts.length >= 2) {
        const yearMatch = clean.match(/(\d{4})/);
        const yr = yearMatch ? parseInt(yearMatch[1]) : year;
        const [ad, am] = parts[0].replace(/\.$/, '').split('.');
        const toLast = parts[parts.length - 1].trim();
        const [bd, bm, by] = toLast.split('.');
        return {
          from: new Date(yr, parseInt(am) - 1, parseInt(ad)),
          to:   new Date(by ? parseInt(by) : yr, parseInt(bm) - 1, parseInt(bd)),
        };
      }
    } catch(e) {}
    return null;
  }

  // Build calendar grid (Mon-first)
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startDow + 1;
    return (day < 1 || day > lastDay.getDate()) ? null : new Date(year, month, day);
  });

  // Map lessons to their date ranges
  const lessonRanges = LESSONS.map(l => {
    const range = parseLessonDates(l.dateRange);
    return range ? { ...l, ...range } : null;
  }).filter(Boolean);

  function getLessonsForDay(date) {
    return lessonRanges.filter(l => date >= l.from && date <= l.to);
  }

  const LESSON_COLORS = ['var(--alf-sky-deep)','var(--alf-mint-deep)','#7C5CCB','#D97757','#C45A5A'];

  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="classes" classesSub="kalendar" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar title="Kalendár" hideAge search={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="alf-btn-pill" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
              onClick={() => { const d = new Date(year, month - 1, 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: 'center', color: 'var(--alf-ink)' }}>{MONTH_SK[month]} {year}</span>
            <button className="alf-btn-pill" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
              onClick={() => { const d = new Date(year, month + 1, 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
            </button>
          </div>
        </TeacherTopBar>

        <div style={{ flex: 1, padding: '20px 36px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
            {DAY_SK.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: 'var(--alf-ink-mute)', padding: '6px 0', letterSpacing: '.06em' }}>{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, flex: 1 }}>
            {cells.map((date, i) => {
              const isToday = date && date.toDateString() === today.toDateString();
              const lessons = date ? getLessonsForDay(date) : [];
              return (
                <div key={i} style={{
                  minHeight: 90, borderRadius: 10, padding: '8px 8px 6px',
                  background: date ? (isToday ? 'var(--alf-sky-bg)' : '#fff') : 'transparent',
                  border: date ? `1.5px solid ${isToday ? 'var(--alf-sky-deep)' : 'var(--alf-line)'}` : 'none',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  {date && (
                    <>
                      <span style={{
                        fontSize: 13, fontWeight: isToday ? 800 : 600,
                        color: isToday ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
                        lineHeight: 1,
                      }}>{date.getDate()}</span>
                      {lessons.map((l, li) => (
                        <button key={l.id} onClick={() => nav?.navigate('classes', 'hodiny')} title={l.name} style={{
                          width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                          background: LESSON_COLORS[li % LESSON_COLORS.length],
                          color: '#fff', borderRadius: 5, padding: '3px 6px',
                          fontSize: 10.5, fontWeight: 700, lineHeight: 1.25,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{l.name}</button>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── 1C · Moje hodiny — grouped, collapsible list ───────────────────────
function Teacher_1C_Lessons() {
  const [expanded, setExpanded] = React.useState(new Set(['l1']));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState(null);
  const [deletingLesson, setDeletingLesson] = React.useState(null);
  const [deletingMaterial, setDeletingMaterial] = React.useState(null);
  const [editingMaterial, setEditingMaterial] = React.useState(null);
  const [createExerciseOpen, setCreateExerciseOpen] = React.useState(false);
  const openNew = () => { setEditingLesson(null); setModalOpen(true); setExpanded(new Set()); };
  const openEdit = (l) => { setEditingLesson(l); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingLesson(null); };
  const toggleLesson = (id) => setExpanded((prev) =>
    prev.has(id) ? new Set() : new Set([id])
  );

  const [tag, setTag] = React.useState('all');
  const [season, setSeason] = React.useState('Jar');
  const [age, setAge] = React.useState('all');
  const tags = [
    { id: 'all',           label: 'Všetky' },
    { id: 'testy',         label: 'Cvičenia' },
    { id: 'pesničky',      label: 'Pesničky' },
    { id: 'videá',         label: 'Videá' },
    { id: 'maľovanky',     label: 'Maľovanky' },
    { id: 'grafomotorika', label: 'Grafomotorika' },
  ];

  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="classes" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar title="Moje hodiny" hideAge search={false}>
          <button onClick={openNew} className="alf-btn is-active">+ Nová hodina</button>
        </TeacherTopBar>

        <div style={{ flex: 1, padding: '20px 36px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filters row — Obdobie + Vek vľavo · Hľadať vpravo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <SeasonFilter value={season} onChange={setSeason} />
            <AgeFilterPill value={age} onChange={setAge} />

            <span style={{ flex: 1 }} />

            <div className="alf-search" style={{ width: 260 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input placeholder="Hľadať..." />
            </div>
          </div>

          {/* Lessons list */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--alf-shadow-card)', overflow: 'hidden' }}>
            {LESSONS.filter(l => age === 'all' || l.age === age).map((l) => (
              <LessonRow
                key={l.id}
                lesson={l}
                expanded={expanded.has(l.id)}
                onToggle={() => toggleLesson(l.id)}
                onEdit={openEdit}
                onDelete={setDeletingLesson}
                onDeleteTest={setDeletingMaterial}
                onEditTest={setEditingMaterial}
                onCreateExercise={() => setCreateExerciseOpen(true)}
              />
            ))}
          </div>
        </div>

        <NewLessonModal key={editingLesson?.id || 'new'} open={modalOpen} onClose={closeModal} lesson={editingLesson} />
        <DeleteLessonModal lesson={deletingLesson} onClose={() => setDeletingLesson(null)} />
        <DeleteMaterialModal material={deletingMaterial} onClose={() => setDeletingMaterial(null)} />
        <NewMaterialModal key={editingMaterial?.id || 'edit-mat'} open={!!editingMaterial} material={editingMaterial} onClose={() => setEditingMaterial(null)} />
        <CreateExerciseModal open={createExerciseOpen} onClose={() => setCreateExerciseOpen(false)} />
      </main>
    </div>
  );
}

// ─── Add materials modal — pick from 1B1 (Témy) or 1B3 (Moje) ──────────
function AddMaterialsModal({ lesson, onClose }) {
  const [view, setView] = React.useState('temy');           // 'temy' | 'svp' | 'mine'
  const [selectedSub, setSelectedSub] = React.useState(null);
  const [kind, setKind] = React.useState('all');
  const [skillFilter, setSkillFilter] = React.useState(() => new Set());
  const [skillsOpen, setSkillsOpen] = React.useState(false);
  const [ageFilter, setAgeFilter] = React.useState('all');
  const [ageOpen, setAgeOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [picked, setPicked] = React.useState(() => new Set());
  const skillsRef = React.useRef(null);
  const ageRef = React.useRef(null);

  React.useEffect(() => {
    const h = (e) => {
      if (skillsOpen && skillsRef.current && !skillsRef.current.contains(e.target)) setSkillsOpen(false);
      if (ageOpen && ageRef.current && !ageRef.current.contains(e.target)) setAgeOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [skillsOpen, ageOpen]);

  const filtered = MATERIALS.filter(m => {
    if (view === 'mine' && !m.mine) return false;
    if (kind !== 'all' && !m.tags.includes(kind)) return false;
    if (ageFilter !== 'all' && !m.ages.includes(ageFilter)) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!m.name.toLowerCase().includes(q)) return false;
    }
    // skill filter — assigned tags via tagsForMaterial
    if (skillFilter.size > 0) {
      const mt = tagsForMaterial(m.id).map(t => t.id);
      if (![...skillFilter].some(s => mt.includes(s))) return false;
    }
    return true;
  });

  const togglePick = (id) => setPicked((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 130,
      background: 'rgba(15, 30, 55, .5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '94%', maxWidth: 1180, height: '92%', background: '#fff', borderRadius: 18,
        boxShadow: '0 30px 80px -20px rgba(15, 30, 55, .35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 26px', borderBottom: '1px solid var(--alf-line)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'var(--alf-mint-bg)', color: '#1E7A5E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1E7A5E', letterSpacing: '.1em', textTransform: 'uppercase' }}>Pridať do hodiny</div>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 20, fontWeight: 800, color: 'var(--alf-ink)', margin: '2px 0 0', letterSpacing: '-.01em' }}>{lesson.name}</h2>
          </div>

          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
            background: '#fff', color: 'var(--alf-ink-soft)', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <ThemeTreePanel
            selected={selectedSub}
            onSelect={setSelectedSub}
            mode={view === 'svp' ? 'svp' : 'temy'}
            empty={view === 'mine'}
            header={
              <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--alf-bg)', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
                {[
                  { id: 'temy', label: 'Témy' },
                  { id: 'svp',  label: 'ŠVP' },
                  { id: 'mine', label: 'Moje' },
                ].map((v) => (
                  <button key={v.id} onClick={() => { setView(v.id); setSelectedSub(null); }} style={{
                    flex: 1, padding: '7px 10px', borderRadius: 99, border: 'none',
                    background: view === v.id ? '#fff' : 'transparent',
                    color: view === v.id ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    boxShadow: view === v.id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                  }}>{v.label}</button>
                ))}
              </div>
            }
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--alf-bg)' }}>
            {/* Filters */}
            <div style={{
              padding: '14px 22px', borderBottom: '1px solid var(--alf-line)',
              background: '#fff',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <div className="alf-search" style={{ width: 260 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hľadať..." />
              </div>

              {/* Zručnosti */}
              <div ref={skillsRef} style={{ position: 'relative' }}>
                <button onClick={() => setSkillsOpen(o => !o)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px', borderRadius: 10,
                  background: '#fff', border: '1.5px solid var(--alf-line)',
                  color: 'var(--alf-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--alf-font-body)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  <span>Zručnosti</span>
                  {skillFilter.size > 0 && (
                    <span style={{ padding: '2px 7px', borderRadius: 99, background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)', fontSize: 11, fontWeight: 800 }}>{skillFilter.size}</span>
                  )}
                  <span style={{ color: 'var(--alf-ink-mute)', fontSize: 10 }}>{skillsOpen ? '▴' : '▾'}</span>
                </button>
                {skillsOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    width: 320, background: '#fff', borderRadius: 12,
                    boxShadow: '0 14px 36px -10px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
                    zIndex: 50, overflow: 'hidden',
                  }}>
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {TAGS.map((t) => {
                        const checked = skillFilter.has(t.id);
                        return (
                          <label key={t.id} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', cursor: 'pointer',
                            background: checked ? 'rgba(46,184,146,.08)' : 'transparent',
                            borderBottom: '1px solid var(--alf-line)',
                          }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: 6,
                              background: checked ? '#1E7A5E' : '#fff',
                              border: checked ? 'none' : '1.5px solid var(--alf-ink-mute)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
                            </span>
                            <input type="checkbox" checked={checked} onChange={() => {
                              setSkillFilter(prev => {
                                const n = new Set(prev);
                                n.has(t.id) ? n.delete(t.id) : n.add(t.id);
                                return n;
                              });
                            }} style={{ display: 'none' }} />
                            <CurricularTagIcon tag={t} size={24} />
                            <span style={{ fontSize: 13.5, color: 'var(--alf-ink)', fontWeight: 600 }}>{t.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Vek */}
              <div ref={ageRef} style={{ position: 'relative' }}>
                <button onClick={() => setAgeOpen(o => !o)} className="alf-btn-pill" style={{
                  background: ageOpen ? 'var(--alf-sky-bg)' : '#fff',
                  borderColor: ageOpen ? 'var(--alf-sky-deep)' : 'var(--alf-line)',
                }}>
                  <span style={{ color: 'var(--alf-ink-mute)', fontWeight: 600 }}>Vek:</span>
                  <strong style={{ marginLeft: 2 }}>{ageFilter === 'all' ? 'Všetky' : AGE_META[ageFilter]?.label}</strong>
                  <span style={{ color: 'var(--alf-ink-mute)', marginLeft: 2, fontSize: 11 }}>{ageOpen ? '▴' : '▾'}</span>
                </button>
                {ageOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 180,
                    background: '#fff', borderRadius: 12, padding: 6, zIndex: 50,
                    boxShadow: 'var(--alf-shadow-popover)', border: '1px solid var(--alf-line)',
                    display: 'flex', flexDirection: 'column', gap: 2,
                  }}>
                    {['all', '3', '4', '5'].map((a) => {
                      const isActive = ageFilter === a;
                      const lbl = a === 'all' ? 'Všetky' : AGE_META[a].label;
                      return (
                        <button key={a} onClick={() => { setAgeFilter(a); setAgeOpen(false); }} style={{
                          width: '100%', textAlign: 'left',
                          padding: '8px 12px', borderRadius: 8, border: 'none',
                          background: isActive ? 'var(--alf-sky-bg)' : 'transparent',
                          color: isActive ? 'var(--alf-sky-ink)' : 'var(--alf-ink)',
                          fontWeight: isActive ? 700 : 600, fontSize: 13.5,
                          cursor: 'pointer', fontFamily: 'var(--alf-font-body)',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{ width: 14, color: isActive ? 'var(--alf-sky-deep)' : 'transparent', fontWeight: 800 }}>✓</span>
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <span style={{ flex: 1 }} />

              <div style={{ fontSize: 12, color: 'var(--alf-ink-mute)' }}>
                {filtered.length} z {MATERIALS.filter(m => view === 'mine' ? m.mine : true).length} materiálov
              </div>
            </div>

            {/* Kind filter (Všetky/Testy/Pesničky/Videá/Maľovanky/Grafomotorika) */}
            <div style={{
              padding: '12px 22px', borderBottom: '1px solid var(--alf-line)',
              background: '#fff',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--alf-bg)', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
                {[
                  { id: 'all',           label: 'Všetky' },
                  { id: 'testy',         label: 'Cvičenia' },
                  { id: 'pesničky',      label: 'Pesničky' },
                  { id: 'videá',         label: 'Videá' },
                  { id: 'maľovanky',     label: 'Maľovanky' },
                  { id: 'grafomotorika', label: 'Grafomotorika' },
                ].map((k) => (
                  <button key={k.id} onClick={() => setKind(k.id)} style={{
                    padding: '6px 14px', borderRadius: 99, border: 'none',
                    background: kind === k.id ? 'var(--alf-sky-bg)' : 'transparent',
                    color: kind === k.id ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
                    fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                  }}>{k.label}</button>
                ))}
              </div>
            </div>

            {/* Materials list with checkboxes */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--alf-ink-mute)', fontStyle: 'italic' }}>Žiadne materiály neodpovedajú filtrom.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtered.map((m) => {
                    const checked = picked.has(m.id);
                    const matTags = tagsForMaterial(m.id);
                    return (
                      <div key={m.id} onClick={() => togglePick(m.id)} style={{
                        display: 'grid',
                        gridTemplateColumns: '36px 64px 1fr 200px',
                        gap: 14, padding: '10px 14px', alignItems: 'center',
                        background: checked ? 'rgba(46,184,146,.08)' : '#fff',
                        borderRadius: 12, cursor: 'pointer',
                        border: `1.5px solid ${checked ? '#1E7A5E' : 'var(--alf-line)'}`,
                        transition: 'background .12s, border-color .12s',
                      }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: checked ? '#1E7A5E' : '#fff',
                          border: checked ? 'none' : '1.5px solid var(--alf-ink-mute)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
                        </span>
                        <PlayButton material={m} size={48} />
                        <div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2 }}>{m.name}</div>
                          <div style={{ marginTop: 3, fontSize: 11, color: 'var(--alf-ink-mute)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ padding: '1px 6px', borderRadius: 4, background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)', fontSize: 9, fontWeight: 800, letterSpacing: '.06em' }}>TÉMA</span>
                              {m.category}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ padding: '1px 6px', borderRadius: 4, background: 'var(--alf-mint-bg)', color: '#1E7A5E', fontSize: 9, fontWeight: 800, letterSpacing: '.06em' }}>VEK</span>
                              {m.ages.map(a => AGE_META[a]?.label).filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {matTags.map((t) => <CurricularTagIcon key={t.id} tag={t} size={26} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 26px', borderTop: '1px solid var(--alf-line)',
          background: '#FAFBFD',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: 'var(--alf-ink-soft)' }}>
            {picked.size === 0 ? 'Žiadny materiál nie je vybraný.' : `Vybrané: ${picked.size} materiál${picked.size === 1 ? '' : picked.size < 5 ? 'y' : 'ov'}`}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPicked(new Set())} className="alf-btn" disabled={picked.size === 0} style={{ opacity: picked.size === 0 ? .5 : 1 }}>Vyčistiť výber</button>
            <button onClick={onClose} className="alf-btn">Zrušiť</button>
            <button onClick={onClose} className="alf-btn is-active" disabled={picked.size === 0} style={{ opacity: picked.size === 0 ? .5 : 1 }}>Pridať do hodiny ({picked.size})</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Teacher_1C_Lessons, Teacher_1C_Calendar, CreateExerciseModal });
