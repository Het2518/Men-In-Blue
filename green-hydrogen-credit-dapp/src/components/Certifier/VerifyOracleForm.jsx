import { useContext, useState } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import Button from '../common/Button'
import Input from '../common/Input'
import { verifyOracleData } from '../../utils/contract'
import { toast } from 'react-toastify'

const VerifyOracleForm = () => {
  const { contract } = useContext(Web3Context)
  const [msgHash, setMsgHash] = useState('')
  const [oracleSig, setOracleSig] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await verifyOracleData(contract, msgHash, oracleSig)
      setResult(res)
      toast.success(`Verification result: ${res}`)
    } catch (error) {
      toast.error('Failed to verify oracle data')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input label="Message Hash" value={msgHash} onChange={(e) => setMsgHash(e.target.value)} />
      <Input label="Oracle Signature" value={oracleSig} onChange={(e) => setOracleSig(e.target.value)} />
      <Button type="submit">Verify</Button>
      {result !== null && <p className="mt-2">Result: {result ? 'Valid' : 'Invalid'}</p>}
    </form>
  )
}

export default VerifyOracleForm
