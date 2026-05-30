/* shared.jsx — data + shared primitives across all artboards.
 * Exports to window: AGE_META, AgeIcon, AgeFilter, AgePopover, TeacherSidebar,
 * Breadcrumbs, KidTopBar, MASCOT, ASSET, CATEGORIES, SUBCATS, MATERIALS,
 * ColorDot, MaterialIcon.
 */

const ASSET = (n) => `assets/${n}`;
const MASCOT = ASSET('light_background_boy.webp');

// Navigation context for the standalone teacher app (Ucitelsky-portal.html).
// When a provider is present, TeacherSidebar clicks route between screens;
// on the design canvas there's no provider so clicks stay inert (mock).
const TeacherNavCtx = React.createContext(null);
Object.assign(window, { TeacherNavCtx });

// ─── Age metadata ───────────────────────────────────────────────────────
const AGE_META = {
  '3':   { color: 'var(--alf-age-3-4)', bg: 'var(--alf-orange-bg)', icon: 'age_3_4.svg', label: '3–4 r.', short: '3' },
  '4':   { color: 'var(--alf-age-4-5)', bg: 'var(--alf-sun-bg)',    icon: 'age_4_5.svg', label: '4–5 r.', short: '4' },
  '5':   { color: 'var(--alf-age-5-6)', bg: 'var(--alf-mint-bg)',   icon: 'age_5_6.svg', label: '5–6 r.', short: '5' },
  'all': { color: 'var(--alf-sky-deep)', bg: 'var(--alf-sky-bg)',   icon: null,          label: 'Všetky', short: 'V' },
};

function AgeIcon({ age, size = 36 }) {
  const m = AGE_META[age];
  if (age === 'all' || !m.icon) {
    return (
      <div style={{
        width: size, height: size, padding: size * 0.18,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: size * 0.11,
      }}>
        <div style={{ height: size * 0.11, borderRadius: 99, background: 'var(--alf-age-3-4)' }} />
        <div style={{ height: size * 0.11, borderRadius: 99, background: 'var(--alf-age-4-5)' }} />
        <div style={{ height: size * 0.11, borderRadius: 99, background: 'var(--alf-age-5-6)' }} />
      </div>
    );
  }
  return <img src={ASSET(m.icon)} alt={m.label} style={{ width: size, height: size, objectFit: 'contain', display: 'block' }} />;
}

// 44×44 topbar age-filter button (closed state — shows currently active age).
function AgeFilterButton({ value, onClick, active }) {
  const m = AGE_META[value];
  return (
    <button onClick={onClick} title={`Vek: ${m.label}`} style={{
      width: 44, height: 44, padding: 6, borderRadius: 14,
      background: m.bg, border: `2.5px solid ${active ? m.color : 'transparent'}`,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all .15s ease',
    }}>
      <AgeIcon age={value} size={28} />
    </button>
  );
}

// 2×2 popover with the four age options.
function AgePopover({ value, onPick }) {
  const ages = ['all', '3', '4', '5'];
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: '#fff', borderRadius: 18, padding: 12, zIndex: 50,
      boxShadow: 'var(--alf-shadow-popover)',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
    }}>
      {ages.map((a) => {
        const m = AGE_META[a];
        const isActive = value === a;
        return (
          <button key={a} onClick={() => onPick(a)} style={{
            width: 96, height: 96, padding: 10, borderRadius: 16,
            background: m.bg, border: `2.5px solid ${isActive ? m.color : 'transparent'}`,
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <AgeIcon age={a} size={44} />
            <span style={{ fontSize: 12, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Teacher sidebar (left rail) ────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Prehľad',          icon: 'dashboard' },
  { key: 'materials', label: 'Knižnica', icon: 'materials' },
  { key: 'classes',   label: 'Moje hodiny',      icon: 'classes' },
  { key: 'history',   label: 'História',         icon: 'history' },
];

function NavIcon({ k }) {
  // Hand-drawn-feeling line icons via SVG strokes — calmer than emoji.
  const s = 22;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (k) {
    case 'dashboard': return (<svg {...props}><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg>);
    case 'materials': return (<svg {...props}><path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/><path d="M8 13h8M8 17h5"/></svg>);
    case 'classes':   return (<svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/><circle cx="12" cy="14" r="2"/></svg>);
    case 'history':   return (<svg {...props}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>);
    default: return null;
  }
}

const MATERIALS_SUBS = [
  { key: 'svp',  label: 'ŠVP' },
  { key: 'temy', label: 'Témy' },
  { key: 'typy', label: 'Typy' },
  { key: 'mine', label: 'Moje' },
];

function TeacherSidebar({ active = 'library', materialsSub = 'temy', teacherName = 'Janka Usilovná' }) {
  const [materialsOpen, setMaterialsOpen] = React.useState(active === 'materials');
  const [collapsed, setCollapsed] = React.useState(false);
  const nav = React.useContext(TeacherNavCtx);

  return (
    <aside style={{
      width: collapsed ? 72 : 248, height: '100%', background: '#fff', borderRight: '1px solid var(--alf-line)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      transition: 'width .18s ease',
    }}>
      <div style={{
        padding: collapsed ? '12px 0 8px' : '12px 12px 8px',
        display: 'flex', flexDirection: collapsed ? 'column' : 'row',
        alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: 8,
      }}>
        {!collapsed && <img src={ASSET('icon_alfik_sk.svg')} alt="Alfík" style={{ height: 80, width: 'auto', display: 'block' }} />}
        <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Zobraziť bočný panel' : 'Skryť bočný panel'} style={{
          width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
          background: '#fff', color: 'var(--alf-ink-soft)', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2.5"/>
            <line x1="9" y1="5" x2="9" y2="19"/>
          </svg>
        </button>
      </div>

      <nav style={{ padding: collapsed ? '6px 8px' : '6px 12px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map((it) => {
          const isActive = it.key === active;
          const isMaterials = it.key === 'materials';
          const showSubs = !collapsed && isMaterials && (isActive || materialsOpen);
          return (
            <React.Fragment key={it.key}>
              <a href="#" title={collapsed ? it.label : undefined} onClick={(e) => {
                e.preventDefault();
                if (isMaterials) {
                  if (!collapsed) setMaterialsOpen(o => !o);
                  if (nav) nav.navigate('materials', materialsSub || 'temy');
                } else if (nav) {
                  nav.navigate(it.key);
                }
              }} style={{
                display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12,
                padding: collapsed ? '11px 0' : '11px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12, textDecoration: 'none',
                background: isActive ? 'var(--alf-sky-bg)' : 'transparent',
                color: isActive ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
                fontSize: 14.5, fontWeight: isActive ? 700 : 600,
                position: 'relative',
              }}>
                {isActive && !collapsed && <span style={{ position: 'absolute', left: -12, top: 8, bottom: 8, width: 3, background: 'var(--alf-sky-deep)', borderRadius: 2 }} />}
                <NavIcon k={it.key} />
                {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
                {isMaterials && !collapsed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{
                    transition: 'transform .15s ease',
                    transform: showSubs ? 'rotate(90deg)' : 'rotate(0deg)',
                    opacity: .7,
                  }}><path d="m9 6 6 6-6 6"/></svg>
                )}
              </a>
              {showSubs && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 0 4px 36px' }}>
                  {MATERIALS_SUBS.map((s) => {
                    const subActive = isActive && s.key === materialsSub;
                    return (
                      <a key={s.key} href="#" onClick={(e) => { e.preventDefault(); if (nav) nav.navigate('materials', s.key); }} style={{
                        padding: '8px 12px', borderRadius: 10, textDecoration: 'none',
                        background: subActive ? 'var(--alf-sky-bg)' : 'transparent',
                        color: subActive ? 'var(--alf-sky-ink)' : 'var(--alf-ink-mute)',
                        fontSize: 13.5, fontWeight: subActive ? 700 : 600,
                      }}>{s.label}</a>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <AppsLauncher collapsed={collapsed} />
      <ProfileFooter teacherName={teacherName} role="teacher" collapsed={collapsed} />
    </aside>
  );
}

// ─── Apps launcher ──────────────────────────────────────────────────────
const APPS = [
  { id: 'alfik',    label: 'Alfík',         icon: 'icon_app_alfik.svg' },
  { id: 'alfbook',  label: 'Alfbook',       icon: 'icon_app_alfbook.svg' },
  { id: 'alfpedia', label: 'Alfpédia',      icon: 'icon_app_alfpedia.svg' },
  { id: 'ulohy',    label: 'Domáce úlohy',  icon: 'icon_app_domace_ulohy.svg' },
  { id: 'vabank',   label: 'Vabank',        icon: 'icon_app_vabank.svg' },
  { id: 'alfiada',  label: 'Alfiáda',       icon: 'icon_app_alfiada_sk.svg' },
];

function AppsLauncher({ collapsed = false }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', borderTop: '1px solid var(--alf-line)' }}>
      <button onClick={() => setOpen(o => !o)} title={collapsed ? 'Aplikácie' : undefined} style={{
        width: '100%',
        padding: collapsed ? '11px 0' : '11px 16px',
        display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12,
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: open ? 'var(--alf-bg)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background .12s',
        color: 'var(--alf-ink)',
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 9,
          background: open ? 'var(--alf-sky-bg)' : 'transparent',
          color: open ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {/* 9-dot grid icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/>
            <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
            <circle cx="5" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/>
          </svg>
        </span>
        {!collapsed && <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Aplikácie</span>}
        {!collapsed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>}
      </button>

      {open && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 8px)', bottom: 0,
          width: 280, background: '#fff', borderRadius: 14, padding: 10,
          boxShadow: '0 14px 36px -10px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
          zIndex: 70,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 6px 8px' }}>Aplikácie</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {APPS.map((a) => (
              <button key={a.id} onClick={() => setOpen(false)} title={a.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px 6px', borderRadius: 10,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 11.5, fontWeight: 600, color: 'var(--alf-ink)',
                fontFamily: 'var(--alf-font-body)', textAlign: 'center',
                transition: 'background .1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--alf-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <img src={ASSET(a.icon)} alt="" style={{ width: 40, height: 40, display: 'block' }} />
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AppsLauncher });

// ─── Bottom profile button + popup menu ────────────────────────────────
const PROFILE_ITEMS = [
  { id: 'support', label: 'Podpora',       icon: 'support' },
  { id: 'profile', label: 'Môj profil',    icon: 'profile' },
  { id: 'buy',     label: 'Kúpiť',         icon: 'buy' },
  { id: 'gdpr',    label: 'GDPR',          icon: 'gdpr' },
  { id: 'admin',   label: 'Administrácia', icon: 'admin' },
  { id: 'logout',  label: 'Odhlásiť sa',   icon: 'logout', danger: true },
];

function ProfileItemIcon({ k }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (k) {
    case 'support': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.3 9a3 3 0 0 1 5.7 1.3c0 1.8-2.5 2.2-2.5 4"/><path d="M12 17.5v.01"/></svg>);
    case 'profile': return (<svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>);
    case 'buy':     return (<svg {...p}><path d="M6 6h15l-2 9H8z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6 4.5 3H2"/></svg>);
    case 'gdpr':    return (<svg {...p}><path d="M12 3 4 6v6c0 4.5 3.3 8.5 8 9.5 4.7-1 8-5 8-9.5V6z"/><path d="m9 12 2 2 4-4"/></svg>);
    case 'admin':   return (<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'logout':  return (<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>);
    default: return null;
  }
}

function ProfileFooter({ teacherName, role = 'teacher', collapsed = false, avatarSlot = null, avatarImg = null, avatarSize = 36 }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const subline = role === 'kid' ? '5 rokov · trieda Mravce' : 'MŠ Slniečko';
  const initial = (teacherName || 'P').trim().charAt(0).toUpperCase() || 'P';

  return (
    <div ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', borderTop: '1px solid var(--alf-line)' }}>
      <button onClick={() => setOpen(o => !o)} title={collapsed ? teacherName : undefined} style={{
        width: '100%',
        padding: collapsed ? '12px 0 14px' : '12px 16px 14px',
        display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: open ? 'var(--alf-bg)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background .12s',
      }}>
        {avatarImg ? (
          <img
            src={avatarImg}
            alt={teacherName}
            style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', flexShrink: 0, display: 'block', objectFit: 'cover', boxShadow: '0 0 0 3px rgba(255,255,255,.9)' }}
          />
        ) : avatarSlot ? (
          <image-slot
            id={avatarSlot}
            shape="circle"
            placeholder="Foto"
            style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', flexShrink: 0, display: 'block', boxShadow: '0 0 0 3px rgba(255,255,255,.9)' }}
          ></image-slot>
        ) : (
          <div style={{
            width: avatarSize, height: avatarSize, borderRadius: 99,
            background: 'linear-gradient(135deg, var(--alf-coral), var(--alf-sun-deep))',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, fontFamily: 'var(--alf-font-display)', flexShrink: 0,
          }}>{initial}</div>
        )}
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacherName}</div>
              <div style={{ fontSize: 11, color: 'var(--alf-ink-mute)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subline}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{
              flexShrink: 0,
            }}><path d="m9 6 6 6-6 6"/></svg>
          </>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          left: '100%',
          marginLeft: 8,
          width: 240,
          bottom: 0,
          background: '#fff', borderRadius: 14, padding: 6,
          boxShadow: '0 14px 36px -10px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
          zIndex: 60, display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {PROFILE_ITEMS.map((it, i) => (
            <React.Fragment key={it.id}>
              {it.danger && i > 0 && <div style={{ height: 1, background: 'var(--alf-line)', margin: '4px 4px' }} />}
              <button onClick={() => setOpen(false)} style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 600, color: it.danger ? '#A94545' : 'var(--alf-ink)',
                fontFamily: 'var(--alf-font-body)',
                transition: 'background .1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = it.danger ? 'var(--alf-coral-bg)' : 'var(--alf-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <span style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: it.danger ? 'var(--alf-coral-bg)' : 'var(--alf-sky-bg)',
                  color: it.danger ? '#A94545' : 'var(--alf-sky-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ProfileItemIcon k={it.icon} />
                </span>
                {it.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ProfileFooter, ProfileItemIcon });

// ─── Topbar — teacher (search + age + actions) ──────────────────────────
function TeacherTopBar({ title, subtitle, ageValue = 'all', onAgeChange, children, search = true, breadcrumbs = null, hideAge = false, rightSlot = null }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header style={{
      padding: '20px 36px', borderBottom: '1px solid var(--alf-line)',
      display: 'flex', alignItems: 'center', gap: 24, background: '#fff', position: 'relative', zIndex: 20,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumbs}
        <h1 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 24, fontWeight: 800, color: 'var(--alf-ink)', margin: 0, lineHeight: 1.1, letterSpacing: '-.01em' }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 14, color: 'var(--alf-ink-soft)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {search && (
        <div className="alf-search" style={{ width: 280 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Hľadať..." />
        </div>
      )}
      {children}
      {rightSlot}
      {!hideAge && (
        <div style={{ position: 'relative' }}>
          <AgeFilterButton value={ageValue} active={ageValue !== 'all'} onClick={() => setOpen(!open)} />
          {open && <AgePopover value={ageValue} onPick={(v) => { onAgeChange?.(v); setOpen(false); }} />}
        </div>
      )}
    </header>
  );
}

// ─── Breadcrumbs ────────────────────────────────────────────────────────
function Breadcrumbs({ items }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--alf-ink-mute)', marginBottom: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 6 6 6-6 6"/></svg>}
          <span style={{ color: i === items.length - 1 ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)' }}>{it}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

// ─── Speaker button ─────────────────────────────────────────────────────
function SpeakerButton({ size = 34, ringColor = 'var(--alf-sky-deep)' }) {
  return (
    <button style={{
      width: size, height: size, borderRadius: 99, background: '#fff',
      border: `2px solid ${ringColor}`, cursor: 'pointer', padding: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,.05)',
    }}>
      <svg width={size * .45} height={size * .45} viewBox="0 0 24 24" fill={ringColor.startsWith('var') ? '#3FA9E0' : ringColor}>
        <path d="M11 4 6 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3l5 4z"/>
        <path d="M15 9c1.2 1.5 1.2 4.5 0 6" stroke={ringColor.startsWith('var') ? '#3FA9E0' : ringColor} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M18 6c2.5 3 2.5 9 0 12" stroke={ringColor.startsWith('var') ? '#3FA9E0' : ringColor} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ─── Category data ──────────────────────────────────────────────────────
// 10 main thematic categories (per kid brief). Each maps to icon, color, age tag.
const CATEGORIES = [
  { id: 'animals',    name: 'Zvieratá',      icon: 'icon_animals.png',     ages: ['3','4','5'], materials: 28, hint: 'Domáce, lesné, ZOO, vtáky, ryby...' },
  { id: 'nature',     name: 'Príroda',       icon: 'icon_nature.png',      ages: ['3','4','5'], materials: 22, hint: 'Stromy, kvety, počasie, krajina' },
  { id: 'numbers',    name: 'Čísla',         icon: 'icon_math.png',        ages: ['4','5'],     materials: 18, hint: 'Počítanie, porovnávanie, tvary' },
  { id: 'colors',     name: 'Farby',         icon: 'icon_colors.png',      ages: ['3','4','5'], materials: 12, hint: 'Základné a doplnkové farby' },
  { id: 'alphabet',   name: 'Abeceda',       icon: 'icon_alphabet.png',    ages: ['5'],         materials: 16, hint: 'Písmená, prvé slová' },
  { id: 'transport',  name: 'Doprava',       icon: 'icon_transport.png',   ages: ['3','4','5'], materials: 14, hint: 'Vozidlá, semafor, pravidlá' },
  { id: 'food',       name: 'Jedlo',         icon: 'icon_food.png',        ages: ['3','4'],     materials: 11, hint: 'Ovocie, zelenina, jedlá' },
  { id: 'family',     name: 'Rodina',        icon: 'icon_family.png',      ages: ['3','4','5'], materials: 9,  hint: 'Mama, otec, súrodenci' },
  { id: 'music',      name: 'Hudba',         icon: 'icon_music.png',       ages: ['4','5'],     materials: 8,  hint: 'Nástroje, rytmus, piesne' },
  { id: 'body',       name: 'Telo a zdravie',icon: 'icon_body.png',        ages: ['3','4','5'], materials: 13, hint: 'Časti tela, hygiena' },
];

// Sub-categories example for "Zvieratá" — used in 1B drill-down.
const SUBCATS_ANIMALS = [
  { id: 'farm',   name: 'Domáce zvieratá',  count: 8 },
  { id: 'forest', name: 'Lesné zvieratá',   count: 6 },
  { id: 'zoo',    name: 'Zvieratá v ZOO',   count: 5 },
  { id: 'birds',  name: 'Vtáky',            count: 4 },
  { id: 'fish',   name: 'Ryby a moria',     count: 3 },
  { id: 'bugs',   name: 'Hmyz',             count: 2 },
];

// Sample materials for 1C / 2C (Slovak).
const MATERIALS = [
  { id: 'm1',  name: 'Spoznaj zvieratá na farme',     category: 'Zvieratá',  path: ['Zvieratá', 'Domáce zvieratá'], cat: 'animals',   ages: ['3','4'], duration: '6 min',  rating: 'great', tags: ['videá', 'testy'],            curricular: ['Poznávanie funkcií písanej reči'], svp: 'Človek a príroda', mine: true },
  { id: 'm2',  name: 'Počítame do päť',               category: 'Čísla',     path: ['Čísla', 'Počítanie do 5'],     cat: 'numbers',   ages: ['4'],     duration: '4 min',  rating: 'great', tags: ['testy'],                     curricular: [], svp: 'Matematika a práca s informáciami' },
  { id: 'm3',  name: 'Farby dúhy',                    category: 'Farby',     path: ['Farby', 'Základné farby'],     cat: 'colors',    ages: ['3'],     duration: '5 min',  rating: 'good',  tags: ['videá', 'maľovanky'],        curricular: ['Rytmické činnosti'], svp: 'Umenie a kultúra', mine: true },
  { id: 'm4',  name: 'Ročné obdobia okolo nás',       category: 'Príroda',   path: ['Príroda', 'Ročné obdobia'],    cat: 'nature',    ages: ['4','5'], duration: '8 min',  rating: 'good',  tags: ['pesničky', 'testy'],         curricular: ['Hudobno-dramatické činnosti'], svp: 'Človek a príroda' },
  { id: 'm5',  name: 'Doprava v meste',               category: 'Doprava',   path: ['Doprava', 'Mestská doprava'],  cat: 'transport', ages: ['4','5'], duration: '7 min',  rating: 'great', tags: ['videá', 'testy'],            curricular: [], svp: 'Človek a spoločnosť', mine: true },
  { id: 'm6',  name: 'Hudobné nástroje — sluch',      category: 'Hudba',     path: ['Hudba', 'Hudobné nástroje'],   cat: 'music',     ages: ['5'],     duration: '6 min',  rating: 'ok',    tags: ['pesničky'],                  curricular: ['Rytmické činnosti', 'Hudobno-dramatické činnosti'], svp: 'Umenie a kultúra' },
  { id: 'm7',  name: 'Ovocie a zelenina',             category: 'Jedlo',     path: ['Jedlo', 'Ovocie a zelenina'],  cat: 'food',      ages: ['3','4'], duration: '4 min',  rating: null,    tags: ['testy', 'maľovanky'],        curricular: ['Rytmické činnosti'], svp: 'Zdravie a pohyb' },
  { id: 'm8',  name: 'Moja rodina',                   category: 'Rodina',    path: ['Rodina', 'Členovia rodiny'],   cat: 'family',    ages: ['3'],     duration: '3 min',  rating: 'good',  tags: ['pesničky'],                  curricular: ['Hudobno-dramatické činnosti'], svp: 'Človek a spoločnosť' },
  { id: 'm9',  name: 'Prvé písmená — A, B, C',        category: 'Abeceda',   path: ['Abeceda', 'Prvé písmená'],     cat: 'alphabet',  ages: ['5'],     duration: '9 min',  rating: null,    tags: ['testy', 'grafomotorika'],    curricular: ['Poznávanie funkcií písanej reči'], svp: 'Jazyk a komunikácia', mine: true },
  { id: 'm10', name: 'Lesné zvieratá v zime',         category: 'Zvieratá',  path: ['Zvieratá', 'Lesné zvieratá'],  cat: 'animals',   ages: ['4','5'], duration: '7 min',  rating: 'great', tags: ['videá', 'pesničky'],         curricular: ['Poznávanie funkcií písanej reči'], svp: 'Človek a príroda' },
];

// Rating ribbon icon (rating_great / good / ok in assets).
function RatingBadge({ rating, size = 36 }) {
  if (!rating) return <div style={{ width: size, height: size }} />;
  return <img src={ASSET(`rating_${rating}.svg`)} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />;
}

// Tag pill („videá“, „testy“, „pesničky“, „maľovanky“, „grafomotorika“).
function MaterialTag({ kind }) {
  const map = {
    'videá':         { bg: 'var(--alf-coral-bg)',  fg: '#A94545', icon: '▷' },
    'testy':         { bg: 'var(--alf-mint-bg)',   fg: '#1E7A5E', icon: '?' },
    'pesničky':      { bg: 'var(--alf-grape-bg)',  fg: '#5B47D6', icon: '♪' },
    'maľovanky':     { bg: 'var(--alf-sun-bg)',    fg: '#8C6500', icon: '✎' },
    'grafomotorika': { bg: 'var(--alf-orange-bg)', fg: '#A65A33', icon: '✍' },
    // legacy fallbacks (kid 2C still references these names — keep usable)
    'video':         { bg: 'var(--alf-coral-bg)',  fg: '#A94545', icon: '▷' },
    'kvíz':          { bg: 'var(--alf-mint-bg)',   fg: '#1E7A5E', icon: '?' },
    'príbeh':        { bg: 'var(--alf-grape-bg)',  fg: '#5B47D6', icon: '✦' },
    'zvuk':          { bg: 'var(--alf-sun-bg)',    fg: '#8C6500', icon: '♪' },
  };
  const m = map[kind] || map['videá'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 99, background: m.bg, color: m.fg,
      fontSize: 11, fontWeight: 700, letterSpacing: '.02em',
    }}>
      <span style={{ fontSize: 9 }}>{m.icon}</span>{kind === 'testy' ? 'cvičenia' : kind}
    </span>
  );
}

// Icon-only material tag — round chip showing just the glyph, with tooltip.
function MaterialTagIcon({ kind, size = 30 }) {
  const map = {
    'videá':         { bg: 'var(--alf-coral-bg)',  fg: '#A94545' },
    'testy':         { bg: 'var(--alf-mint-bg)',   fg: '#1E7A5E' },
    'pesničky':      { bg: 'var(--alf-grape-bg)',  fg: '#5B47D6' },
    'maľovanky':     { bg: 'var(--alf-sun-bg)',    fg: '#8C6500' },
    'grafomotorika': { bg: 'var(--alf-orange-bg)', fg: '#A65A33' },
  };
  const m = map[kind] || map['videá'];
  return (
    <span title={kind === 'testy' ? 'cvičenia' : kind} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 10, background: m.bg, color: m.fg,
    }}>
      <TagGlyph kind={kind} size={Math.round(size * 0.55)} />
    </span>
  );
}

function TagGlyph({ kind, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'videá':         return (<svg {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>);
    case 'testy':         return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.3 9a3 3 0 0 1 5.7 1.3c0 1.8-2.5 2.2-2.5 4M12 17.5v.01"/></svg>);
    case 'pesničky':      return (<svg {...p}><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16" r="2.5" fill="currentColor" stroke="none"/></svg>);
    case 'maľovanky':     return (<svg {...p}><path d="M3 21l4-1 12-12-3-3L4 17z"/><path d="M14 7l3 3"/></svg>);
    case 'grafomotorika': return (<svg {...p}><path d="M4 19c2-3 4-3 6-2s4 2 6-1 4-3 4-3"/><path d="M16 4l4 4-2 2-4-4z"/></svg>);
    default: return null;
  }
}

// Sample lessons — each test can be assigned to multiple lessons.
// Used by 1C Lessons screen + 1B "Moja hodina" assignment column.
const LESSONS = [
  { id: 'l1', weekday: 'Po', date: '10. mar', dateRange: '1.6.-12.7.2026', season: 'Jar', name: 'Spoznávame zvieratá',     age: '4', status: 'next',  color: 'var(--alf-sky-deep)', tests: ['m1', 'm10', 'm8'],
    theme: 'Domáce zvieratá',     svp: 'Živá príroda',                       notes: 'Pripraviť obrázkové karty zvierat. Pieseň „Kohútik jarabý". Vychádzka na blízku farmu — ak počasie dovolí.' },
  { id: 'l2', weekday: 'Ut', date: '11. mar', dateRange: '15.6.-26.7.2026', season: 'Jar', name: 'Počítame a triedime',     age: '4', status: 'next',  color: 'var(--alf-mint-deep)', tests: ['m2', 'm7'],
    theme: 'Čísla',               svp: 'Matematika a práca s informáciami',  notes: 'Stavebnice na triedenie podľa farby a veľkosti. Počítadlo 1–5, kartičky s bodkami.' },
  { id: 'l3', weekday: 'St', date: '12. mar', dateRange: '8.6.-19.7.2026', season: 'Jar', name: 'Farby a tvary okolo nás', age: '3', status: 'draft', color: 'var(--alf-coral)', tests: ['m3', 'm7'],
    theme: 'Farby',               svp: 'Človek a svet práce',                notes: 'Maľovanie prstami — farebné kruhy. Hra na hľadanie predmetov podľa farby.' },
  { id: 'l4', weekday: 'Št', date: '13. mar', dateRange: '22.6.-2.8.2026', season: 'Jar', name: 'Hudba a pohyb',           age: '5', status: 'draft', color: 'var(--alf-grape)', tests: ['m6', 'm8', 'm4'],
    theme: 'Hudba',               svp: 'Umenie a kultúra',                   notes: 'Rytmické nástroje (paličky, bubienky). Tanečná hra „Mlynček", spievanie v kruhu.' },
  { id: 'l5', weekday: 'Pi', date: '14. mar', dateRange: '29.6.-9.8.2026', season: 'Jar', name: 'Cestujeme bezpečne',      age: '5', status: 'next',  color: 'var(--alf-sun-deep)', tests: ['m5', 'm9'],
    theme: 'Doprava',             svp: 'Človek a spoločnosť',                notes: 'Magnetické autíčka, semafor, makety križovatky. Pieseň „Pri cestičke autíčko".' },
];

// Play button — chooses an icon based on material's primary tag.
const PLAY_ICONS = {
  'videá':         'icon_video.svg',
  'pesničky':      'icon_music.svg',
  'testy':         'play_test_icon.svg',
  'maľovanky':     'jpg_icon.svg',
  'grafomotorika': 'pdf_icon.svg',
};
function PlayButton({ material, size = 56 }) {
  const icon = PLAY_ICONS[material?.tags?.[0]] || 'play_test_icon.svg';
  return (
    <button title={material ? `Prehrať: ${material.name}` : 'Prehrať'} style={{
      width: size, height: size, borderRadius: 16, border: '1.5px solid var(--alf-line)',
      background: '#fff', cursor: 'pointer', padding: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 6px -2px rgba(15, 30, 55, .12)',
    }}>
      <img src={ASSET(icon)} alt="" style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain' }} />
    </button>
  );
}

// Inline age filter pill — button + popover with 4 options (text only).
function AgeFilterPill({ value = 'all', onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const label = value === 'all' ? 'Všetky' : AGE_META[value]?.label || 'Všetky';
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const ages = ['all', '3', '4', '5'];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="alf-btn-pill" style={{
        background: open ? 'var(--alf-sky-bg)' : '#fff',
        borderColor: open ? 'var(--alf-sky-deep)' : 'var(--alf-line)',
      }}>
        <span style={{ color: 'var(--alf-ink-mute)', fontWeight: 600 }}>Vek:</span>
        <strong style={{ marginLeft: 2 }}>{label}</strong>
        <span style={{ color: 'var(--alf-ink-mute)', marginLeft: 2, fontSize: 11 }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 180,
          background: '#fff', borderRadius: 12, padding: 6, zIndex: 50,
          boxShadow: 'var(--alf-shadow-popover)', border: '1px solid var(--alf-line)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {ages.map((a) => {
            const isActive = value === a;
            const lbl = a === 'all' ? 'Všetky' : AGE_META[a].label;
            return (
              <button key={a} onClick={() => { onChange?.(a); setOpen(false); }} style={{
                width: '100%', textAlign: 'left',
                padding: '9px 12px', borderRadius: 8, border: 'none',
                background: isActive ? 'var(--alf-sky-bg)' : 'transparent',
                color: isActive ? 'var(--alf-sky-ink)' : 'var(--alf-ink)',
                fontWeight: isActive ? 700 : 600, fontSize: 13.5,
                cursor: 'pointer', fontFamily: 'var(--alf-font-body)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--alf-bg)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ width: 14, color: isActive ? 'var(--alf-sky-deep)' : 'transparent', fontWeight: 800 }}>✓</span>
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AgeFilterPill });

// ─── Curricular tags — icons from uploads/tags/ ─────────────────────────
const TAGS = [
  { id: 'knowledge',  label: 'Rozvíjanie poznania',         icon: 'tag_knowledge_development.svg' },
  { id: 'visual',     label: 'Zrakové rozlišovanie',        icon: 'tag_visual_discrimination.svg' },
  { id: 'listening',  label: 'Počúvanie s porozumením',     icon: 'tag_listening_comprehension.svg' },
  { id: 'logical',    label: 'Logické myslenie',            icon: 'tag_logical_thinking.svg' },
  { id: 'numbers',    label: 'Čísla a vzťahy',              icon: 'tag_numbers_relationships.svg' },
  { id: 'orientation',label: 'Orientácia',                  icon: 'tag_orientation.svg' },
  { id: 'vocabulary', label: 'Rozvíjanie slovnej zásoby',   icon: 'tag_vocabulary_expansion.svg' },
];

// Deterministic pseudo-random tag set for a given material id.
function tagsForMaterial(mId) {
  let h = 0;
  for (let i = 0; i < mId.length; i++) h = (h * 31 + mId.charCodeAt(i)) >>> 0;
  const count = 2 + (h % 3); // 2..4 tags
  const used = new Set();
  const out = [];
  let cursor = h;
  while (out.length < count) {
    cursor = (cursor * 1664525 + 1013904223) >>> 0;
    const idx = cursor % TAGS.length;
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(TAGS[idx]);
  }
  return out;
}

function CurricularTagIcon({ tag, size = 28, title }) {
  return (
    <span title={title || tag.label} style={{
      width: size, height: size, borderRadius: 8,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#EAF4FB', flexShrink: 0,
    }}>
      <img src={ASSET(tag.icon)} alt={tag.label} style={{ width: size - 6, height: size - 6, display: 'block' }} />
    </span>
  );
}

Object.assign(window, { TAGS, tagsForMaterial, CurricularTagIcon });

// ─── SVP second-level mapping ─────────────────────────────────────────
// Maps material category / lesson primary SVP area to a stable sub-area
// from SVP_AREAS. Provides values used by ŠVP tags across 1B2, 1B3, 1C, 1D.
const CAT_TO_SVP_SUB = {
  animals:  'Živočíchy',
  nature:   'Vnímanie prírody',
  numbers:  'Čísla a vzťahy',
  colors:   'Výtvarná výchova',
  alphabet: 'Písaná reč',
  transport:'Dopravná výchova',
  food:     'Zdravie a zdravý životný štýl',
  family:   'Ľudia v blízkom a širšom okolí',
  music:    'Hudobná výchova',
  body:     'Hygiena a sebaobslužné činnosti',
};

const SVP_AREA_TO_DEFAULT_SUB = {
  'Jazyk a komunikácia':                  'Hovorená reč',
  'Matematika a práca s informáciami':    'Čísla a vzťahy',
  'Človek a príroda':                     'Vnímanie prírody',
  'Človek a spoločnosť':                  'Orientácia v okolí',
  'Človek a svet práce':                  'Materiály a ich vlastnosti',
  'Umenie a kultúra':                     'Hudobná výchova',
  'Zdravie a pohyb':                      'Zdravie a zdravý životný štýl',
  // Legacy values used in materials/lessons
  'Živá príroda':                         'Živočíchy',
};

function svpSubForMaterial(m) {
  if (!m) return '';
  return CAT_TO_SVP_SUB[m.cat] || SVP_AREA_TO_DEFAULT_SUB[m.svp] || m.svp || '';
}

function svpSubForLesson(l) {
  if (!l) return '';
  return SVP_AREA_TO_DEFAULT_SUB[l.svp] || l.svp || '';
}

Object.assign(window, { svpSubForMaterial, svpSubForLesson, CAT_TO_SVP_SUB, SVP_AREA_TO_DEFAULT_SUB });

Object.assign(window, {
  ASSET, MASCOT, AGE_META, AgeIcon, AgeFilterButton, AgePopover,
  TeacherSidebar, TeacherTopBar, Breadcrumbs, SpeakerButton,
  CATEGORIES, SUBCATS_ANIMALS, MATERIALS, LESSONS, RatingBadge, MaterialTag,
  MaterialTagIcon, TagGlyph,
});
