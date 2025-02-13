import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LaunchPage from '@/pages/LaunchPage'
import AgentView from '@/pages/AgentView'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/agent/:id" element={<AgentView />} />
      </Routes>
    </Router>
  )
}

export default App
