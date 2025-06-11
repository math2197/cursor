import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Perfil from './pages/Perfil';
import Processos from './pages/Processos';
import ProcessoDetalhes from './pages/ProcessoDetalhes';
import './App.css';

// Placeholders para as páginas principais
const Clientes = () => <div><h2>Clientes</h2></div>;
const Etiquetas = () => <div><h2>Etiquetas</h2></div>;
const Tarefas = () => <div><h2>Tarefas</h2></div>;
const Relatorios = () => <div><h2>Relatórios</h2></div>;
const Admin = () => <div><h2>Administração</h2></div>;
const AlterarSenha = () => <div><h2>Alterar Senha (em breve)</h2></div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="processos" element={<Processos />} />
                  <Route path="processos/:id" element={<ProcessoDetalhes />} />
                  <Route path="clientes" element={<Clientes />} />
                  <Route path="etiquetas" element={<Etiquetas />} />
                  <Route path="tarefas" element={<Tarefas />} />
                  <Route path="relatorios" element={<Relatorios />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="perfil" element={<Perfil />} />
                  <Route path="alterar-senha" element={<AlterarSenha />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 