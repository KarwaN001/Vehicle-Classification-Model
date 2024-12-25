import { useState, useRef, useEffect } from 'react'
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import About from './components/About'
import './App.css'

function Home({ fileInputRef, imagePreview, result, handleImageChange, predict }) {
  return (
    <div className="container">
      <h1>Vehicle Classification Model</h1>
      <div className="file-input-wrapper">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button className="buttonn" onClick={predict}>
        {result === 'Processing...' ? 'Processing...' : 'Predict Vehicle Type'}
      </button>

      <div className={`result ${result === 'Processing...' ? 'processing' : ''}`}>
        {result}
      </div>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="image-preview"
        />
      )}
    </div>
  )
}

function App() {
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.body.className = prefersDark ? 'dark' : 'light'
  }, [])

  const toggleTheme = () => {
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.classList.add('changing');
    
    setDarkMode(!darkMode);
    document.body.className = !darkMode ? 'dark' : 'light';

    setTimeout(() => {
      themeButton.classList.remove('changing');
    }, 600);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const predict = async () => {
    if (!fileInputRef.current?.files?.length) {
      setResult('Please select an image file first.')
      return
    }

    setResult('Processing...')
    const resultElement = document.querySelector('.result')
    resultElement?.classList.add('processing')

    const formData = new FormData()
    formData.append('file', fileInputRef.current.files[0])

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server Error (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      setResult(`Predicted Vehicle Class: ${data.predicted_class} <br> Probability: ${(data.probability * 100).toFixed(3)}%`)
    } catch (error) {
      console.error('Prediction error:', error)
      setResult(`Error: ${error.message}`)
    } finally {
      resultElement?.classList.remove('processing')
    }
  }

  return (
    <Router>
      <div className="app-wrapper">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-text">AI Vehicle</span>
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <button 
                className="theme-toggle" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                {darkMode ? <RiSunLine size={24} /> : <RiMoonClearLine size={24} />}
              </button>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Home 
                fileInputRef={fileInputRef}
                imagePreview={imagePreview}
                result={result}
                handleImageChange={handleImageChange}
                predict={predict}
              />
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>AI Vehicle Classifier</h3>
              <p>Experience the future of vehicle recognition with our advanced AI technology. 
                 Instant, accurate classification powered by state-of-the-art deep learning.</p>
              <div className="footer-badges">
                <span className="tech-badge">React</span>
                <span className="tech-badge">Python</span>
                <span className="tech-badge">AI</span>
              </div>
            </div>
            
            <div className="footer-section links">
              <h3>Quick Links</h3>
              <div className="quick-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AI Vehicle Classifier</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
