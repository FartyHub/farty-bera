import { CommonLayout, ConnectSection, FartyBeraGame } from '../components';

export default function Index() {
  return (
    <CommonLayout className="gap-4">
      <ConnectSection />
      <FartyBeraGame />
    </CommonLayout>
  );
}
