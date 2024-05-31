import './app.css';
import { useEffect } from 'react';

import { UnityGame } from '../components';
import { useTonConnect } from '../hooks';

function App() {
  const { connected, tonConnectUI } = useTonConnect();

  tonConnectUI.onModalStateChange(({ closeReason, status }) => {
    if (
      !connected &&
      status === 'closed' &&
      closeReason === 'action-cancelled'
    ) {
      tonConnectUI.openModal();
    }
  });

  useEffect(() => {
    if (!connected) {
      tonConnectUI.disconnect();
      tonConnectUI.openModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return <UnityGame />;
}

export default App;
