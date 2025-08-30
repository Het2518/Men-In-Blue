const Button = ({ children, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      className={`bg-eco-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all animate-pulse-glow ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
