import { Link, useLocation } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()

  const navItems = [
    { path: '/merge', label: 'Merge PDF' },
    { path: '/split', label: 'Split PDF' },
    { path: '/compress', label: 'Compress PDF' },
    { path: '/rotate', label: 'Rotate PDF' },
    { path: '/extract', label: 'Extract Pages' },
    { path: '/watermark', label: 'Watermark' },
    { path: '/images-to-pdf', label: 'Images to PDF' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700">
              <Heart className="w-8 h-8 fill-red-500 text-red-500" />
              <span>I Love PDF</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 mb-2">
            © I Love PDF Clone. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with ❤️ by <span className="font-semibold text-gray-700">Eswar Narayana</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

