import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectLocalizacao from '../components/SelectLocalizacao';

function Feed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Estados de Dados
  const [vagas, setVagas] = useState([]);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  
  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('explorar'); // 'explorar' ou 'candidaturas'
  
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  //Filtro de região ativado por padrão
  const [cidadeFiltro, setCidadeFiltro] = useState('');

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      const usuario = JSON.parse(userLogado);
      setUser(usuario);
      setCidadeFiltro(usuario.localizacao || '');
      buscarDadosIniciais(usuario.id);

    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowLogoutMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  useEffect(() => {
    if (abaAtiva === 'explorar') {
      const delayDebounceFn = setTimeout(() => { buscarVagas(termoBusca); }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [termoBusca, abaAtiva]);

  // Busca Vagas e Candidaturas ao mesmo tempo
  const buscarDadosIniciais = async (freelancerId) => {
    setLoading(true);
    try {
      await buscarVagas('');
      
      const resCand = await fetch('http://localhost:8000/api/candidaturas');
      if (resCand.ok) {
        const todasCandidaturas = await resCand.json();
        const filtradas = todasCandidaturas.filter(c => c.freelancer_id === freelancerId);
        filtradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setMinhasCandidaturas(filtradas);
      }
    } catch (error) { console.error("Erro", error); }
    finally { setLoading(false); }
  };

  const buscarVagas = async (termo = '') => {
    try {
      const resposta = await fetch(`http://localhost:8000/api/bicos?search=${termo}`);
      if (resposta.ok) {
        const todasVagas = await resposta.json();
        setVagas(todasVagas.filter(vaga => vaga.status === 'aberta'));
      }
    } catch (error) { console.error("Erro", error); }
  };

  const handleLogout = async () => { /* Logout mantido */
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
    }
  };

  // Funções de formatação
  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const formatarHora = (dataString) => new Date(dataString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // ==========================================
  // LÓGICA DO FILTRO DE LOCALIZAÇÃO
  // ==========================================
  const vagasParaExibir = vagas.filter(vaga => {
    // Se o filtro de cidade estiver vazio (usuário limpou), mostra o Brasil todo
    if (!cidadeFiltro) return true;
    
    const busca = cidadeFiltro.toLowerCase().trim();
    const localDaVaga = (vaga.localizacao || '').toLowerCase().trim();
    
    return localDaVaga.includes(busca) || busca.includes(localDaVaga);
  });

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* HEADER PADRONIZADO */}
      <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="logo-nav">GoBicos</h1>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div className="user-profile-pill" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
            {user.name} <span style={{fontSize: '0.8em', marginLeft: '8px'}}>▼</span>
          </div>
          {showLogoutMenu && (
            <div style={{ position: 'absolute', top: '110%', right: '0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 0', zIndex: 100, minWidth: '180px' }}>
              <button onClick={() => { navigate('/perfil'); setShowLogoutMenu(false); }} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>👤 Meu Perfil</button>
              <button onClick={() => { setAbaAtiva('candidaturas'); setShowLogoutMenu(false); }} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', display: 'block' }}>
                📄Minhas Candidaturas
              </button>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>🚪 Sair</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '800px' }}>
        
        {/* AS NOVAS ABAS */}
        <div className="nav-tabs">
          <button className={`nav-tab-btn ${abaAtiva === 'explorar' ? 'active' : ''}`} onClick={() => setAbaAtiva('explorar')}>
            🔍 Explorar Vagas
          </button>
          <button className={`nav-tab-btn ${abaAtiva === 'candidaturas' ? 'active' : ''}`} onClick={() => setAbaAtiva('candidaturas')}>
            📄 Minhas Candidaturas {minhasCandidaturas.length > 0 && `(${minhasCandidaturas.length})`}
          </button>
        </div>

        {/* CONTEÚDO DA ABA: EXPLORAR VAGAS */}
        {abaAtiva === 'explorar' && (
          <>
            <div className="feed-header-area">
              <div className="search-bar-container">
                {/* 1. Barra de Pesquisa (Agora ocupa 100% da largura) */}
                <div className="search-input-wrapper">
                  <span style={{ color: '#64748b', marginRight: '10px', fontSize: '1.2rem' }}>🔍</span>
                  <input type="text" placeholder="Buscar vagas por título, cargo..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} style={{ fontSize: '1rem' }} />
                </div>
                
                {/* 2. Filtro de Localização (Na linha de baixo) */}
                <div className="location-filter-container">
                  <label className="location-filter-label">
                    📍 Filtrar por localização
                  </label>
                  
                  <div className="location-filter-controls">
                    {/* Componente do IBGE */}
                    <SelectLocalizacao 
                      value={cidadeFiltro} 
                      onChange={(val) => setCidadeFiltro(val)} 
                    />
                    
                    {/* Botões de ação */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => setCidadeFiltro('')}
                        style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        title="Ver vagas de todo o Brasil"
                      >
                        Limpar Filtro
                      </button>
                      
                      {cidadeFiltro !== user?.localizacao && user?.localizacao && (
                        <button 
                          onClick={() => setCidadeFiltro(user.localizacao)}
                          style={{ background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', whiteSpace: 'nowrap' }}
                        >
                          Voltar para {user.localizacao}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="job-list">
              {/* ATENÇÃO AQUI: Trocamos 'vagas' por 'vagasParaExibir' e 'vagas.length' por 'vagasParaExibir.length' */}
              {loading ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>Buscando oportunidades...</p> : vagasParaExibir.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>Nenhuma vaga encontrada para esta região.</p> : (
                vagasParaExibir.map((vaga) => (
                  <div key={vaga.id} className="job-card" onClick={() => navigate(`/vaga/${vaga.id}`)}>
                    <div className="job-card-header">
                      <div>
                        <h3>{vaga.titulo}</h3>
                        <p className="job-company" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {vaga.empresa?.name || 'Empresa'} <span style={{ color: '#eab308', fontWeight: 'bold' }}>⭐ {vaga.empresa?.nota_media > 0 ? vaga.empresa.nota_media : 'Novo'}</span>
                        </p> 
                      </div>
                      <span style={{ color: '#64748b' }}>›</span>
                    </div>
                    <div className="job-infos">
                      <span className="job-price">{formatarMoeda(vaga.valor)}</span>
                      <span>📅 {formatarData(vaga.data_hora)} • {formatarHora(vaga.data_hora)} {vaga.data_hora_termino ? ` às ${formatarHora(vaga.data_hora_termino)}` : ''}</span>
                      <span>📍 {vaga.localizacao || 'A combinar'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* CONTEÚDO DA ABA: MINHAS CANDIDATURAS */}
        {abaAtiva === 'candidaturas' && (
          <div className="job-list">
            {minhasCandidaturas.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>Você ainda não se candidatou a nenhuma vaga.</p>
            ) : (
              minhasCandidaturas.map((cand) => (
                <div key={cand.id} className="candidatura-card">
                  <div className="candidatura-top">
                    <div className="candidatura-info">
                      <h3>{cand.bico?.titulo || 'Vaga Removida'}</h3>
                      <p>{cand.bico?.empresa?.name || 'Empresa Desconhecida'}</p>
                      <div className="candidatura-price-date" style={{ marginTop: '8px' }}>
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

                  {cand.status === 'aprovada' && (
                    <div className="candidatura-footer" style={{ borderTop: '1px solid #334155', paddingTop: '15px', marginTop: '15px', textAlign: 'right' }}>
                      <button onClick={() => navigate(`/chat/${cand.id}`)} style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
                        💬 Abrir Chat
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Feed;