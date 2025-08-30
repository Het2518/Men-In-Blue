import { contractABI, contractAddress } from '../constants'

export const issueCredit = async (web3, account, to, amount, metadataURI) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  return contract.methods.issueCredit(to, amount, metadataURI).send({ from: account })
}

export const transferCredit = async (web3, account, from, to, tokenId, amount) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  return contract.methods.transferCredit(from, to, tokenId, amount).send({ from: account })
}

export const retireCredit = async (web3, account, tokenId, amount) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  return contract.methods.retireCredit(tokenId, amount).send({ from: account })
}

export const verifyOracleData = async (contract, msgHash, oracleSig) => {
  return contract.methods.verifyOracleData(msgHash, oracleSig).call()
}

export const setMetadataURI = async (web3, account, newURI) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  return contract.methods.setMetadataURI(newURI).send({ from: account })
}
