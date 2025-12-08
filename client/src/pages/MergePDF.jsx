import ToolPage from '../components/ToolPage'

export default function MergePDF() {
  return (
    <ToolPage
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      endpoint="merge"
      multiple={true}
      maxFiles={20}
    />
  )
}

