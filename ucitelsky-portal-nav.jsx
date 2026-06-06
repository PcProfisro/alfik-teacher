/* ucitelsky-portal-nav.jsx — TeacherNavCtx router pre Ucitelsky-portal.html. */

function TeacherPortalRouter() {
  const [screen, setScreen]           = React.useState('dashboard');
  const [materialsSub, setMaterialsSub] = React.useState('svp');
  const [age, setAge]                 = React.useState('all');

  const [classesSub, setClassesSub] = React.useState('hodiny');

  const navigate = React.useCallback((key, sub) => {
    setScreen(key);
    if (key === 'materials' && sub) setMaterialsSub(sub);
    if (key === 'classes'   && sub) setClassesSub(sub);
  }, []);

  const navCtx = React.useMemo(() => ({ navigate }), [navigate]);

  // Inject active nav props into each screen's TeacherSidebar via cloneElement is complex;
  // instead pass via context extra fields
  const fullNavCtx = React.useMemo(() => ({ navigate, screen, materialsSub, classesSub }), [navigate, screen, materialsSub, classesSub]);

  const screens = {
    'dashboard': <Teacher_1A_Dashboard age={age} onAgeChange={setAge} />,
    'materials': <Teacher_1C_Materials age={age} onAgeChange={setAge} view={materialsSub} />,
    'classes':   classesSub === 'mine'
      ? <Teacher_1C_Materials age={age} onAgeChange={setAge} view="mine" />
      : classesSub === 'kalendar'
      ? <Teacher_1C_Calendar />
      : <Teacher_1C_Lessons />,
    'history':   <Teacher_1D_History />,
  };

  return (
    <TeacherNavCtx.Provider value={fullNavCtx}>
      {React.cloneElement(screens[screen] ?? <Teacher_1A_Dashboard age={age} onAgeChange={setAge} />)}
    </TeacherNavCtx.Provider>
  );
}

Object.assign(window, { TeacherPortalRouter });
