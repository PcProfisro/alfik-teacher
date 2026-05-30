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

// Test row used inside an expanded lesson — Play · Názov · Tagy · Zmazať.
function TestRow({ m, onDelete }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr 50px',
      gap: 16, padding: '12px 22px 12px 64px',
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
        <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <CategoryPath material={m} />
          <SvpPath material={m} />
        </div>
      </div>
      <div style={{ display: 'none' }}>
        {m.tags.slice(0, 1).map(t => <MaterialTagIcon key={t} kind={t} size={30} />)}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDelete?.(m); }} title="Zmazať materiál" style={{
        width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
        background: '#fff', color: '#A94545', cursor: 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    </div>
  );
}

// Lesson row — chevron + season + status + name + age-icon + Upraviť.
function LessonRow({ lesson, expanded, onToggle, onEdit, onDelete, onDeleteTest }) {
  const testObjs = lesson.tests.map(id => MATERIALS.find(m => m.id === id)).filter(Boolean);
  const [addOpen, setAddOpen] = React.useState(false);
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
            <LessonStatus status={lesson.status} />
            <SeasonChip season={lesson.season} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: 'var(--alf-mint-bg)', color: '#1E7A5E',
              fontSize: 11, fontWeight: 800, letterSpacing: '.04em',
            }}>
              <span style={{ opacity: .7, letterSpacing: '.08em' }}>VEK</span>
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
          <button onClick={(e) => { e.stopPropagation(); setAddOpen(true); }} title="Pridať materiály do hodiny" className="alf-btn-pill" style={{ padding: 0, width: 44, height: 44, justifyContent: 'center', background: 'var(--alf-mint-bg)', borderColor: 'var(--alf-mint-bg)', color: '#1E7A5E' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <NotesButton notes={lesson.notes} />
          <MethodologyButton lesson={lesson} />
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

      {expanded && testObjs.map((m) => (
        <TestRow key={m.id} m={m} onDelete={onDeleteTest} />
      ))}

      {addOpen && <AddMaterialsModal lesson={lesson} onClose={() => setAddOpen(false)} />}
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
  const [status, setStatus] = React.useState(lesson?.status || 'draft');
  const [methodFile, setMethodFile] = React.useState(null);
  const methodRef = React.useRef(null);

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
                      <AgeIcon age={a} size={26} />
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

          {/* Stav hodiny */}
          <Field label="Stav">
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'draft', label: 'Návrh',     bg: '#F0EEF6',            fg: '#6B5DAA' },
                { id: 'next',  label: 'Pripravené', bg: 'var(--alf-mint-bg)', fg: '#1E7A5E' },
              ].map((s) => {
                const active = status === s.id;
                return (
                  <button key={s.id} onClick={() => setStatus(s.id)} style={{
                    flex: 1, padding: '10px 12px', borderRadius: 12,
                    border: `1.5px solid ${active ? s.fg : 'var(--alf-line)'}`,
                    background: active ? s.bg : '#fff',
                    color: active ? s.fg : 'var(--alf-ink-soft)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: active ? s.fg : 'var(--alf-ink-mute)' }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Téma — category tree dropdown */}
          <Field label="Téma">
            <div onClick={() => setCatOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <CategoryDropdown selected={theme} open={catOpen} />
            </div>
            {catOpen && (
              <div style={{ fontSize: 11, color: 'var(--alf-ink-mute)', marginTop: 6 }}>
                Klikni na podkategóriu pre jej výber.
              </div>
            )}
          </Field>

          {/* ŠVP — also a category tree picker */}
          <Field label="Štátny vzdelávací program">
            <div onClick={() => setSvpOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <CategoryDropdown selected={svp} open={svpOpen} />
            </div>
          </Field>

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

          {/* Metodická príloha — docx upload */}
          <Field label="Metodická príloha">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 14,
              border: `1.5px dashed ${methodFile ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)'}`,
              background: methodFile ? 'var(--alf-sky-bg)' : '#FAFBFD',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: methodFile ? '#fff' : 'var(--alf-bg)',
                color: methodFile ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M9 13l2 2 4-4"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {methodFile || 'Zatiaľ nebol vložený žiadny dokument'}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--alf-ink-mute)', marginTop: 3 }}>
                  Podporované: DOCX, PDF · max 10 MB · plán hodiny, pomôcky, aktivity
                </div>
              </div>
              <input ref={methodRef} type="file" accept=".docx,.doc,.pdf" hidden onChange={(e) => setMethodFile(e.target.files?.[0]?.name || null)} />
              <button onClick={() => methodRef.current?.click()} className="alf-btn" style={{ flexShrink: 0 }}>
                {methodFile ? 'Zmeniť' : 'Vybrať súbor'}
              </button>
            </div>
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

// ─── 1C · Moje hodiny — grouped, collapsible list ───────────────────────
function Teacher_1C_Lessons() {
  const [expanded, setExpanded] = React.useState(new Set(['l1']));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState(null);
  const [deletingLesson, setDeletingLesson] = React.useState(null);
  const [deletingMaterial, setDeletingMaterial] = React.useState(null);
  const openNew = () => { setEditingLesson(null); setModalOpen(true); setExpanded(new Set()); };
  const openEdit = (l) => { setEditingLesson(l); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingLesson(null); };
  const toggleLesson = (id) => setExpanded((prev) =>
    prev.has(id) ? new Set() : new Set([id])
  );

  const [tag, setTag] = React.useState('all');
  const [season, setSeason] = React.useState('Jar');
  const [age, setAge] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
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
          {/* Filters row — Obdobie · tagy · Vek */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <SeasonFilter value={season} onChange={setSeason} />

            <div style={{ display: 'flex', gap: 6, padding: 4, background: '#fff', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
              {[
                { id: 'all',   label: 'Všetky' },
                { id: 'draft', label: 'Návrh' },
                { id: 'next',  label: 'Pripravené' },
              ].map((s) => (
                <button key={s.id} onClick={() => setStatusFilter(s.id)} style={{
                  padding: '6px 16px', borderRadius: 99, border: 'none',
                  background: statusFilter === s.id ? 'var(--alf-sky-bg)' : 'transparent',
                  color: statusFilter === s.id ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>{s.label}</button>
              ))}
            </div>

            <span style={{ flex: 1 }} />

            <div className="alf-search" style={{ width: 260 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input placeholder="Hľadať..." />
            </div>

            <AgeFilterPill value={age} onChange={setAge} />
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
              />
            ))}
          </div>
        </div>

        <NewLessonModal key={editingLesson?.id || 'new'} open={modalOpen} onClose={closeModal} lesson={editingLesson} />
        <DeleteLessonModal lesson={deletingLesson} onClose={() => setDeletingLesson(null)} />
        <DeleteMaterialModal material={deletingMaterial} onClose={() => setDeletingMaterial(null)} />
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

Object.assign(window, { Teacher_1C_Lessons });
