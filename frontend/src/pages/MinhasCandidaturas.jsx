import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function MinhasCandidaturas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Menu Suspenso (Dropdown)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      const usuario = JSON.parse(userLogado);
      setUser(usuario);
      buscarCandidaturas(usuario.id);
    }

    // Fechar o menu se clicar fora
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const buscarCandidaturas = async (freelancerId) => {
    try {
      const resposta = await fetch('http://localhost:8000/api/candidaturas');
      if (resposta.ok) {
        const todasCandidaturas = await resposta.json();
        const filtradas = todasCandidaturas.filter(c => c.freelancer_id === freelancerId);
        filtradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setMinhasCandidaturas(filtradas);
      }
    } catch (error) {
      console.error("Erro ao buscar candidaturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
    setShowLogoutMenu(false);
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const formatarDataCompleta = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalPendentes = minhasCandidaturas.filter(c => c.status === 'pendente').length;
  const totalAprovadas = minhasCandidaturas.filter(c => c.status === 'aprovada').length;
  const totalRecusadas = minhasCandidaturas.filter(c => c.status === 'recusada').length;

  return (
    <div className="dashboard-layout">
      {/* HEADER PADRONIZADO E COMPLETO */}
      <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-voltar-pill" onClick={() => navigate('/feed')}>
          ← Voltar ao Feed
        </button>
        
        {/* Menu do Usuário */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div className="user-profile-pill" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
            {user.name} <span style={{fontSize: '0.8em', marginLeft: '8px'}}>▼</span>
          </div>
          {showLogoutMenu && (
            <div style={{ position: 'absolute', top: '110%', right: '0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 0', zIndex: 100, minWidth: '180px' }}>
              <button onClick={() => { navigate('/perfil'); setShowLogoutMenu(false); }} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', display: 'block' }}>
                👤 Meu Perfil
              </button>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '800px' }}>
        
        <div className="candidaturas-header">
          <h2>Minhas Candidaturas</h2>
          <p>{minhasCandidaturas.length} vagas candidatadas</p>
        </div>

        <div className="status-tabs">
          <div className="status-tab"><h3>{totalPendentes}</h3><span>Pendentes</span></div>
          <div className="status-tab"><h3>{totalAprovadas}</h3><span>Aprovadas</span></div>
          <div className="status-tab"><h3>{totalRecusadas}</h3><span>Recusadas</span></div>
        </div>

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
                  <span className={`badge badge-${cand.status}`}>
                    {cand.status === 'pendente' && '⏳ Pendente'}
                    {cand.status === 'aprovada' && '✅ Aprovada'}
                    {cand.status === 'recusada' && '❌ Recusada'}
                  </span>
                </div>

                <div className="candidatura-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Candidatura enviada em {formatarDataCompleta(cand.created_at)}</span>
                  
                  {cand.status === 'aprovada' && (
                    <button 
                      onClick={() => navigate(`/chat/${cand.id}`)}
                      style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: '0.2s' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                    >
                      💬 Abrir Chat
                    </button>
                  )}
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