import { UnityGame } from '../components';
import { WagmiProvider, UnityGameProvider } from '../contexts';

import './app.css';

function App() {
  return (
    <WagmiProvider>
      <UnityGameProvider>
        <UnityGame />
      </UnityGameProvider>
    </WagmiProvider>
  );
}

export default App;
