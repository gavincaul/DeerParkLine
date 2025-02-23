import './App.css';
import Home from './pages/Home.js'
import About from './pages/About.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/about" element={<About />}/>
          <Route exact path="*" element={<Home />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;