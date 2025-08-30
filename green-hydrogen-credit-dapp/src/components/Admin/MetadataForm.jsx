import React from 'react'

const MetadataForm = () => {
  return (
    <div>MetadataForm</div>
  )
}

export default MetadataFormimport { useContext, useState } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import Button from '../common/Button'
import Input from '../common/Input'
import { setMetadataURI } from '../../utils/contract'
import { toast } from 'react-toastify'

const MetadataForm = () => {
  const { web3, account } = useContext(Web3Context)
  const [newURI, setNewURI] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await setMetadataURI(web3, account, newURI)
      toast.success('Metadata URI updated successfully')
    } catch (error) {
      toast.error('Failed to update metadata URI')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input label="New Metadata URI" value={newURI} onChange={(e) => setNewURI(e.target.value)} />
      <Button type="submit">Update Metadata URI</Button>
    </form>
  )
}

export default MetadataForm
