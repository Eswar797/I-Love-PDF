import { Link } from 'react-router-dom'
import { 
  Files, 
  Scissors, 
  Minimize2, 
  RotateCw, 
  FileX, 
  Droplet, 
  Image as ImageIcon 
} from 'lucide-react'

const tools = [
  { 
    icon: Files, 
    title: 'Merge PDF', 
    description: 'Combine multiple PDF files into one',
    path: '/merge',
    color: 'bg-blue-500'
  },
  { 
    icon: Scissors, 
    title: 'Split PDF', 
    description: 'Split a PDF into multiple files',
    path: '/split',
    color: 'bg-green-500'
  },
  { 
    icon: Minimize2, 
    title: 'Compress PDF', 
    description: 'Reduce PDF file size',
    path: '/compress',
    color: 'bg-purple-500'
  },
  { 
    icon: RotateCw, 
    title: 'Rotate PDF', 
    description: 'Rotate PDF pages',
    path: '/rotate',
    color: 'bg-orange-500'
  },
  { 
    icon: FileX, 
    title: 'Extract Pages', 
    description: 'Extract specific pages from PDF',
    path: '/extract',
    color: 'bg-red-500'
  },
  { 
    icon: Droplet, 
    title: 'Watermark', 
    description: 'Add watermark to PDF',
    path: '/watermark',
    color: 'bg-teal-500'
  },
  { 
    icon: ImageIcon, 
    title: 'Images to PDF', 
    description: 'Convert images to PDF',
    path: '/images-to-pdf',
    color: 'bg-pink-500'
  },
]

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          All the PDF tools you need
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Free online PDF tools to merge, split, compress, and convert PDFs.
          Fast, secure, and easy to use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer transform hover:-translate-y-1"
            >
              <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600">
                {tool.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

