import BuyerMarketplace from '../components/Buyer/BuyerMarketplace';

const Buyer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <BuyerMarketplace />
      </div>
    </div>
  );
};

export default Buyer;
