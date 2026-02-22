import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectLocalizacao from '../components/SelectLocalizacao';

function NovaVaga() {
  const navigate = useNavigate();
  
  // 1. localizacao e requisitos no estado inicial
  const [formData, setFormData] = useState({ 
    titulo: '', 
    descricao: '', 
    valor: '', 
    data_hora: '',
    data_hora_termino: '',
    localizacao: '', 
    requisitos: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userLogado = localStorage.getItem('user');
    
    if (!userLogado) {
      alert("Erro: Usuário não está logado!");
      return;
    }

    const user = JSON.parse(userLogado);

    try {
      const resposta = await fetch('http://localhost:8000/api/bicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...formData, empresa_id: user.id })
      });

      if (resposta.ok) {
        alert('🚀 Vaga publicada com sucesso!');
        navigate('/dashboard'); 
      } else {
        alert('Erro ao publicar a vaga. Verifique os dados.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="navbar">
        <h1 className="logo-nav">GoBicos</h1>
        <button className="btn-voltar" onClick={() => navigate('/dashboard')}>
          ← Voltar ao Painel
        </button>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '700px' }}>
        <div className="table-container">
          <h2 style={{ marginBottom: '20px' }}>Publicar Nova Vaga</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Título da Vaga</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ex: Garçom para Sábado" required />
            </div>

            {/*Localização */}
            <div className="input-group">
              <label>Localização da Vaga</label>
              <SelectLocalizacao 
                value={formData.localizacao} 
                onChange={(novoValor) => setFormData({ ...formData, localizacao: novoValor })} 
              />
            </div>
            
            <div className="input-group">
              <label>Descrição</label>
              <textarea name="descricao" rows="4" value={formData.descricao} onChange={handleChange} placeholder="Descreva as atividades e o evento..." required />
            </div>

            {/* Requisitos */}
            <div className="input-group">
              <label>Requisitos (Opcional)</label>
              <textarea name="requisitos" rows="3" value={formData.requisitos} onChange={handleChange} placeholder="Ex: Experiência de 1 ano, uniforme preto..." />
            </div>
            
            {/* Colocando Valor e Data lado a lado */}
            {/* Grid com 3 colunas para Valor, Início e Término */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div className="input-group">
                <label>Pagamento (R$)</label>
                <input type="number" name="valor" value={formData.valor} onChange={handleChange} placeholder="150.00" step="0.01" required />
              </div>
              
              <div className="input-group">
                <label>Início (Data e Hora)</label>
                <input type="datetime-local" name="data_hora"  value={formData.data_hora} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Término (Data e Hora)</label>
                <input type="datetime-local" name="data_hora_termino" value={formData.data_hora_termino} onChange={handleChange} required />
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Publicar Vaga
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default NovaVaga;