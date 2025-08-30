import { useContext, useState } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import Button from '../common/Button'
import Input from '../common/Input'
import { issueCredit } from '../../utils/contract'
import { toast } from 'react-toastify'

const IssueCreditForm = () => {
  const { web3, account, contract } = useContext(Web3Context)
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [metadataURI, setMetadataURI] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await issueCredit(web3, account, to, amount, metadataURI)
      toast.success('Credit issued successfully')
    } catch (error) {
      toast.error('Failed to issue credit')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input label="Recipient Address" value={to} onChange={(e) => setTo(e.target.value)} />
      <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Input label="Metadata URI" value={metadataURI} onChange={(e) => setMetadataURI(e.target.value)} />
      <Button type="submit">Issue Credit</Button>
    </form>
  )
}

export default IssueCreditForm
