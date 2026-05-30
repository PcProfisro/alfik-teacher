/* ucitelsky-portal-nav.jsx — TeacherNavCtx router pre Ucitelsky-portal.html. */

function TeacherPortalRouter() {
  const [screen, setScreen]           = React.useState('dashboard');
  const [materialsSub, setMaterialsSub] = React.useState('temy');
  const [age, setAge]                 = React.useState('all');

  const navigate = React.useCallback((key, sub) => {
    setScreen(key);
    if (sub) setMaterialsSub(sub);
  }, []);

  const navCtx = React.useMemo(() => ({ navigate }), [navigate]);

  const screens = {
    'dashboard': <Teacher_1A_Dashboard age={age} onAgeChange={setAge} />,
    'materials': <Teacher_1C_Materials age={age} onAgeChange={setAge} view={materialsSub} />,
    'classes':   <Teacher_1C_Lessons />,
    'history':   <Teacher_1D_History />,
  };

  return (
    <TeacherNavCtx.Provider value={navCtx}>
      {screens[screen] ?? <Teacher_1A_Dashboard age={age} onAgeChange={setAge} />}
    </TeacherNavCtx.Provider>
  );
}

Object.assign(window, { TeacherPortalRouter });
