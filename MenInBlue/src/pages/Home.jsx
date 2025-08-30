import React from 'react';
import Card from '../components/common/Card';

function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Card title="Welcome to Green Hydrogen Credit System">
        <p className="text-gray-700">This platform uses blockchain to issue, track, and certify credits for green hydrogen production. Producers, certifiers, buyers, and admins collaborate to ensure transparency and trust in renewable hydrogen markets.</p>
      </Card>
      <Card title="How It Works">
        <ul className="list-disc pl-6 text-gray-700">
          <li>Producers submit hydrogen production data.</li>
          <li>Certifiers verify and certify production.</li>
          <li>Credits are issued, transferred, and retired on-chain.</li>
          <li>Admins monitor for fraud and audit trails.</li>
        </ul>
      </Card>
      <Card title="Get Started">
        <p className="text-gray-700">Connect your wallet and choose your role to begin.</p>
      </Card>
    </div>
  );
}

export default Home;
