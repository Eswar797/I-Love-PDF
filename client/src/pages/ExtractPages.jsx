import ToolPage from '../components/ToolPage'

export default function ExtractPages() {
  const extraFields = (formData, setFormData) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Numbers (e.g., 1,3,5-7)
          </label>
          <input
            type="text"
            value={formData.pages || ''}
            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
            placeholder="1, 3, 5-7"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter page numbers separated by commas. Use ranges like 5-7 for pages 5, 6, and 7.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ToolPage
      title="Extract Pages"
      description="Extract specific pages from your PDF document"
      endpoint="extract"
      multiple={false}
      extraFields={extraFields}
    />
  )
}

