const Input = ({ label, value, onChange, type = 'text', className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1 text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="bg-white bg-opacity-20 p-2 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-hydrogen-blue transition-all"
      />
    </div>
  )
}

export default Input
