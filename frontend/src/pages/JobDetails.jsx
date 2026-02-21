import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userLogado));
      buscarDetalhesVaga();
    }
  }, [id, navigate]);

  const buscarDetalhesVaga = async () => {
    try {
      const resposta = await fetch(`http://localhost:8000/api/bicos/${id}`);
      if (resposta.ok) {
        setVaga(await resposta.json());
      } else {
        alert("Vaga não encontrada.");
        navigate('/feed');
      }
    } catch (error) {
      console.error("Erro ao carregar a vaga:", error);
    } finally {
      setLoading(false);
    }
  };

  // REGISTRAR A CANDIDATURA NO BANCO DE DADOS
  const handleCandidatar = async () => {
    if (window.confirm("Confirmar sua candidatura para esta vaga?")) {
      try {
        const resposta = await fetch('http://localhost:8000/api/candidaturas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            freelancer_id: user.id,
            bico_id: vaga.id
          })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          alert("🎉 Candidatura enviada com sucesso! A empresa foi notificada.");
          navigate('/feed');
        } else {
          alert(`❌ Erro: ${dados.message}`);
        }
      } catch (error) {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Carregando detalhes...</div>;
  if (!vaga) return null;

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  
  // Extraindo Data e Hora separadamente para os cards
  const dataObj = new Date(vaga.data_hora);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="dashboard-layout">
      {/* HEADER SIMPLIFICADO */}
      <header className="navbar">
        <button className="btn-voltar" onClick={() => navigate('/feed')}>
          ← Voltar
        </button>
      </header>

      <main className="job-details-container">
        {/* Título e Ícone */}
        <div className="job-header-top">
          <div className="job-icon-large">🏢</div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{vaga.titulo}</h2>
            {/* NOME REAL DA EMPRESA */}
            <p className="job-company">{vaga.empresa?.name || 'Empresa Confidencial'}</p>
            <div className="job-tags">
              <span className="job-tag" style={{margin: 0}}>Temporário</span>
              <span className="tag-green">Disponível</span>
            </div>
          </div>
        </div>

        {/* Banner de Preço */}
        <div className="banner-price">
          <span>Pagamento</span>
          <h2>{formatarMoeda(vaga.valor)}</h2>
        </div>

        {/* Grid de Informações (Data, Hora, Local) */}
        <div className="info-grid-3">
          <div className="info-box">
            <span>📅</span>
            <small>Data</small>
            <p>{dataFormatada}</p>
          </div>
          <div className="info-box">
            <span>🕒</span>
            <small>Horário</small>
            <p>{horaFormatada}</p>
          </div>
          <div className="info-box">
            <span>📍</span>
            <small>Local</small>
            {/*PUXAR LOCAL REAL */}
            <p>{vaga.localizacao || 'A combinar'}</p> 
          </div>
        </div>

        {/* Descrição da Vaga */}
        <div className="content-section">
          <h3>Descrição da Vaga</h3>
          <p>{vaga.descricao}</p>
        </div>

        {/* Requisitos REAIS */}
        <div className="content-section">
          <h3>Requisitos</h3>
          {vaga.requisitos ? (
            <p style={{ whiteSpace: 'pre-line', color: '#cbd5e1', lineHeight: '1.6' }}>
              {vaga.requisitos}
            </p>
          ) : (
            <p style={{ color: '#94a3b8' }}>Não há requisitos específicos listados para esta vaga.</p>
          )}
        </div>

        {/* Sobre a Empresa REAL */}
        <div className="content-section">
          <h3>Sobre a Empresa</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            {vaga.empresa?.sobre || 'Esta empresa ainda não preencheu a seção "Sobre".'}
          </p>
        </div>
      </main>

      {/* Botão Fixo de Candidatar */}
      <div className="fixed-bottom-bar">
        <button className="btn-candidatar" onClick={handleCandidatar}>
          Candidatar-se Agora
        </button>
      </div>
    </div>
  );
}

export default JobDetails;