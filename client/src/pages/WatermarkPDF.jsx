import ToolPage from '../components/ToolPage'

export default function WatermarkPDF() {
  const extraFields = (formData, setFormData) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Watermark Text
          </label>
          <input
            type="text"
            value={formData.text || 'WATERMARK'}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter watermark text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    )
  }

  return (
    <ToolPage
      title="Add Watermark"
      description="Add a text watermark to your PDF document"
      endpoint="watermark"
      multiple={false}
      extraFields={extraFields}
    />
  )
}

