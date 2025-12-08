import ToolPage from '../components/ToolPage'

export default function SplitPDF() {
  return (
    <ToolPage
      title="Split PDF"
      description="Split a PDF file into separate pages"
      endpoint="split"
      multiple={false}
    />
  )
}

