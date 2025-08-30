import { useContext, useState } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import Button from '../common/Button'
import Input from '../common/Input'
import { transferCredit } from '../../utils/contract'
import { toast } from 'react-toastify'

const TransferCreditForm = () => {
  const { web3, account } = useContext(Web3Context)
  const [to, setTo] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await transferCredit(web3, account, account, to, tokenId, amount) // from is account
      toast.success('Credit transferred successfully')
    } catch (error) {
      toast.error('Failed to transfer credit')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input label="To Address" value={to} onChange={(e) => setTo(e.target.value)} />
      <Input label="Token ID" type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button type="submit">Transfer Credit</Button>
    </form>
  )
}

export default TransferCreditForm
