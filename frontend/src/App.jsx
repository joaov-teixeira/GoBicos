import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import NovaVaga from './pages/NovaVaga';
import EditarVaga from './pages/EditarVaga';
import Feed from './pages/Feed';
import JobDetails from './pages/JobDetails';
import Cadastro from './pages/Cadastro';
import MinhasCandidaturas from './pages/MinhasCandidaturas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Se acessar a raiz, manda pro login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nova-vaga" element={<NovaVaga />} />
        <Route path="/editar-vaga/:id" element={<EditarVaga />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/vaga/:id" element={<JobDetails />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/minhas-candidaturas" element={<MinhasCandidaturas />} />
      </Routes>
    </Router>
  );
}

export default App;