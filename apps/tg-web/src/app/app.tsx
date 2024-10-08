import { UnityGame } from '../components';
import { StarknetProvider, UnityGameProvider } from '../contexts';

import './app.css';

function App() {
  return (
    <StarknetProvider>
      <UnityGameProvider>
        <UnityGame />
      </UnityGameProvider>
    </StarknetProvider>
  );
}

export default App;
