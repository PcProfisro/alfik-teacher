/* teacher-app.jsx — Standalone, deployable Teacher Portal app.
 * Drives real navigation between the teacher screens via TeacherNavCtx:
 *   dashboard → Teacher_1A_Dashboard
 *   materials → Teacher_1C_Materials (Témy / ŠVP / Moje)
 *   classes   → Teacher_1C_Lessons
 *   history   → Teacher_1D_History
 * Route is mirrored to the URL hash so it survives reload / is link-able.
 */

function TeacherApp() {
  const valid = ['dashboard', 'materials', 'classes', 'history'];

  const readHash = () => {
    const h = (window.location.hash || '').replace(/^#\/?/, '');
    const [key, sub] = h.split('/');
    if (valid.includes(key)) return { key, sub: sub || 'temy' };
    return { key: 'dashboard', sub: 'temy' };
  };

  const [route, setRoute] = React.useState(readHash);
  const [age, setAge] = React.useState('all');

  const navigate = React.useCallback((key, sub) => {
    setRoute({ key, sub: sub || (key === 'materials' ? 'temy' : undefined) });
  }, []);

  // keep URL hash in sync + respond to back/forward
  React.useEffect(() => {
    const hash = '#/' + route.key + (route.key === 'materials' ? '/' + (route.sub || 'temy') : '');
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [route]);

  React.useEffect(() => {
    const onPop = () => setRoute(readHash());
    window.addEventListener('hashchange', onPop);
    return () => window.removeEventListener('hashchange', onPop);
  }, []);

  let screen;
  if (route.key === 'materials') {
    const view = route.sub === 'svp' ? 'svp' : route.sub === 'mine' ? 'mine' : 'temy';
    screen = <Teacher_1C_Materials key={'mat-' + view} age={age} onAgeChange={setAge} view={view} />;
  } else if (route.key === 'classes') {
    screen = <Teacher_1C_Lessons />;
  } else if (route.key === 'history') {
    screen = <Teacher_1D_History />;
  } else {
    screen = <Teacher_1A_Dashboard age={age} onAgeChange={setAge} />;
  }

  return (
    <TeacherNavCtx.Provider value={{ navigate, route }}>
      {screen}
    </TeacherNavCtx.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TeacherApp />);
