import ToolPage from '../components/ToolPage'

export default function CompressPDF() {
  return (
    <ToolPage
      title="Compress PDF"
      description="Reduce the file size of your PDF documents"
      endpoint="compress"
      multiple={false}
    />
  )
}

