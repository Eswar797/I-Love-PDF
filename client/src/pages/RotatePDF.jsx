import ToolPage from '../components/ToolPage'

export default function RotatePDF() {
  const extraFields = (formData, setFormData) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation Angle
          </label>
          <select
            value={formData.angle || '90'}
            onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="90">90° Clockwise</option>
            <option value="180">180°</option>
            <option value="270">270° Clockwise (90° Counter-clockwise)</option>
          </select>
        </div>
      </div>
    )
  }

  return (
    <ToolPage
      title="Rotate PDF"
      description="Rotate PDF pages clockwise or counter-clockwise"
      endpoint="rotate"
      multiple={false}
      extraFields={extraFields}
    />
  )
}

