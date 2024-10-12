import { Leaderboard } from '../components';
import { StarknetProvider } from '../contexts';

export function App() {
  return (
    <StarknetProvider>
      <Leaderboard />
    </StarknetProvider>
  );
}

export default App;
