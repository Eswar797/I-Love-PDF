import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import RotatePDF from './pages/RotatePDF'
import ExtractPages from './pages/ExtractPages'
import WatermarkPDF from './pages/WatermarkPDF'
import ProtectPDF from './pages/ProtectPDF'
import ImagesToPDF from './pages/ImagesToPDF'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge" element={<MergePDF />} />
          <Route path="/split" element={<SplitPDF />} />
          <Route path="/compress" element={<CompressPDF />} />
          <Route path="/rotate" element={<RotatePDF />} />
          <Route path="/extract" element={<ExtractPages />} />
          <Route path="/watermark" element={<WatermarkPDF />} />
          <Route path="/protect" element={<ProtectPDF />} />
          <Route path="/images-to-pdf" element={<ImagesToPDF />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

