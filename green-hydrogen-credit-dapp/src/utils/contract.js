import Web3 from 'web3';
import { contractABI, contractAddress } from '../constants';
import { mockContract } from './mockContract';

// Check if we're in development mode
const isDevelopmentMode = () => {
  return import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
};

export const initContract = async (web3) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract;
  }
  return new web3.eth.Contract(contractABI, contractAddress);
};

export const issueCredit = async (web3, account, to, amount, metadataURI) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.issueCredit(to, amount, metadataURI);
  }
  const contract = await initContract(web3);
  return contract.methods.issueCredit(to, amount, metadataURI).send({ from: account });
};

export const transferCredit = async (web3, account, from, to, tokenId, amount) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.transferCredit(from, to, tokenId, amount);
  }
  const contract = await initContract(web3);
  return contract.methods.transferCredit(from, to, tokenId, amount).send({ from: account });
};

export const retireCredit = async (web3, account, tokenId, amount) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.retireCredit(tokenId, amount);
  }
  const contract = await initContract(web3);
  return contract.methods.retireCredit(tokenId, amount).send({ from: account });
};

export const verifyOracleData = async (web3, msgHash, oracleSig) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.verifyOracleData(msgHash, oracleSig);
  }
  const contract = await initContract(web3);
  return contract.methods.verifyOracleData(msgHash, oracleSig).call();
};

export const setMetadataURI = async (web3, account, newURI) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.setMetadataURI(newURI);
  }
  const contract = await initContract(web3);
  return contract.methods.setMetadataURI(newURI).send({ from: account });
};

export const getCurrentTokenId = async (web3) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.getCurrentTokenId();
  }
  const contract = await initContract(web3);
  return contract.methods.getCurrentTokenId().call();
};

export const getBalance = async (web3, account, tokenId) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.getBalance();
  }
  const contract = await initContract(web3);
  return contract.methods.balanceOf(account, tokenId).call();
};

export const checkRoles = async (web3, account) => {
  if (isDevelopmentMode() && web3?.mockWeb3) {
    return mockContract.checkRoles();
  }
  const contract = await initContract(web3);
  const isProducer = await contract.methods.hasProducerRole(account).call();
  const isBuyer = await contract.methods.hasConsumerRole(account).call();
  const isCertifier = await contract.methods.hasAuditorRole(account).call();
  const isAdmin = await contract.methods.hasRole("0x0000000000000000000000000000000000000000000000000000000000000000", account).call();
  return { isProducer, isBuyer, isCertifier, isAdmin };
};
