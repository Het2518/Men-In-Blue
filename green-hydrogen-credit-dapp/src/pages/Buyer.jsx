import TransferCreditForm from '../components/Buyer/TransferCreditForm'
import RetireCreditForm from '../components/Buyer/RetireCreditForm'

const Buyer = () => {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Buyer Panel</h2>
      <h3 className="text-xl mb-2">Transfer Credit</h3>
      <TransferCreditForm />
      <h3 className="text-xl mt-6 mb-2">Retire Credit</h3>
      <RetireCreditForm />
    </div>
  )
}

export default Buyer
