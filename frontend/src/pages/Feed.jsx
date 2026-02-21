import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Feed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  
  // Controle do menu de logout (reaproveitado do Dashboard)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userLogado));
      buscarTodasVagas();
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const buscarTodasVagas = async () => {
    try {
      const resposta = await fetch('http://localhost:8000/api/bicos');
      if (resposta.ok) {
        const todasVagas = await resposta.json();
        // O Freelancer só deve ver vagas que estão com status "aberta"
        const vagasAbertas = todasVagas.filter(vaga => vaga.status === 'aberta');
        setVagas(vagasAbertas);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair?")) {
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:8000/api/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
      } catch (error) {
        console.error("Erro no logout.");
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
    setShowLogoutMenu(false);
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  // Lógica da Barra de Busca: filtra as vagas pelo título digitado
  const vagasFiltradas = vagas.filter(vaga => 
    vaga.titulo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  return (
    <div className="dashboard-layout">
      <header className="navbar">
        <h1 className="logo-nav">GoBicos</h1>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div className="user-profile-pill" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
            {user.name} <span style={{fontSize: '0.8em', marginLeft: '8px'}}>▼</span>
          </div>
          {showLogoutMenu && (
            <div style={{ position: 'absolute', top: '110%', right: '0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 0', zIndex: 100, minWidth: '180px' }}>
              <button onClick={() => { navigate('/minhas-candidaturas'); setShowLogoutMenu(false); }} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', display: 'block' }}>
                📄Minhas Candidaturas
              </button>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '800px' }}>
        
        <div className="feed-header-area">
          {/* BARRA DE BUSCA */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <span style={{ color: '#64748b', marginRight: '10px' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar vagas..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <button className="btn-filter">
              {/* Ícone simples de filtro */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </button>
          </div>

          <div className="feed-titles">
            <h2>Vagas em Destaque</h2>
            <p>{vagasFiltradas.length} oportunidades disponíveis</p>
          </div>
        </div>

        {/* LISTA DE VAGAS */}
        <div className="job-list">
          {loading ? (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Buscando as melhores oportunidades...</p>
          ) : vagasFiltradas.length === 0 ? (
            <div className="table-container" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#94a3b8' }}>Nenhuma vaga encontrada no momento.</p>
            </div>
          ) : (
            vagasFiltradas.map((vaga) => (
              <div 
                key={vaga.id} 
                className="job-card"
                onClick={() => navigate(`/vaga/${vaga.id}`)}
              >
                <div className="job-card-header">
                  <div>
                    <h3>{vaga.titulo}</h3>
                    {/* NOME DA EMPRESA REAL */}
                    <p className="job-company">{vaga.empresa?.name || 'Empresa Confidencial'}</p> 
                  </div>
                  <span style={{ color: '#64748b' }}>›</span>
                </div>
                
                <div className="job-infos">
                  <span className="job-price">{formatarMoeda(vaga.valor)}</span>
                  <span>📅 {formatarData(vaga.data_hora)}</span>
                  {/* LOCALIZAÇÃO REAL */}
                  <span>📍 {vaga.localizacao || 'A combinar'}</span>
                </div>

                <span className="job-tag">Temporário</span>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

export default Feed;