import { Code2, Share2, Zap, Shield, Clock, Users, Edit3, FileText } from "lucide-react"
import TextEditor from "./TextEditor"
import { useNavigate } from "react-router"

const Home = () => {
  const navigate = useNavigate()

  const generateRandomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const handleStartEditing = () => {
    const randomId = generateRandomId()
    navigate(`/${randomId}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono overflow-x-hidden custom-scrollbar">
      {/* Navigation - matches editor header */}
      <nav className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex items-center space-x-2 min-w-0">
            <img src="sharemecode.png" width={30} height={30} alt="logo" />
              <span className="text-gray-300 font-medium truncate">ShareMeCode</span>
            </div>
          </div>
          <button
            onClick={handleStartEditing}
            className="bg-blue-400 hover:bg-gray-200 hover:text-gray-900 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex-shrink-0 ml-4"
          >
            New Document
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text break-words overflow-hidden">Share Code & Text Instantly</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-sans">
            Fast, free, and secure online editor for sharing code snippets and plain text. No registration required -
            just paste, edit, and share!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleStartEditing}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Start Editing</span>
            </button>
            <div className="flex items-center text-gray-400 text-sm flex-wrap justify-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-green-500">Encrypted</span>
              <span className="mx-2">•</span>
              <span>No signup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-100">Why Choose ShareMeCode?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="bg-gray-900 p-6 rounded border border-gray-700 hover:border-gray-600 transition-colors duration-200">
              <Zap className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3 text-gray-100">Lightning Fast</h3>
              <p className="text-gray-300 text-sm font-sans">
                Instantly create shareable links for your code and text. No waiting, no loading screens.
              </p>
            </article>
            <article className="bg-gray-900 p-6 rounded border border-gray-700 hover:border-gray-600 transition-colors duration-200">
              <Share2 className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3 text-gray-100">Easy Sharing</h3>
              <p className="text-gray-300 text-sm font-sans">
                Share your code snippets or text with anyone using secure, unique URLs.
              </p>
            </article>
            <article className="bg-gray-900 p-6 rounded border border-gray-700 hover:border-gray-600 transition-colors duration-200">
              <Clock className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3 text-gray-100">Auto-Save</h3>
              <p className="text-gray-300 text-sm font-sans">
                Your work is automatically saved as you type. Never lose your progress again.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-100">See It In Action</h2>
          <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden min-h-96 custom-scrollbar">
            <div className="overflow-auto min-h-9 6custom-scrollbar">
              <TextEditor />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-16 bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-100">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <article className="flex items-start space-x-4">
                <Code2 className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-100 mb-2">Code Snippets</h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Share JavaScript, Python, HTML, CSS, and any other code with proper formatting.
                  </p>
                </div>
              </article>
              <article className="flex items-start space-x-4">
                <Users className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-100 mb-2">Team Collaboration</h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Perfect for code reviews, debugging sessions, and sharing solutions with teammates.
                  </p>
                </div>
              </article>
            </div>
            <div className="space-y-6">
              <article className="flex items-start space-x-4">
                <FileText className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-100 mb-2">Quick Notes</h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Share plain text, notes, configurations, or any text content that needs quick access.
                  </p>
                </div>
              </article>
              <article className="flex items-start space-x-4">
                <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-100 mb-2">Secure Sharing</h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Each share gets a unique URL that's hard to guess, keeping your content secure.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 border-t border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100">Ready to Start Sharing?</h2>
          <p className="text-base mb-8 text-gray-300 font-sans">
            Join thousands of developers who trust ShareMeCode for their daily code sharing needs.
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded font-medium text-sm transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Start Editing - It's Free!</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="sharemecode.png" width={30} height={30} alt="logo" />
            <span className="text-base font-medium text-gray-300">ShareMeCode</span>
          </div>
          <p className="text-gray-400 text-sm font-sans">
            Fast, free, and secure code & text sharing tool. Built with ❤️ for developers.
          </p>
          <p className="text-gray-500 text-xs mt-3 font-sans">© 2025 ShareMeCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
