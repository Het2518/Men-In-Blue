import { useContext, useState } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import Button from '../common/Button'
import Input from '../common/Input'
import { retireCredit } from '../../utils/contract'
import { toast } from 'react-toastify'

const RetireCreditForm = () => {
  const { web3, account } = useContext(Web3Context)
  const [tokenId, setTokenId] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await retireCredit(web3, account, tokenId, amount)
      toast.success('Credit retired successfully')
    } catch (error) {
      toast.error('Failed to retire credit')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input label="Token ID" type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button type="submit">Retire Credit</Button>
    </form>
  )
}

export default RetireCreditForm
