import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import GatePassIndex from './gate-pass/gate-pass-index'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GatePassIndex />} />
        <Route path="/test" element={<GatePassIndex />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
