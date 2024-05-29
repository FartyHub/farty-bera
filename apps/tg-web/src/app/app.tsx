import './app.css';
import { useEffect } from 'react';

import { UnityGame } from '../components';
import { useTonConnect } from '../hooks';

function App() {
  const { tonConnectUI } = useTonConnect();

  useEffect(() => {
    // tonConnectUI.openModal();
  }, []);

  return <UnityGame />;
}

export default App;
