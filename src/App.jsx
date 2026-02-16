import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-green-600">
            Frontend MedSoils
          </h1>
          <p className="text-center mt-4 text-gray-700">
            Aplicación corriendo en el puerto 3017
          </p>
        </div>
      </div>
    </Router>
  )
}

export default App
