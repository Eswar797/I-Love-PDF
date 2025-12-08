import ToolPage from '../components/ToolPage'

export default function ImagesToPDF() {
  return (
    <ToolPage
      title="Images to PDF"
      description="Convert multiple images into a single PDF document"
      endpoint="images-to-pdf"
      accept="image/*"
      multiple={true}
      maxFiles={50}
    />
  )
}

