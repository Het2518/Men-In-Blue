import axios from 'axios';

export const fetchMetadata = async (tokenId) => {
  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${tokenId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error);
    return null;
  }
};
