import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditarVaga() {
  const { id } = useParams(); // Pega o ID da vaga direto da URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    valor: '',
    data_hora: ''
  });
  const [loading, setLoading] = useState(true);

  // Passo 1: Buscar os dados atuais da vaga ao abrir a página
  useEffect(() => {
    const carregarVaga = async () => {
      try {
        const resposta = await fetch(`http://localhost:8000/api/bicos/${id}`);
        if (resposta.ok) {
          const dadosVaga = await resposta.json();
          // Preenche o formulário com o que já existe no banco
          setFormData({
            titulo: dadosVaga.titulo,
            descricao: dadosVaga.descricao,
            valor: dadosVaga.valor,
            // Ajuste para o formato que o input datetime-local entende
            data_hora: dadosVaga.data_hora.substring(0, 16) 
          });
        } else {
          alert("Erro ao carregar dados da vaga.");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarVaga();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Passo 2: Enviar as alterações (Método PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch(`http://localhost:8000/api/bicos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        alert('✅ Vaga atualizada com sucesso!');
        navigate('/dashboard');
      } else {
        alert('Erro ao atualizar a vaga.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  };

  if (loading) return <div style={{color: 'white', padding: '20px'}}>Carregando dados...</div>;

  return (
    <div className="dashboard-layout">
      <header className="navbar">
        <h1 className="logo-nav">GoBicos</h1>
        <button className="btn-voltar" onClick={() => navigate('/dashboard')}>
          ← Cancelar Edição
        </button>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '700px' }}>
        <div className="table-container">
          <h2 style={{ marginBottom: '20px' }}>Editar Vaga</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Título da Vaga</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label>Descrição</label>
              <textarea name="descricao" rows="4" value={formData.descricao} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label>Pagamento (R$)</label>
              <input type="number" name="valor" value={formData.valor} onChange={handleChange} step="0.01" required />
            </div>
            
            <div className="input-group">
              <label>Data e Hora</label>
              <input type="datetime-local" name="data_hora" value={formData.data_hora} onChange={handleChange} required />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
              Salvar Alterações
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditarVaga;