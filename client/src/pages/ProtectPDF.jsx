import ToolPage from '../components/ToolPage'

export default function ProtectPDF() {
  const extraFields = (formData, setFormData) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Note: Full encryption requires additional libraries. This is a basic implementation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ToolPage
      title="Protect PDF"
      description="Add password protection to your PDF document"
      endpoint="protect"
      multiple={false}
      extraFields={extraFields}
    />
  )
}

