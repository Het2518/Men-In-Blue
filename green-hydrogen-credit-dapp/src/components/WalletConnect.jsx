import { useContext } from 'react'
import { Web3Context } from '../contexts/Web3Context'
import { formatAddress } from '../utils/format'
import { toast } from 'react-toastify'

const WalletConnect = () => {
  const { account } = useContext(Web3Context)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        toast.success('Wallet connected')
      } catch (error) {
        toast.error('Failed to connect wallet')
      }
    } else {
      toast.error('MetaMask not detected')
    }
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-hydrogen-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all animate-pulse-glow"
    >
      {account ? formatAddress(account) : 'Connect Wallet'}
    </button>
  )
}

export default WalletConnect
