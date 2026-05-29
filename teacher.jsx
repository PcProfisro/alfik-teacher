/* teacher.jsx — Hi-fi artboards for the teacher portal.
 *   Teacher_1A_Dashboard
 *   Teacher_1B_Library       (top-level grid + drill-down, breadcrumb)
 *   Teacher_1B_LibraryTree   (alt pattern: persistent left tree)
 *   Teacher_1C_Materials     (data-table list with rich filters)
 *
 * All sized to 1440 × 900. Uses primitives from shared.jsx.
 */

// ─── small bits ─────────────────────────────────────────────────────────
function KPICard({ accent, label, value, delta, deltaUp }) {
  return (
    <div style={{
      flex: 1, background: '#fff', borderRadius: 18,
      padding: '20px 22px 18px',
      boxShadow: 'var(--alf-shadow-card)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: accent }} />
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--alf-ink-mute)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 36, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1, letterSpacing: '-.02em' }}>{value}</div>
        {delta && (
          <div style={{ fontSize: 13, fontWeight: 700, color: deltaUp ? '#1E7A5E' : '#A94545', display: 'flex', alignItems: 'center', gap: 3 }}>
            {deltaUp ? '↑' : '↓'} {delta}
          </div>
        )}
      </div>
    </div>
  );
}

// Weekly activity bars — varied heights, primary blue scale.
function ActivityChart({ data }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 220, padding: '0 6px' }}>
      {data.map((d, i) => {
        const h = (d.v / max) * 100;
        const isToday = d.today;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: isToday ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)' }}>{d.v}</div>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${h}%`,
                borderRadius: 10,
                background: isToday
                  ? 'linear-gradient(180deg, var(--alf-sky-deep), var(--alf-sky))'
                  : 'linear-gradient(180deg, #BFE0F4, #DBEEF9)',
              }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: isToday ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)' }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 1A · Teacher dashboard ─────────────────────────────────────────────
function Teacher_1A_Dashboard({ age = 'all', onAgeChange }) {
  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="dashboard" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar
          title="Dobrý deň, Janka"
          subtitle="Piatok 7. marec · MŠ Slniečko · trieda Mravce (18 detí)"
          search={false}
          hideAge
        />

        <div style={{ flex: 1, padding: '24px 36px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Hero strip with mascot — surprise element */}
          <section style={{
            position: 'relative', borderRadius: 22, padding: '22px 28px',
            background: 'linear-gradient(120deg, #DBEEF9 0%, #D9F8EF 100%)',
            display: 'flex', alignItems: 'center', gap: 28, overflow: 'hidden', minHeight: 130,
          }}>
            <img src={MASCOT} alt="" style={{ height: 170, marginTop: -10, marginLeft: -8, alignSelf: 'flex-end' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--alf-sky-ink)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Týždenné zhrnutie</div>
              <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--alf-ink)', marginTop: 4, lineHeight: 1.25, maxWidth: 520 }}>
                Tento týždeň deti dokončili <span style={{ color: 'var(--alf-sky-deep)' }}>121 cvičení</span> — najlepší týždeň v tomto mesiaci. <span style={{ color: 'var(--alf-mint-deep)' }}>3 deti</span> dosiahli nové medaile.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="alf-btn">Pozri reporty →</button>
            </div>
            {/* decorative cloud */}
            <svg viewBox="0 0 100 60" style={{ position: 'absolute', top: 14, right: 60, width: 90, opacity: .5 }}>
              <path d="M20 40c-8 0-12-6-12-12 0-7 6-12 13-12 2-7 9-12 16-12 9 0 17 7 17 16 8 0 13 5 13 12s-5 8-13 8z" fill="#fff" />
            </svg>
          </section>

          {/* KPI row */}
          <section style={{ display: 'flex', gap: 14 }}>
            <KPICard accent="var(--alf-sky-deep)" label="Aktívne deti dnes" value="14/18" delta="+2"  deltaUp />
            <KPICard accent="var(--alf-mint)"     label="Cvičení dnes"      value="42"    delta="+18%" deltaUp />
            <KPICard accent="var(--alf-sun-deep)" label="Priemerné hodnotenie" value="★ 4,6" />
            <KPICard accent="var(--alf-coral)"    label="Materiálov priradených" value="9" delta="3 nové" deltaUp />
          </section>

          {/* Moje posledné aktivity — prvé 3 riadky z 1D */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--alf-font-display)', fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--alf-ink)' }}>Moje posledné aktivity</h2>
            <HistoryTable entries={HISTORY.slice(0, 3)} />
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── Category tile (teacher view) ───────────────────────────────────────
function TeacherCategoryTile({ cat, drillIn }) {
  return (
    <button onClick={drillIn} style={{
      background: 'var(--alf-sky-bg)', borderRadius: 22, padding: 16, border: 'none',
      cursor: 'pointer', textAlign: 'left', position: 'relative',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: 'var(--alf-shadow-tile)', transition: 'transform .12s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, height: 110,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={ASSET(cat.icon)} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
      </div>
      <SpeakerButton size={32} />
      <div style={{ position: 'absolute', top: 22, right: 22 }}>
        <SpeakerButton size={32} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 17, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.15 }}>{cat.name}</div>
        <div style={{ fontSize: 12, color: 'var(--alf-sky-ink)', marginTop: 3 }}>{cat.materials} materiálov</div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
        {cat.ages.map((a) => {
          const m = AGE_META[a];
          return <span key={a} style={{ width: 18, height: 18, borderRadius: 99, background: m.color, opacity: .9 }} />;
        })}
      </div>
    </button>
  );
}

// Fix double speaker button — remove the misplaced one.
const _origTile = TeacherCategoryTile;
function TeacherCategoryTileFixed({ cat, drillIn }) {
  return (
    <div role="button" tabIndex={0} onClick={drillIn} style={{
      background: 'var(--alf-sky-bg)', borderRadius: 22, padding: 16,
      cursor: 'pointer', textAlign: 'left', position: 'relative',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: 'var(--alf-shadow-tile)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, height: 110, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={ASSET(cat.icon)} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <SpeakerButton size={32} />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 17, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.15 }}>{cat.name}</div>
        <div style={{ fontSize: 12, color: 'var(--alf-sky-ink)', marginTop: 3 }}>{cat.materials} materiálov</div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {cat.ages.map((a) => {
          const m = AGE_META[a];
          return <span key={a} style={{ width: 16, height: 16, borderRadius: 99, background: m.color, opacity: .85 }} title={m.label} />;
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', alignSelf: 'center' }}>otvoriť →</span>
      </div>
    </div>
  );
}

// ─── 1B · Library — top-level grid (with breadcrumb pattern) ────────────
function Teacher_1B_Library({ age = 'all', onAgeChange }) {
  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="library" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar
          title="Knižnica kategórií"
          subtitle="10 tematických oblastí · 151 učebných materiálov"
          ageValue={age} onAgeChange={onAgeChange}
          breadcrumbs={<Breadcrumbs items={['Domov', 'Knižnica']} />}
        />
        <div style={{ flex: 1, padding: '20px 36px 28px', overflow: 'auto' }}>
          {/* age filter chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--alf-ink-mute)', letterSpacing: '.06em', textTransform: 'uppercase', marginRight: 4 }}>Vek</span>
            {['all', '3', '4', '5'].map((a) => {
              const m = AGE_META[a];
              const isActive = age === a;
              return (
                <button key={a} onClick={() => onAgeChange?.(a)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px 8px 8px', borderRadius: 99,
                  background: isActive ? m.color : '#fff',
                  border: `1.5px solid ${isActive ? m.color : 'var(--alf-line)'}`,
                  color: isActive ? '#fff' : 'var(--alf-ink)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 99,
                    background: isActive ? 'rgba(255,255,255,.25)' : m.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><AgeIcon age={a} size={18} /></span>
                  {m.label}
                </button>
              );
            })}
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--alf-ink-soft)' }}>Zobraziť: <strong>karty</strong> · zoznam</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {CATEGORIES.map((c) => <TeacherCategoryTileFixed key={c.id} cat={c} />)}
          </div>

          <div style={{ marginTop: 22, padding: '14px 18px', background: '#fff', borderRadius: 14, border: '1px dashed var(--alf-line)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--alf-ink-soft)' }}>
            <span style={{ width: 24, height: 24, borderRadius: 99, background: 'var(--alf-sun-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--alf-sun-deep)', fontWeight: 800 }}>i</span>
            Kliknutím na kategóriu sa otvorí mriežka podkategórií. Breadcrumb hore vás vždy zorientuje.
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── 1B-Tree · Drilled-into "Zvieratá", alternate pattern w/ left tree ──
function Teacher_1B_LibraryTree({ age = 'all', onAgeChange }) {
  const tree = [
    { id: 'animals', name: 'Zvieratá', open: true, materials: 28 },
    { id: 'nature',  name: 'Príroda',  materials: 22 },
    { id: 'numbers', name: 'Čísla',    materials: 18 },
    { id: 'colors',  name: 'Farby',    materials: 12 },
    { id: 'alphabet',name: 'Abeceda',  materials: 16 },
  ];
  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="library" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar
          title="Domáce zvieratá"
          subtitle="8 učebných materiálov · podkategória Zvierat"
          ageValue={age} onAgeChange={onAgeChange}
          breadcrumbs={<Breadcrumbs items={['Domov', 'Knižnica', 'Zvieratá', 'Domáce zvieratá']} />}
        />
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Tree column */}
          <div style={{ width: 268, borderRight: '1px solid var(--alf-line)', padding: '16px 14px', background: '#FAFBFD', overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--alf-ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 10px 8px' }}>Kategórie</div>
            {tree.map((t) => (
              <div key={t.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px',
                  borderRadius: 10, fontSize: 14, fontWeight: 700,
                  color: t.open ? 'var(--alf-sky-deep)' : 'var(--alf-ink)',
                  background: t.open ? 'var(--alf-sky-bg)' : 'transparent', cursor: 'pointer',
                }}>
                  <span style={{ width: 14, color: 'var(--alf-ink-mute)', fontWeight: 800 }}>{t.open ? '▾' : '▸'}</span>
                  <img src={ASSET(CATEGORIES.find(c => c.id === t.id)?.icon || 'icon_smile.png')} alt="" style={{ width: 22, height: 22 }} />
                  <span style={{ flex: 1 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', fontWeight: 600 }}>{t.materials}</span>
                </div>
                {t.open && (
                  <div style={{ paddingLeft: 30, display: 'flex', flexDirection: 'column' }}>
                    {SUBCATS_ANIMALS.map((sc, i) => (
                      <div key={sc.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                        borderRadius: 8, fontSize: 13, fontWeight: i === 0 ? 700 : 500,
                        color: i === 0 ? 'var(--alf-ink)' : 'var(--alf-ink-soft)',
                        background: i === 0 ? '#fff' : 'transparent',
                        boxShadow: i === 0 ? 'inset 2px 0 0 var(--alf-sky-deep)' : 'none',
                        cursor: 'pointer',
                      }}>
                        <span>{sc.name}</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)' }}>{sc.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: subcategory grid */}
          <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
            <div style={{
              borderRadius: 22, padding: '20px 24px', marginBottom: 20,
              background: 'linear-gradient(135deg, var(--alf-hero-from), var(--alf-hero-to))',
              color: '#fff', display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ width: 84, height: 84, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={ASSET('icon_animals.png')} alt="" style={{ width: 64, height: 64 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: .8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Kategória · Zvieratá</div>
                <div style={{ fontFamily: 'var(--alf-font-display)', fontSize: 26, fontWeight: 700, marginTop: 2 }}>Domáce zvieratá</div>
                <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>8 materiálov · pre vek 3–6 rokov · 4 deti to už zvládli</div>
              </div>
              <SpeakerButton size={44} ringColor="#fff" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {MATERIALS.filter(m => m.cat === 'animals').concat(MATERIALS.slice(0, 4)).slice(0, 8).map((m, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 18, padding: 14,
                  boxShadow: 'var(--alf-shadow-card)', position: 'relative',
                }}>
                  <div style={{
                    height: 90, borderRadius: 12,
                    background: `linear-gradient(135deg, ${['var(--alf-sky-bg)', 'var(--alf-mint-bg)', 'var(--alf-sun-bg)', 'var(--alf-orange-bg)'][i % 4]}, #fff)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                    position: 'relative',
                  }}>
                    <img src={ASSET(CATEGORIES.find(c => c.id === m.cat)?.icon || 'icon_smile.png')} alt="" style={{ width: 56, height: 56 }} />
                    <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', gap: 4 }}>
                      {m.tags.slice(0, 1).map(t => <MaterialTag key={t} kind={t} />)}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.25 }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12, color: 'var(--alf-ink-mute)' }}>
                    <AgeIcon age={m.ages[0]} size={18} />
                    <span>{m.duration}</span>
                    <span style={{ flex: 1 }} />
                    {m.rating && <RatingBadge rating={m.rating} size={26} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Category dropdown — re-uses the 1B-alt tree as the opened menu content.
// Hover on the button shows the full breadcrumb path.
const CAT_PATHS = {
  'Domáce zvieratá':  ['Zvieratá', 'Domáce zvieratá'],
  'Lesné zvieratá':   ['Zvieratá', 'Lesné zvieratá'],
  'ZOO zvieratá':     ['Zvieratá', 'ZOO zvieratá'],
  'Vtáky':            ['Zvieratá', 'Vtáky'],
  'Ryby a more':      ['Zvieratá', 'Ryby a more'],
  'Hmyz':             ['Zvieratá', 'Hmyz'],
  'Živá príroda':     ['Človek a príroda', 'Živá príroda'],
  'Čísla':            ['Matematika', 'Čísla'],
  'Hudba':            ['Umenie a kultúra', 'Hudba'],
  'Doprava':          ['Človek a spoločnosť', 'Doprava'],
  'Farby':            ['Umenie a kultúra', 'Farby'],
};

// SVP educational programme tree.
const SVP_TREE = [
  { id: 'lang',    name: 'Jazyk a komunikácia',                materials: 24 },
  { id: 'math',    name: 'Matematika a práca s informáciami',  materials: 18 },
  { id: 'priroda', name: 'Človek a príroda',                   materials: 22 },
  { id: 'spol',    name: 'Človek a spoločnosť', open: true,    materials: 15 },
  { id: 'praca',   name: 'Človek a svet práce',                materials: 10 },
  { id: 'umenie',  name: 'Umenie a kultúra',                   materials: 16 },
  { id: 'zdravie', name: 'Zdravie a pohyb',                    materials: 12 },
];
const SVP_SUBS_SPOL = [
  { id: 'cas',    name: 'Orientácia v čase',     count: 4 },
  { id: 'geo',    name: 'Geografia okolia',      count: 3 },
  { id: 'dopr',   name: 'Dopravná výchova',      count: 5 },
  { id: 'info',   name: 'Práca s informáciami',  count: 2 },
  { id: 'narod',  name: 'Národné povedomie',     count: 1 },
];

function CategoryDropdown({ selected, open, kind = 'temy' }) {
  const isSvp = kind === 'svp';
  const tree = isSvp ? SVP_TREE : [
    { id: 'animals',  name: 'Zvieratá', open: true, materials: 28 },
    { id: 'nature',   name: 'Príroda',  materials: 22 },
    { id: 'numbers',  name: 'Čísla',    materials: 18 },
    { id: 'colors',   name: 'Farby',    materials: 12 },
    { id: 'alphabet', name: 'Abeceda',  materials: 16 },
    { id: 'transport',name: 'Doprava',  materials: 14 },
  ];
  const subs = isSvp ? SVP_SUBS_SPOL : SUBCATS_ANIMALS;
  const activeSub = isSvp ? 'cas' : 'farm';
  const title = isSvp ? 'Štátny vzdelávací program' : 'Kategórie';
  const prefix = isSvp ? 'ŠVP:' : 'Téma:';
  return (
    <div style={{ position: 'relative' }}>
      <button className="alf-btn-pill" style={{
        background: open ? 'var(--alf-sky-bg)' : '#fff',
        borderColor: open ? 'var(--alf-sky-deep)' : 'var(--alf-line)',
        color: 'var(--alf-ink)',
      }}>
        <span style={{ color: 'var(--alf-ink-mute)', fontWeight: 600 }}>{prefix}</span>
        <strong style={{ color: 'var(--alf-sky-deep)' }}>{selected}</strong>
        <span style={{ color: 'var(--alf-ink-mute)', marginLeft: 2, fontSize: 11 }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: 320,
          background: '#fff', borderRadius: 14, padding: '10px 8px',
          boxShadow: 'var(--alf-shadow-popover)', zIndex: 30,
          border: '1px solid var(--alf-line)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--alf-ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>{title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--alf-ink-soft)', cursor: 'pointer',
          }}>
            <span style={{ width: 14, color: 'var(--alf-ink-mute)' }}>○</span>
            <span style={{ flex: 1 }}>Všetky kategórie</span>
            <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)' }}>151</span>
          </div>
          <div style={{ height: 1, background: 'var(--alf-line)', margin: '4px 4px 4px' }} />
          {tree.map((t) => (
            <div key={t.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px',
                borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                color: t.open ? 'var(--alf-sky-deep)' : 'var(--alf-ink)',
                background: t.open ? 'var(--alf-sky-bg)' : 'transparent', cursor: 'pointer',
              }}>
                <span style={{ width: 12, color: 'var(--alf-ink-mute)', fontWeight: 800, fontSize: 11 }}>{t.open ? '▾' : '▸'}</span>
                {isSvp ? null : (
                  <img src={ASSET(CATEGORIES.find(c => c.id === t.id)?.icon || 'icon_smile.png')} alt="" style={{ width: 20, height: 20 }} />
                )}
                <span style={{ flex: 1 }}>{t.name}</span>
                <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', fontWeight: 600 }}>{t.materials}</span>
              </div>
              {t.open && (
                <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column' }}>
                  {subs.map((sc) => {
                    const isActive = sc.id === activeSub;
                    return (
                      <div key={sc.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                        borderRadius: 8, fontSize: 12.5,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--alf-ink)' : 'var(--alf-ink-soft)',
                        background: isActive ? 'var(--alf-sky-bg)' : 'transparent',
                        boxShadow: isActive ? 'inset 2px 0 0 var(--alf-sky-deep)' : 'none',
                        cursor: 'pointer',
                      }}>
                        {isActive && <span style={{ color: 'var(--alf-sky-deep)', fontWeight: 800 }}>✓</span>}
                        <span style={{ flex: 1, paddingLeft: isActive ? 0 : 16 }}>{sc.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)' }}>{sc.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── New material modal ─────────────────────────────────────────────────
function NewMaterialModal({ open, onClose, material }) {
  const isEdit = !!material;
  const [name, setName] = React.useState(material?.name || '');
  const [filename, setFilename] = React.useState(material ? `${material.name.toLowerCase().replace(/\s+/g, '_')}.${({videá:'mp4',pesničky:'mp3',testy:'pdf',maľovanky:'png',grafomotorika:'pdf'})[material.tags?.[0]] || 'pdf'}` : null);
  const [age, setAge] = React.useState(material?.ages?.[0] || '4');
  const [catOpen, setCatOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(material?.path?.[1] || material?.category || 'Domáce zvieratá');
  const [svpOpen, setSvpOpen] = React.useState(false);
  const [svp, setSvp] = React.useState(material?.svp || 'Živá príroda');
  const [skills, setSkills] = React.useState(() => new Set(['knowledge', 'visual']));
  const [skillsOpen, setSkillsOpen] = React.useState(false);
  const [skillSearch, setSkillSearch] = React.useState('');
  const skillsRef = React.useRef(null);
  React.useEffect(() => {
    if (!skillsOpen) return;
    const h = (e) => { if (skillsRef.current && !skillsRef.current.contains(e.target)) setSkillsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [skillsOpen]);
  const [kind, setKind] = React.useState((() => {
    const t = material?.tags?.[0];
    return { 'testy':'Dokument','pesničky':'Pesnička','videá':'Video','maľovanky':'Maľovanka','grafomotorika':'Grafomotorika' }[t] || 'Video';
  })());
  const fileRef = React.useRef(null);

  if (!open) return null;

  const inputCss = {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid var(--alf-line)',
    background: '#fff', color: 'var(--alf-ink)',
    fontFamily: 'var(--alf-font-body)', fontSize: 14, fontWeight: 500,
    outline: 'none',
  };

  const Field = ({ label, required, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--alf-ink)', letterSpacing: '.02em' }}>
        {label}{required && <span style={{ color: 'var(--alf-coral)', marginLeft: 4 }}>*</span>}
      </span>
      {children}
    </div>
  );

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
        <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--alf-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-sky-deep)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Učebný materiál</div>
            <h2 style={{ fontFamily: 'var(--alf-font-body)', fontSize: 22, fontWeight: 800, color: 'var(--alf-ink)', margin: '4px 0 0', letterSpacing: '-.01em' }}>{isEdit ? 'Upraviť materiál' : 'Nový materiál'}</h2>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--alf-line)',
            background: '#fff', color: 'var(--alf-ink-soft)', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <div style={{ padding: '20px 28px 8px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Názov súboru" required>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="napr. Spoznaj zvieratá na farme" style={inputCss} />
          </Field>

          <Field label="Súbor" required>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 14,
              border: `1.5px dashed ${filename ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)'}`,
              background: filename ? 'var(--alf-sky-bg)' : '#FAFBFD',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: filename ? '#fff' : 'var(--alf-bg)',
                color: filename ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {filename || 'Zatiaľ nebol vybraný žiadny súbor'}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--alf-ink-mute)', marginTop: 3 }}>
                  Podporované: MP4, MP3, PDF, PNG, JPG · max 50 MB
                </div>
              </div>
              <input ref={fileRef} type="file" hidden onChange={(e) => setFilename(e.target.files?.[0]?.name || null)} />
              <button onClick={() => fileRef.current?.click()} className="alf-btn" style={{ flexShrink: 0 }}>
                {filename ? 'Zmeniť' : 'Vybrať súbor'}
              </button>
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

          <Field label="Typ">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'Dokument',      tag: 'testy' },
                { id: 'Pesnička',      tag: 'pesničky' },
                { id: 'Video',         tag: 'videá' },
                { id: 'Maľovanka',     tag: 'maľovanky' },
                { id: 'Grafomotorika', tag: 'grafomotorika' },
              ].map((k) => {
                const active = kind === k.id;
                return (
                  <button key={k.id} onClick={() => setKind(k.id)} style={{
                    flex: '1 1 auto', padding: '8px 12px', borderRadius: 12,
                    border: `1.5px solid ${active ? 'var(--alf-sky-deep)' : 'var(--alf-line)'}`,
                    background: active ? 'var(--alf-sky-bg)' : '#fff',
                    color: active ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  }}>
                    <MaterialTagIcon kind={k.tag} size={24} />
                    {k.id}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Téma">
            <div onClick={() => setCatOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <CategoryDropdown selected={theme} open={catOpen} />
            </div>
          </Field>

          <Field label="Štátny vzdelávací program">
            <div onClick={() => setSvpOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <CategoryDropdown selected={svp} open={svpOpen} />
            </div>
          </Field>

          <Field label="Zručnosti">
            <div ref={skillsRef} style={{ position: 'relative' }}>
              <button onClick={() => setSkillsOpen(o => !o)} style={{
                ...inputCss,
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                minHeight: 44, padding: '8px 12px',
              }}>
                {skills.size === 0 ? (
                  <span style={{ color: 'var(--alf-ink-mute)', fontWeight: 500 }}>Vyber zručnosti...</span>
                ) : (
                  [...skills].map((id) => {
                    const t = TAGS.find(x => x.id === id);
                    if (!t) return null;
                    return (
                      <span key={id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 8px 4px 6px', borderRadius: 99,
                        background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        <CurricularTagIcon tag={t} size={22} />
                        {t.label}
                        <span onClick={(e) => {
                          e.stopPropagation();
                          setSkills(prev => { const n = new Set(prev); n.delete(id); return n; });
                        }} style={{
                          width: 16, height: 16, borderRadius: 99,
                          background: 'rgba(0,0,0,.08)', color: 'var(--alf-ink-soft)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, marginLeft: 2,
                        }}>×</span>
                      </span>
                    );
                  })
                )}
                <span style={{ marginLeft: 'auto', color: 'var(--alf-ink-mute)', fontSize: 11 }}>{skillsOpen ? '▴' : '▾'}</span>
              </button>
              {skillsOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 14px 36px -10px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
                  zIndex: 50, overflow: 'hidden',
                }}>
                  <div style={{ padding: 12, borderBottom: '1px solid var(--alf-line)' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      background: '#fff', border: '1.5px solid var(--alf-line)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                      <input
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Vyhľadať zručnosť..."
                        autoFocus
                        style={{
                          flex: 1, minWidth: 0, border: 'none', outline: 'none',
                          background: 'transparent', fontSize: 14, color: 'var(--alf-ink)',
                          fontFamily: 'var(--alf-font-body)',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                    {(() => {
                      const q = skillSearch.trim().toLowerCase();
                      const list = TAGS.filter(t => !q || t.label.toLowerCase().includes(q));
                      if (list.length === 0) {
                        return <div style={{ padding: '18px 14px', fontSize: 13, color: 'var(--alf-ink-mute)', fontStyle: 'italic', textAlign: 'center' }}>Žiadne zručnosti.</div>;
                      }
                      return list.map((t) => {
                        const checked = skills.has(t.id);
                        return (
                          <div key={t.id} onClick={() => {
                            setSkills(prev => {
                              const n = new Set(prev);
                              n.has(t.id) ? n.delete(t.id) : n.add(t.id);
                              return n;
                            });
                          }} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 14px', cursor: 'pointer',
                            background: checked ? 'rgba(46, 184, 146, .08)' : 'transparent',
                            borderBottom: '1px solid var(--alf-line)',
                          }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: 6,
                              background: checked ? '#1E7A5E' : '#fff',
                              border: checked ? 'none' : '1.5px solid var(--alf-ink-mute)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
                            </span>
                            <CurricularTagIcon tag={t} size={26} />
                            <span style={{ fontSize: 14, color: 'var(--alf-ink)', fontWeight: 600 }}>{t.label}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          </Field>
        </div>

        <div style={{ padding: '14px 28px 18px', borderTop: '1px solid var(--alf-line)', background: '#FAFBFD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--alf-ink-mute)' }}>{isEdit ? 'Zmeny sa uložia do knižnice.' : 'Po nahratí materiál priradíš k hodinám.'}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="alf-btn">Zrušiť</button>
            <button onClick={onClose} className="alf-btn is-active">{isEdit ? 'Uložiť zmeny' : 'Nahrať materiál'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete material confirmation (1B) ─────────────────────────────────
function DeleteMaterialModalB({ material, onClose }) {
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
              Materiál bude trvalo odstránený z knižnice učebných materiálov aj zo všetkých hodín, kde je priradený. Túto akciu nie je možné vrátiť späť.
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

// ─── Theme tree panel (1B1) — full tree shown next to sidebar ──────────
// SVP educational areas tree (per Štátny vzdelávací program for materské školy).
const SVP_AREAS = [
  { id: 'jazyk', name: 'Jazyk a komunikácia', materials: 24, subs: [
    { id: 'jaz-hov', name: 'Hovorená reč',  count: 12 },
    { id: 'jaz-pis', name: 'Písaná reč',    count: 12 },
  ] },
  { id: 'mat', name: 'Matematika a práca s informáciami', materials: 18, subs: [
    { id: 'mat-cisla',   name: 'Čísla a vzťahy',     count: 6 },
    { id: 'mat-geo',     name: 'Geometria a meranie', count: 4 },
    { id: 'mat-logika',  name: 'Logika',             count: 4 },
    { id: 'mat-info',    name: 'Práca s informáciami', count: 4 },
  ] },
  { id: 'priroda', name: 'Človek a príroda', materials: 22, subs: [
    { id: 'pri-vnim',  name: 'Vnímanie prírody',  count: 3 },
    { id: 'pri-rast',  name: 'Rastliny',          count: 4 },
    { id: 'pri-ziv',   name: 'Živočíchy',         count: 5 },
    { id: 'pri-clov',  name: 'Človek',            count: 3 },
    { id: 'pri-neziv', name: 'Neživá príroda',    count: 3 },
    { id: 'pri-jav',   name: 'Prírodné javy',     count: 4 },
  ] },
  { id: 'spol', name: 'Človek a spoločnosť', materials: 15, subs: [
    { id: 'spol-cas',    name: 'Orientácia v čase',           count: 2 },
    { id: 'spol-okolie', name: 'Orientácia v okolí',          count: 2 },
    { id: 'spol-dopr',   name: 'Dopravná výchova',            count: 3 },
    { id: 'spol-geo',    name: 'Geografia okolia',            count: 2 },
    { id: 'spol-hist',   name: 'História okolia',             count: 1 },
    { id: 'spol-narod',  name: 'Národné povedomie',           count: 1 },
    { id: 'spol-ludia',  name: 'Ľudia v blízkom a širšom okolí', count: 2 },
    { id: 'spol-etik',   name: 'Základy etikety',             count: 1 },
    { id: 'spol-emoc',   name: 'Ľudské vlastnosti a emócie',  count: 1 },
  ] },
  { id: 'praca', name: 'Človek a svet práce', materials: 10, subs: [
    { id: 'pr-mat',   name: 'Materiály a ich vlastnosti', count: 2 },
    { id: 'pr-konst', name: 'Konštruovanie',              count: 2 },
    { id: 'pr-uziv',  name: 'Užívateľské zručnosti',      count: 2 },
    { id: 'pr-tech',  name: 'Technológie výroby',         count: 2 },
    { id: 'pr-prof',  name: 'Remeslá a profesie',         count: 2 },
  ] },
  { id: 'umenie', name: 'Umenie a kultúra', materials: 16, subs: [
    { id: 'um-hud', name: 'Hudobná výchova',   count: 8 },
    { id: 'um-vyt', name: 'Výtvarná výchova',  count: 8 },
  ] },
  { id: 'zdravie', name: 'Zdravie a pohyb', materials: 12, subs: [
    { id: 'zdr-zsz',   name: 'Zdravie a zdravý životný štýl', count: 4 },
    { id: 'zdr-hyg',   name: 'Hygiena a sebaobslužné činnosti', count: 3 },
    { id: 'zdr-poh',   name: 'Pohyb a telesná zdatnosť',     count: 5 },
  ] },
];

function ThemeTreePanel({ selected, onSelect, header, empty = false, mode = 'temy' }) {
  const themesTree = [
    { id: 'animals',  name: 'Zvieratá', materials: 28, subs: SUBCATS_ANIMALS },
    { id: 'nature',   name: 'Príroda',  materials: 22, subs: [
      { id: 'trees',   name: 'Stromy',           count: 5 },
      { id: 'flowers', name: 'Kvety',            count: 4 },
      { id: 'weather', name: 'Počasie',          count: 7 },
      { id: 'seasons', name: 'Ročné obdobia',    count: 6 },
    ] },
    { id: 'numbers',  name: 'Čísla',    materials: 18, subs: [
      { id: 'count5',  name: 'Počítanie do 5',   count: 6 },
      { id: 'count10', name: 'Počítanie do 10',  count: 5 },
      { id: 'shapes',  name: 'Tvary',            count: 4 },
      { id: 'compare', name: 'Porovnávanie',     count: 3 },
    ] },
    { id: 'colors',   name: 'Farby',    materials: 12, subs: [
      { id: 'basic',   name: 'Základné farby',   count: 7 },
      { id: 'mixing',  name: 'Miešanie farieb',  count: 5 },
    ] },
    { id: 'alphabet', name: 'Abeceda',  materials: 16, subs: [
      { id: 'letters', name: 'Písmená',          count: 10 },
      { id: 'words',   name: 'Prvé slová',       count: 6 },
    ] },
    { id: 'transport',name: 'Doprava',  materials: 14, subs: [
      { id: 'vehicles', name: 'Vozidlá',         count: 6 },
      { id: 'traffic',  name: 'Pravidlá cestnej premávky', count: 5 },
      { id: 'signs',    name: 'Dopravné značky', count: 3 },
    ] },
    { id: 'food',     name: 'Jedlo',         materials: 11, subs: [
      { id: 'fruit',   name: 'Ovocie',           count: 4 },
      { id: 'veggies', name: 'Zelenina',         count: 4 },
      { id: 'meals',   name: 'Jedlá',            count: 3 },
    ] },
    { id: 'family',   name: 'Rodina',        materials: 9, subs: [
      { id: 'parents', name: 'Rodičia',          count: 3 },
      { id: 'siblings',name: 'Súrodenci',        count: 3 },
      { id: 'grand',   name: 'Starí rodičia',    count: 3 },
    ] },
    { id: 'music',    name: 'Hudba',         materials: 8, subs: [
      { id: 'instr',   name: 'Nástroje',         count: 4 },
      { id: 'rhythm',  name: 'Rytmus',           count: 2 },
      { id: 'songs',   name: 'Piesne',           count: 2 },
    ] },
    { id: 'body',     name: 'Telo a zdravie',materials: 13, subs: [
      { id: 'parts',   name: 'Časti tela',       count: 6 },
      { id: 'hygiene', name: 'Hygiena',          count: 4 },
      { id: 'senses',  name: 'Zmysly',           count: 3 },
    ] },
  ];

  const tree = mode === 'svp' ? SVP_AREAS : themesTree;
  const [open, setOpen] = React.useState(() => new Set([mode === 'svp' ? 'jazyk' : 'animals']));
  React.useEffect(() => {
    setOpen(new Set([mode === 'svp' ? 'jazyk' : 'animals']));
  }, [mode]);
  const toggle = (id) => setOpen(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: '#fff', borderRight: '1px solid var(--alf-line)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--alf-line)' }}>
        {header || (
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Kategórie</div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
        {empty ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--alf-ink-mute)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.5 }}>
            Strom tém sa pri zobrazení vlastných materiálov nepoužíva.
          </div>
        ) : (
        <>
        <button onClick={() => onSelect?.(null)} style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
          borderRadius: 10, background: !selected ? 'var(--alf-sky-bg)' : 'transparent',
          border: 'none', cursor: 'pointer',
          fontSize: 13.5, fontWeight: 700, color: !selected ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
        }}>
          <span style={{ width: 12 }}>○</span>
          <span style={{ flex: 1 }}>Všetky kategórie</span>
          <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', fontWeight: 600 }}>151</span>
        </button>

        <div style={{ height: 1, background: 'var(--alf-line)', margin: '6px 4px' }} />

        {tree.map((t) => {
          const isOpen = open.has(t.id);
          const hasSelectedChild = t.subs.some(s => s.id === selected);
          return (
            <div key={t.id}>
              <button onClick={() => toggle(t.id)} style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                borderRadius: 10, background: hasSelectedChild ? 'var(--alf-sky-bg)' : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 700, color: 'var(--alf-ink)',
              }}>
                <span style={{ width: 12, color: 'var(--alf-ink-mute)', fontWeight: 800, fontSize: 11 }}>{isOpen ? '▾' : '▸'}</span>
                <span style={{ flex: 1 }}>{t.name}</span>
                <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', fontWeight: 600 }}>{t.materials}</span>
              </button>
              {isOpen && (
                <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', paddingBottom: 4 }}>
                  {t.subs.map((sc) => {
                    const isActive = sc.id === selected;
                    return (
                      <button key={sc.id} onClick={() => onSelect?.(sc.id)} style={{
                        textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                        borderRadius: 8, fontSize: 12.5,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--alf-ink)' : 'var(--alf-ink-soft)',
                        background: isActive ? 'var(--alf-sky-bg)' : 'transparent',
                        boxShadow: isActive ? 'inset 2px 0 0 var(--alf-sky-deep)' : 'none',
                        border: 'none', cursor: 'pointer',
                      }}>
                        <span style={{ flex: 1 }}>{sc.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)' }}>{sc.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </>
        )}
      </div>
    </aside>
  );
}

// ─── 1C · Materials data list ───────────────────────────────────────────
function Teacher_1C_Materials({ age = 'all', onAgeChange, view = 'temy' }) {
  const [tag, setTag] = React.useState('all');
  const [selectedSub, setSelectedSub] = React.useState(view === 'svp' ? null : 'farm');
  const [catOpen, setCatOpen] = React.useState(true); // shown open by default
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [tagFilter, setTagFilter] = React.useState(() => new Set(['knowledge', 'visual']));
  const [tagSearch, setTagSearch] = React.useState('');
  const [scope, setScope] = React.useState('temy');   // 'temy' | 'svp'
  const [matModalOpen, setMatModalOpen] = React.useState(false);
  const tagsRef = React.useRef(null);
  React.useEffect(() => {
    if (!tagsOpen) return;
    const h = (e) => { if (tagsRef.current && !tagsRef.current.contains(e.target)) setTagsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [tagsOpen]);
  const tags = [
    { id: 'all',           label: 'Všetky' },
    { id: 'testy',         label: 'Testy' },
    { id: 'pesničky',      label: 'Pesničky' },
    { id: 'videá',         label: 'Videá' },
    { id: 'maľovanky',     label: 'Maľovanky' },
    { id: 'grafomotorika', label: 'Grafomotorika' },
  ];
  const filtered = MATERIALS.filter(m => {
    if (tag !== 'all' && !m.tags.includes(tag)) return false;
    if (age !== 'all' && !m.ages.includes(age)) return false;
    if (view === 'mine' && !m.mine) return false;
    return true;
  });
  const ageLabel = age === 'all' ? 'Všetky' : AGE_META[age].label;

  // Témy / ŠVP segmented control — replaces the age tile in the topbar.
  const scopeToggle = (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--alf-bg)', borderRadius: 99, border: '1px solid var(--alf-line)' }}>
      {[
        { id: 'temy', label: 'Témy' },
        { id: 'svp',  label: 'ŠVP' },
      ].map((s) => (
        <button key={s.id} onClick={() => setScope(s.id)} style={{
          padding: '8px 18px', borderRadius: 99, border: 'none',
          background: scope === s.id ? '#fff' : 'transparent',
          color: scope === s.id ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)',
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
          boxShadow: scope === s.id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
        }}>{s.label}</button>
      ))}
    </div>
  );

  return (
    <div className="alf-root" style={{ display: 'flex' }}>
      <TeacherSidebar active="materials" materialsSub={view} />
      {(view === 'temy' || view === 'svp') && <ThemeTreePanel selected={selectedSub} onSelect={setSelectedSub} mode={view} />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TeacherTopBar
          title={view === 'mine' ? 'Moje materiály' : view === 'svp' ? 'Učebné materiály · ŠVP' : 'Učebné materiály'}
          hideAge
          search={false}
        >
          {view === 'mine' && <button onClick={() => setMatModalOpen(true)} className="alf-btn is-active">+ Nový materiál</button>}
        </TeacherTopBar>

        <div style={{ flex: 1, padding: '20px 36px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* filters strip — Vek · Zručnosti filter · Hľadať */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <AgeFilterPill value={age} onChange={onAgeChange} />

            {/* Zručnosti multi-select dropdown */}
            <div ref={tagsRef} style={{ position: 'relative' }}>
              <button onClick={() => setTagsOpen(o => !o)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12,
                background: '#fff', border: '1.5px solid var(--alf-line)',
                color: 'var(--alf-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--alf-font-body)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span>Zručnosti</span>
                {tagFilter.size > 0 && (
                  <span style={{
                    padding: '2px 7px', borderRadius: 99,
                    background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)',
                    fontSize: 11, fontWeight: 800,
                  }}>{tagFilter.size}</span>
                )}
                <span style={{ color: 'var(--alf-ink-mute)', fontSize: 10 }}>{tagsOpen ? '▴' : '▾'}</span>
              </button>
              {tagsOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                  width: 340, background: '#fff', borderRadius: 14,
                  boxShadow: '0 14px 36px -10px rgba(15,30,55,.25), 0 0 0 1px var(--alf-line)',
                  zIndex: 50, overflow: 'hidden',
                }}>
                  {/* search */}
                  <div style={{ padding: 12, borderBottom: '1px solid var(--alf-line)' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      background: '#fff', border: '1.5px solid var(--alf-line)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                      <input
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        placeholder="Vyhľadať zručnosť..."
                        autoFocus
                        style={{
                          flex: 1, minWidth: 0, border: 'none', outline: 'none',
                          background: 'transparent', fontSize: 14, color: 'var(--alf-ink)',
                          fontFamily: 'var(--alf-font-body)',
                        }}
                      />
                      {tagSearch && (
                        <button onClick={() => setTagSearch('')} title="Vymazať"
                          style={{
                            width: 18, height: 18, borderRadius: 99, border: 'none',
                            background: 'var(--alf-ink-mute)', color: '#fff',
                            cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>×</button>
                      )}
                    </div>
                  </div>

                  {/* list */}
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {(() => {
                      const q = tagSearch.trim().toLowerCase();
                      const list = TAGS.filter(t => !q || t.label.toLowerCase().includes(q));
                      if (list.length === 0) {
                        return <div style={{ padding: '18px 14px', fontSize: 13, color: 'var(--alf-ink-mute)', fontStyle: 'italic', textAlign: 'center' }}>Žiadne zručnosti.</div>;
                      }
                      return list.map((t) => {
                        const checked = tagFilter.has(t.id);
                        return (
                          <label key={t.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 14px', cursor: 'pointer',
                            background: checked ? 'rgba(46, 184, 146, .08)' : 'transparent',
                            borderBottom: '1px solid var(--alf-line)',
                            transition: 'background .1s',
                          }}
                          onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = 'var(--alf-bg)'; }}
                          onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = 'transparent'; }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: 6,
                              background: checked ? '#1E7A5E' : '#fff',
                              border: checked ? 'none' : '1.5px solid var(--alf-ink-mute)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
                            </span>
                            <input type="checkbox" checked={checked} onChange={() => {
                              setTagFilter(prev => {
                                const next = new Set(prev);
                                next.has(t.id) ? next.delete(t.id) : next.add(t.id);
                                return next;
                              });
                            }} style={{ display: 'none' }} />
                            <span style={{ fontSize: 14, color: 'var(--alf-ink)', fontWeight: 600 }}>{t.label}</span>
                          </label>
                        );
                      });
                    })()}
                  </div>

                  {/* footer */}
                  <div style={{
                    padding: '10px 14px', borderTop: '1px solid var(--alf-line)',
                    background: '#FAFBFD', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <button onClick={() => setTagFilter(new Set())} style={{
                      border: 'none', background: 'transparent',
                      color: 'var(--alf-ink-soft)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0,
                    }}>Vyčistiť</button>
                    <button onClick={() => setTagsOpen(false)} className="alf-btn-pill" style={{
                      padding: '5px 14px', fontSize: 12,
                      background: 'var(--alf-ink)', color: '#fff', borderColor: 'var(--alf-ink)',
                    }}>Hotovo</button>
                  </div>
                </div>
              )}
            </div>

            <span style={{ flex: 1 }} />

            <div className="alf-search" style={{ width: 260 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input placeholder="Hľadať..." />
            </div>
          </div>

          {/* Second filter row — material kind chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, padding: 4, background: '#fff', borderRadius: 99, border: '1px solid var(--alf-line)' }} data-row="tags-bottom">
              {tags.map((t) => (
                <button key={t.id} onClick={() => setTag(t.id)} style={{
                  padding: '6px 16px', borderRadius: 99, border: 'none',
                  background: tag === t.id ? 'var(--alf-sky-bg)' : 'transparent',
                  color: tag === t.id ? 'var(--alf-sky-ink)' : 'var(--alf-ink-soft)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* table — columns: Vek · Play · Názov · Zručnosti · Actions */}
          <MaterialsTable filtered={filtered} showActions={view === 'mine'} pathLabel={view === 'svp' ? 'ŠVP' : 'TÉMA'} extraPath={view === 'mine' ? 'ŠVP' : null} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--alf-ink-mute)' }}>
            <span>Zobrazené {filtered.length} z 151</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="alf-btn-pill" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}>‹</button>
              {[1, 2, 3, 4, 16].map((n) => (
                <button key={n} className="alf-btn-pill" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center', background: n === 1 ? 'var(--alf-ink)' : '#fff', color: n === 1 ? '#fff' : 'var(--alf-ink)', borderColor: n === 1 ? 'var(--alf-ink)' : 'var(--alf-line)' }}>{n}</button>
              ))}
              <button className="alf-btn-pill" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}>›</button>
            </div>
          </div>
        </div>
      </main>
      <NewMaterialModal open={matModalOpen} onClose={() => setMatModalOpen(false)} />
    </div>
  );
}

// ─── Materials table — Vek · Play · Názov · Zručnosti ──────────────────

// Subtitle showing material category; on hover surfaces the full tree path.
function CategoryPath({ material, label = 'TÉMA' }) {
  const [hover, setHover] = React.useState(false);
  const path = material.path || [material.category];
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'var(--alf-ink-mute)',
        position: 'relative', cursor: 'help',
      }}>
      <span style={{
        padding: '1px 6px', borderRadius: 4,
        background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)',
        fontSize: 9, fontWeight: 800, letterSpacing: '.06em',
      }}>{label}</span>
      <span style={{ borderBottom: '1px dotted var(--alf-ink-mute)' }}>{label === 'ŠVP' ? svpSubForMaterial(material) : material.category}</span>
      {hover && <PathTooltip path={label === 'ŠVP' ? [material.svp || 'ŠVP', svpSubForMaterial(material)] : path} />}
    </div>
  );
}

// ŠVP subtitle — small badge + area name; on hover surfaces the path.
const SVP_PATH_MAP = {
  'Človek a príroda':                   ['Človek a príroda', 'Živá príroda'],
  'Matematika a práca s informáciami':  ['Matematika a práca s informáciami', 'Čísla a operácie'],
  'Umenie a kultúra':                   ['Umenie a kultúra', 'Hudobno-výtvarné'],
  'Človek a spoločnosť':                ['Človek a spoločnosť', 'Orientácia v čase'],
  'Zdravie a pohyb':                    ['Zdravie a pohyb', 'Zdravá výživa'],
  'Jazyk a komunikácia':                ['Jazyk a komunikácia', 'Písaná reč'],
};
function SvpPath({ material }) {
  const [hover, setHover] = React.useState(false);
  const sub = svpSubForMaterial(material);
  if (!sub) return null;
  const areaName = material.svp || '';
  const path = areaName ? [areaName, sub] : [sub];
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'var(--alf-ink-mute)', marginTop: 3,
        position: 'relative', cursor: 'help',
      }}>
      <span style={{
        padding: '1px 6px', borderRadius: 4,
        background: 'var(--alf-sky-bg)', color: 'var(--alf-sky-deep)',
        fontSize: 9, fontWeight: 800, letterSpacing: '.06em',
      }}>ŠVP</span>
      <span style={{ borderBottom: '1px dotted var(--alf-ink-mute)' }}>{sub}</span>
      {hover && <PathTooltip path={path} />}
    </div>
  );
}

// Shared white tooltip with breadcrumb path (used by CategoryPath + SvpPath).
function PathTooltip({ path }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', left: 0,
      padding: '8px 12px', borderRadius: 10, background: '#fff',
      color: 'var(--alf-ink)', whiteSpace: 'nowrap', pointerEvents: 'none',
      boxShadow: '0 8px 22px -4px rgba(15, 30, 55, .22), 0 0 0 1px var(--alf-line)', zIndex: 50,
      fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2" strokeLinecap="round"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>
      {path.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--alf-ink-mute)' }}>›</span>}
          <span style={{ color: i === path.length - 1 ? 'var(--alf-sky-deep)' : 'var(--alf-ink-soft)' }}>{p}</span>
        </React.Fragment>
      ))}
      <div style={{
        position: 'absolute', bottom: '100%', left: 18,
        transform: 'translateY(5px) rotate(45deg)',
        width: 10, height: 10, background: '#fff',
        boxShadow: '-1px -1px 0 var(--alf-line)',
      }} />
    </div>
  );
}

function MaterialsTable({ filtered, showActions = true, pathLabel = 'TÉMA', extraPath = null }) {
  const [editingMat, setEditingMat] = React.useState(null);
  const [deletingMat, setDeletingMat] = React.useState(null);
  const cols = showActions ? '80px 1fr 220px 90px' : '80px 1fr 220px';

  return (
    <>
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--alf-shadow-card)', overflow: 'visible' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: cols,
        gap: 16, padding: '14px 22px',
        fontSize: 11, fontWeight: 700, color: 'var(--alf-ink-mute)',
        letterSpacing: '.06em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--alf-line)',
      }}>
        <span></span>
        <span>Názov</span>
        <span>Zručnosti</span>
        {showActions && <span></span>}
      </div>
      {filtered.map((m, idx) => {
        const isLast = idx === filtered.length - 1;
        const matTags = tagsForMaterial(m.id);
        return (
          <div key={m.id} style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 16, padding: '12px 22px', alignItems: 'center',
            borderBottom: isLast ? 'none' : '1px solid var(--alf-line)',
            transition: 'background .12s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--alf-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <PlayButton material={m} size={56} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.25 }}>{m.name}</div>
              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <CategoryPath material={m} label={pathLabel} />
                {extraPath && <CategoryPath material={m} label={extraPath} />}
                <span style={{ fontSize: 11, color: 'var(--alf-ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    padding: '1px 6px', borderRadius: 4,
                    background: 'var(--alf-mint-bg)', color: '#1E7A5E',
                    fontSize: 9, fontWeight: 800, letterSpacing: '.06em',
                  }}>VEK</span>
                  <span>{m.ages.map(a => AGE_META[a]?.label).filter(Boolean).join(', ')}</span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {matTags.map((t) => (
                <CurricularTagIcon key={t.id} tag={t} size={32} />
              ))}
            </div>
            {showActions && (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                {m.mine && (
                  <>
                    <button onClick={() => setEditingMat(m)} title="Upraviť materiál" className="alf-btn-pill" style={{ padding: 0, width: 40, height: 40, justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
                    </button>
                    <button onClick={() => setDeletingMat(m)} title="Zmazať materiál" className="alf-btn-pill" style={{ padding: 0, width: 40, height: 40, justifyContent: 'center', color: '#A94545' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
    <NewMaterialModal key={editingMat?.id || 'edit'} open={!!editingMat} material={editingMat} onClose={() => setEditingMat(null)} />
    <DeleteMaterialModalB material={deletingMat} onClose={() => setDeletingMat(null)} />
    </>
  );
}

// One small chip representing one lesson. Click navigates to the lesson;
// hover surfaces a tooltip with full name + date + nav hint.
function LessonChip({ lesson, onClick, interactive = true, color }) {
  const [hover, setHover] = React.useState(false);
  const bg = color || lesson.color;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 30, height: 30, borderRadius: 99,
        background: bg, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, letterSpacing: '.02em',
        border: '2px solid #fff',
        cursor: interactive && onClick ? 'pointer' : 'default',
        boxShadow: hover && interactive
          ? '0 6px 14px rgba(0,0,0,.22)'
          : '0 1px 3px rgba(0,0,0,.15)',
        transition: 'transform .12s ease, box-shadow .12s ease',
        transform: hover && interactive ? 'translateY(-3px) scale(1.1)' : 'none',
        position: 'relative', flexShrink: 0,
        zIndex: hover ? 20 : 'auto',
      }}>
      {hover && interactive && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 12px', borderRadius: 10, background: 'var(--alf-ink)',
          color: '#fff', whiteSpace: 'nowrap', pointerEvents: 'none',
          boxShadow: '0 8px 18px rgba(0,0,0,.28)', zIndex: 50,
        }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.1 }}>{lesson.name}</div>
          <div style={{ fontSize: 11, opacity: .85, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AgeIcon age={lesson.age} size={14} />
            <span style={{ letterSpacing: '.06em' }}>{lesson.season.toUpperCase()}</span>
            <span style={{ opacity: .5 }}>·</span>
            <span style={{ color: 'var(--alf-sky)' }}>Otvoriť hodinu →</span>
          </div>
          {/* tail */}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 10, height: 10, background: 'var(--alf-ink)', marginTop: -5,
          }} />
        </div>
      )}
    </div>
  );
}

// Inline cell — stacked clickable chips + "+N" overflow + plus button.
// Three popovers can open from this cell:
//   1) edit  — pick which lessons (toggle assignments)
//   2) overflow — list overflow lessons (click → navigate)
// Each chip itself navigates on click (handled by `goto`).
function LessonChips({ assignedIds, onToggle, onGoto, readOnly = false, chipColor }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const ref = React.useRef(null);
  const assignedLessons = assignedIds.map(id => LESSONS.find(l => l.id === id)).filter(Boolean);
  const VISIBLE = 3;
  const visible = assignedLessons.slice(0, VISIBLE);
  const overflow = assignedLessons.slice(VISIBLE);

  React.useEffect(() => {
    if (!editOpen && !overflowOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setEditOpen(false);
        setOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [editOpen, overflowOpen]);

  const goto = onGoto || ((l) => { /* navigate hook — wire to router later */ });

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
      {assignedLessons.length === 0 ? null : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {visible.map((l, i) => (
            <div key={l.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <LessonChip lesson={l} onClick={() => goto(l)} color={chipColor} />
            </div>
          ))}
          {overflow.length > 0 && (
            <button
              onClick={() => { setOverflowOpen(o => !o); setEditOpen(false); }}
              title={`Ďalších ${overflow.length} hodín`}
              style={{
                marginLeft: -8, width: 30, height: 30, borderRadius: 99,
                background: overflowOpen ? 'var(--alf-ink)' : '#fff',
                border: '2px solid #fff',
                color: overflowOpen ? '#fff' : 'var(--alf-ink-soft)',
                outline: '1px solid var(--alf-line)',
                cursor: 'pointer', padding: 0,
                fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,.15)',
                flexShrink: 0,
              }}>+{overflow.length}</button>
          )}
        </div>
      )}

      {!readOnly && (
        <button
          onClick={() => { setEditOpen(o => !o); setOverflowOpen(false); }}
          title="Priradiť k hodine"
          style={{
            width: 30, height: 30, borderRadius: 99,
            background: editOpen ? 'var(--alf-sky-deep)' : '#fff',
            border: `1.5px dashed ${editOpen ? 'var(--alf-sky-deep)' : 'var(--alf-ink-mute)'}`,
            color: editOpen ? '#fff' : 'var(--alf-ink-mute)',
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      )}

      {overflowOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 300, background: '#fff', borderRadius: 14,
          boxShadow: 'var(--alf-shadow-popover)', zIndex: 40,
          border: '1px solid var(--alf-line)', overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--alf-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Všetky priradené hodiny</div>
              <div style={{ fontSize: 12, color: 'var(--alf-ink-soft)', marginTop: 2 }}>Klikni pre otvorenie hodiny</div>
            </div>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: 'var(--alf-sky-bg)',
              color: 'var(--alf-sky-deep)', fontSize: 11, fontWeight: 800,
            }}>{assignedLessons.length}</span>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: 4 }}>
            {assignedLessons.map((l) => (
              <div key={l.id} onClick={() => { goto(l); setOverflowOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                transition: 'background .1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--alf-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <LessonChip lesson={l} interactive={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--alf-ink-mute)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <AgeIcon age={l.age} size={14} />
                    <span style={{ letterSpacing: '.06em', fontWeight: 700 }}>{l.season.toUpperCase()}</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6"/></svg>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--alf-line)', background: '#FAFBFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => { setOverflowOpen(false); setEditOpen(true); }} style={{
              border: 'none', background: 'transparent',
              color: 'var(--alf-sky-deep)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Upraviť priradenie
            </button>
            <button onClick={() => setOverflowOpen(false)} className="alf-btn-pill" style={{ padding: '4px 12px', fontSize: 12 }}>Zavrieť</button>
          </div>
        </div>
      )}

      {editOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 320, background: '#fff', borderRadius: 14,
          boxShadow: 'var(--alf-shadow-popover)', zIndex: 40,
          border: '1px solid var(--alf-line)', overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--alf-line)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--alf-ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Priradiť k hodine</div>
            <div style={{ fontSize: 12, color: 'var(--alf-ink-soft)', marginTop: 3 }}>Test môže byť vo viacerých hodinách súčasne.</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
              padding: '8px 10px', borderRadius: 10,
              background: 'var(--alf-bg)', border: '1px solid var(--alf-line)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--alf-ink-mute)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hľadať hodinu..."
                autoFocus
                style={{
                  flex: 1, minWidth: 0, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 13, color: 'var(--alf-ink)',
                  fontFamily: 'var(--alf-font-body)',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  width: 18, height: 18, borderRadius: 99, border: 'none',
                  background: 'var(--alf-ink-mute)', color: '#fff',
                  cursor: 'pointer', padding: 0, fontSize: 10, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              )}
            </div>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto', padding: 4 }}>
            {(() => {
              const q = search.trim().toLowerCase();
              const list = LESSONS.filter(l => !q || l.name.toLowerCase().includes(q) || l.season.toLowerCase().includes(q));
              if (list.length === 0) {
                return <div style={{ padding: '14px 10px', fontSize: 12, color: 'var(--alf-ink-mute)', fontStyle: 'italic', textAlign: 'center' }}>Žiadne hodiny nezodpovedajú „{search}"</div>;
              }
              return list.map((l) => {
              const checked = assignedIds.includes(l.id);
              return (
                <div key={l.id} onClick={() => onToggle(l.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                  background: checked ? 'var(--alf-sky-bg)' : 'transparent',
                  transition: 'background .1s',
                }}
                onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = 'var(--alf-bg)'; }}
                onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: checked ? l.color : '#fff',
                    border: checked ? 'none' : '1.5px solid var(--alf-line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
                  </div>
                  <LessonChip lesson={l} interactive={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--alf-ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--alf-ink-mute)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <AgeIcon age={l.age} size={14} />
                      <span style={{ letterSpacing: '.06em', fontWeight: 700 }}>{l.season.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              );
            });
            })()}
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--alf-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFBFD' }}>
            <span style={{ fontSize: 12, color: 'var(--alf-ink-soft)' }}>{assignedIds.length} z {LESSONS.length}</span>
            <button onClick={() => setEditOpen(false)} className="alf-btn-pill" style={{ padding: '5px 12px', fontSize: 12, background: 'var(--alf-ink)', color: '#fff', borderColor: 'var(--alf-ink)' }}>Hotovo</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Heart button — click toggles, hover shows preview of next state, gentle pulse.
function FavoriteHeart({ isFav, onToggle }) {
  const [hover, setHover] = React.useState(false);
  const [pulsing, setPulsing] = React.useState(false);
  const handle = () => {
    setPulsing(true);
    onToggle();
    setTimeout(() => setPulsing(false), 280);
  };
  // Visual = current state, but on hover we preview the next state with slight opacity.
  const showFilled = isFav ? !hover : hover;
  return (
    <button
      onClick={handle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={isFav ? 'Odstrániť z obľúbených' : 'Pridať k obľúbeným'}
      style={{
        width: 44, height: 44, borderRadius: 99, border: 'none',
        background: isFav ? 'var(--alf-coral-bg)' : 'transparent',
        cursor: 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .15s ease, transform .15s ease',
        transform: pulsing ? 'scale(1.18)' : 'scale(1)',
      }}>
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill={showFilled ? 'var(--alf-coral)' : 'none'}
        stroke={showFilled ? 'var(--alf-coral)' : 'var(--alf-ink-mute)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'fill .12s, stroke .12s', opacity: hover && !isFav ? 0.85 : 1 }}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
      </svg>
    </button>
  );
}

Object.assign(window, {
  Teacher_1A_Dashboard, Teacher_1B_Library, Teacher_1B_LibraryTree, Teacher_1C_Materials,
  CategoryDropdown, FavoriteHeart, LessonChips, CategoryPath, SvpPath,
  ThemeTreePanel,
});
