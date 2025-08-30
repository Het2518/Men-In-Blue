// Mock contract functions for development mode
export const mockContract = {
  getCurrentTokenId: () => Promise.resolve('1'),
  getBalance: () => Promise.resolve('1250000'),
  issueCredit: (to, amount, metadataURI) => {
    console.log('Mock: Issue Credit', { to, amount, metadataURI });
    return Promise.resolve({ transactionHash: '0x123...abc' });
  },
  transferCredit: (from, to, tokenId, amount) => {
    console.log('Mock: Transfer Credit', { from, to, tokenId, amount });
    return Promise.resolve({ transactionHash: '0x456...def' });
  },
  retireCredit: (tokenId, amount) => {
    console.log('Mock: Retire Credit', { tokenId, amount });
    return Promise.resolve({ transactionHash: '0x789...ghi' });
  },
  verifyOracleData: (msgHash, oracleSig) => {
    console.log('Mock: Verify Oracle Data', { msgHash, oracleSig });
    return Promise.resolve(true);
  },
  setMetadataURI: (newURI) => {
    console.log('Mock: Set Metadata URI', { newURI });
    return Promise.resolve({ transactionHash: '0xabc...123' });
  },
  checkRoles: () => Promise.resolve({
    isProducer: true,
    isBuyer: true,
    isCertifier: true,
    isAdmin: true
  })
};

export const mockMetadata = {
  name: 'Green Hydrogen Credit #1',
  description: 'Certified green hydrogen production credit from renewable energy sources',
  image: 'https://via.placeholder.com/300x300.png?text=Green+H2',
  attributes: [
    { trait_type: 'Production Method', value: 'Electrolysis' },
    { trait_type: 'Energy Source', value: 'Solar' },
    { trait_type: 'Location', value: 'California, USA' },
    { trait_type: 'Certification', value: 'ISO 14855-1' }
  ]
};
