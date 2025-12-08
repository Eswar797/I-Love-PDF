import { useState } from 'react'
import FileUpload from './FileUpload'
import axios from 'axios'
import { Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { API_URL } from '../config'

export default function ToolPage({ 
  title, 
  description, 
  endpoint, 
  accept = '.pdf',
  multiple = false,
  maxFiles = 1,
  extraFields = null,
  onSuccess = null
}) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formDataToSend = new FormData()
      
      if (multiple) {
        files.forEach((file) => {
          formDataToSend.append('files', file)
        })
      } else {
        formDataToSend.append('file', files[0])
      }

      // Add extra form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })

      const response = await axios.post(`${API_URL}/${endpoint}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
      if (onSuccess) {
        onSuccess(response.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = (filename) => {
    window.open(`${API_URL}/download/${filename}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            onFilesChange={setFiles}
            accept={accept}
            multiple={multiple}
            maxFiles={maxFiles}
          />

          {extraFields && extraFields(formData, setFormData)}

          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Process PDF</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Success!</h3>
                <p className="text-green-700">{result.message}</p>
              </div>
            </div>
            
            {result.file && (
              <button
                onClick={() => downloadFile(result.file)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            )}

            {result.files && result.files.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="font-semibold text-green-800">Download Files:</p>
                {result.files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => downloadFile(file)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download {file}</span>
                  </button>
                ))}
              </div>
            )}

            {result.compressionRatio !== undefined && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  Original Size: {(result.originalSize / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-600">
                  Compressed Size: {(result.compressedSize / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm font-semibold text-green-700">
                  Compression: {result.compressionRatio}% reduction
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

