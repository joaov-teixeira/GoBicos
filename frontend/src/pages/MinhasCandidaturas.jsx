import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MinhasCandidaturas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      const usuario = JSON.parse(userLogado);
      setUser(usuario);
      buscarCandidaturas(usuario.id);
    }
  }, [navigate]);

  const buscarCandidaturas = async (freelancerId) => {
    try {
      const resposta = await fetch('http://localhost:8000/api/candidaturas');
      if (resposta.ok) {
        const todasCandidaturas = await resposta.json();
        // Filtra para pegar apenas as candidaturas do Freelancer logado
        const filtradas = todasCandidaturas.filter(c => c.freelancer_id === freelancerId);
        
        // Ordena para as mais recentes aparecerem primeiro
        filtradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setMinhasCandidaturas(filtradas);
      }
    } catch (error) {
      console.error("Erro ao buscar candidaturas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const formatarDataCompleta = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  // Calculando os totais para os Cards do topo
  const totalPendentes = minhasCandidaturas.filter(c => c.status === 'pendente').length;
  const totalAprovadas = minhasCandidaturas.filter(c => c.status === 'aprovada').length;
  const totalRecusadas = minhasCandidaturas.filter(c => c.status === 'recusada').length;

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <header className="navbar">
        <button className="btn-voltar" onClick={() => navigate('/feed')}>
          ← Voltar ao Feed
        </button>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '800px' }}>
        
        <div className="candidaturas-header">
          <h2>Minhas Candidaturas</h2>
          <p>{minhasCandidaturas.length} vagas candidatadas</p>
        </div>

        {/* CARDS DE STATUS */}
        <div className="status-tabs">
          <div className="status-tab">
            <h3>{totalPendentes}</h3>
            <span>Pendentes</span>
          </div>
          <div className="status-tab">
            <h3>{totalAprovadas}</h3>
            <span>Aprovadas</span>
          </div>
          <div className="status-tab">
            <h3>{totalRecusadas}</h3>
            <span>Recusadas</span>
          </div>
        </div>

        {/* LISTA DE CANDIDATURAS */}
        <div>
          {loading ? (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Carregando seu histórico...</p>
          ) : minhasCandidaturas.length === 0 ? (
            <div className="table-container" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#94a3b8' }}>Você ainda não se candidatou a nenhuma vaga.</p>
              <button className="btn-primary" style={{width: 'auto', padding: '10px 20px', marginTop: '15px'}} onClick={() => navigate('/feed')}>
                Explorar Vagas
              </button>
            </div>
          ) : (
            minhasCandidaturas.map((cand) => (
              <div key={cand.id} className="candidatura-card">
                <div className="candidatura-top">
                  <div className="candidatura-info">
                    <h3>{cand.bico?.titulo || 'Vaga Removida'}</h3>
                    <p>{cand.bico?.empresa?.name || 'Empresa Desconhecida'}</p>
                    
                    <div className="candidatura-price-date">
                      <span className="valor-texto">{formatarMoeda(cand.bico?.valor || 0)}</span>
                      <span>📅 {formatarData(cand.bico?.data_hora || new Date())}</span>
                    </div>
                  </div>
                  
                  {/* Etiqueta Dinâmica de Status */}
                  <span className={`badge badge-${cand.status}`}>
                    {cand.status === 'pendente' && '⏳ Pendente'}
                    {cand.status === 'aprovada' && '✅ Aprovada'}
                    {cand.status === 'recusada' && '❌ Recusada'}
                  </span>
                </div>

                <div className="candidatura-footer">
                  Candidatura enviada em {formatarDataCompleta(cand.created_at)}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

export default MinhasCandidaturas;