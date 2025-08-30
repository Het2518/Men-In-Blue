import { createContext, useState, useEffect } from 'react'
import Web3 from 'web3'
import { contractABI, contractAddress } from '../constants'
import { toast } from 'react-toastify'

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [isProducer, setIsProducer] = useState(false)
  const [isConsumer, setIsConsumer] = useState(false)
  const [isAuditor, setIsAuditor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // Assuming admin check, adjust if needed

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const accounts = await web3Instance.eth.getAccounts()
          setAccount(accounts[0])
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress)
          setContract(contractInstance)
          // Check roles
          const producer = await contractInstance.methods.hasProducerRole(accounts[0]).call()
          setIsProducer(producer)
          const consumer = await contractInstance.methods.hasConsumerRole(accounts[0]).call()
          setIsConsumer(consumer)
          const auditor = await contractInstance.methods.hasAuditorRole(accounts[0]).call()
          setIsAuditor(auditor)
          // For admin, check DEFAULT_ADMIN_ROLE
          const admin = await contractInstance.methods.hasRole(await contractInstance.methods.DEFAULT_ADMIN_ROLE().call(), accounts[0]).call()
          setIsAdmin(admin)
          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts) => setAccount(newAccounts[0]))
        } catch (error) {
          toast.error('Failed to connect wallet')
        }
      } else {
        toast.error('Please install MetaMask')
      }
    }
    init()
  }, [])

  return (
    <Web3Context.Provider value={{ web3, account, contract, isProducer, isConsumer, isAuditor, isAdmin }}>
      {children}
    </Web3Context.Provider>
  )
}
