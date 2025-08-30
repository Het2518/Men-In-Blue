import { useContext, useState, useEffect } from 'react'
import { Web3Context } from '../contexts/Web3Context'
import { Link } from 'react-router-dom'
import { fetchMetadata } from '../utils/ipfs'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { account, contract, isProducer, isConsumer, isAuditor, isAdmin } = useContext(Web3Context)
  const [balance, setBalance] = useState(0)
  const [tokenId, setTokenId] = useState(1) // Example tokenId
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const getBalance = async () => {
      if (contract && account) {
        try {
          const bal = await contract.methods.balanceOf(account, tokenId).call()
          setBalance(bal)
          const meta = await fetchMetadata(tokenId)
          setMetadata(meta)
        } catch (error) {
          toast.error('Failed to fetch balance or metadata')
        }
      }
    }
    getBalance()
  }, [contract, account, tokenId])

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg animate-fade-in relative overflow-hidden">
      <div className="animate-bubble w-20 h-20 bottom-0 left-10"></div>
      <div className="animate-bubble w-16 h-16 bottom-0 right-20 delay-1000"></div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Account: {account}</p>
      <p>Balance for Token ID {tokenId}: {balance}</p>
      {metadata && <p>Metadata: {JSON.stringify(metadata)}</p>}
      <div className="mt-4 flex flex-wrap gap-4">
        {isProducer && <Link to="/producer" className="bg-producer-green px-4 py-2 rounded hover:scale-105 transition-transform">Issue Credits</Link>}
        {isConsumer && <Link to="/buyer" className="bg-buyer-blue px-4 py-2 rounded hover:scale-105 transition-transform">Manage Credits</Link>}
        {isAuditor && <Link to="/certifier" className="bg-cert-purple px-4 py-2 rounded hover:scale-105 transition-transform">Verify Oracle</Link>}
        {isAdmin && <Link to="/admin" className="bg-hydrogen-blue px-4 py-2 rounded hover:scale-105 transition-transform">Admin Panel</Link>}
      </div>
    </div>
  )
}

export default Dashboard
