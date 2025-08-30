import MetadataForm from '../components/Admin/MetadataForm'

const Admin = () => {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <MetadataForm />
    </div>
  )
}

export default Admin
