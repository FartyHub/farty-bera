import { Leaderboard } from '../components';
import { WagmiProvider } from '../contexts';

export function App() {
  return (
    <WagmiProvider>
      <Leaderboard />
    </WagmiProvider>
  );
}

export default App;
