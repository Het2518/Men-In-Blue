import axios from 'axios';
import { mockMetadata } from './mockContract';

const isDevelopmentMode = () => {
  return import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
};

export const fetchMetadata = async (tokenId) => {
  if (isDevelopmentMode()) {
    // Return mock metadata in development mode
    return Promise.resolve(mockMetadata);
  }

  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${tokenId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error);
    return null;
  }
};
