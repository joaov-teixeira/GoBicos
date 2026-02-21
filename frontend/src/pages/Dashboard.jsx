import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vagas, setVagas] = useState([]);
  
  // NOVOS ESTADOS PARA AS CANDIDATURAS E O MODAL
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagaSelecionadaModal, setVagaSelecionadaModal] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      const usuario = JSON.parse(userLogado);
      setUser(usuario);
      buscarVagasECandidaturas(usuario.id);
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowLogoutMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const buscarVagasECandidaturas = async (empresaId) => {
    try {
      // Busca as Vagas
      const resVagas = await fetch('http://localhost:8000/api/bicos');
      const todasVagas = await resVagas.json();
      const minhasVagas = todasVagas.filter(v => v.empresa_id === empresaId);
      setVagas(minhasVagas);

      // Busca as Candidaturas
      const resCandidaturas = await fetch('http://localhost:8000/api/candidaturas');
      const todasCandidaturas = await resCandidaturas.json();
      setCandidaturas(todasCandidaturas);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { /* Código de logout mantido... */
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const alternarStatus = async (vagaAtual) => { /* Código mantido... */
    const novoStatus = vagaAtual.status === 'aberta' ? 'fechada' : 'aberta';
    await fetch(`http://localhost:8000/api/bicos/${vagaAtual.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: novoStatus })
    });
    setVagas(vagas.map(v => v.id === vagaAtual.id ? { ...v, status: novoStatus } : v));
  };

  const deletarVaga = async (id) => { /* Código mantido... */
    if (window.confirm("Excluir esta vaga definitivamente?")) {
      await fetch(`http://localhost:8000/api/bicos/${id}`, { method: 'DELETE' });
      setVagas(vagas.filter(v => v.id !== id));
    }
  };

  // ===============================================
  // FUNÇÃO APROVAR OU RECUSAR FREELANCER
  // ===============================================
  const atualizarStatusCandidatura = async (candidaturaId, novoStatus) => {
    if(window.confirm(`Deseja marcar este candidato como ${novoStatus.toUpperCase()}?`)) {
      try {
        const resposta = await fetch(`http://localhost:8000/api/candidaturas/${candidaturaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: novoStatus })
        });

        if (resposta.ok) {
          // Atualiza a lista de candidaturas localmente para a tela piscar na mesma hora
          setCandidaturas(candidaturas.map(c => c.id === candidaturaId ? { ...c, status: novoStatus } : c));
        } else {
          alert("Erro ao atualizar a candidatura.");
        }
      } catch (error) {
        alert("Erro de conexão.");
      }
    }
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  // Cálculos dinâmicos para os cards do Topo!
  const vagasAtivas = vagas.filter(v => v.status === 'aberta').length;
  // Pegamos apenas os candidatos que se inscreveram nas vagas dessa empresa
  const meusCandidatos = candidaturas.filter(c => vagas.some(v => v.id === c.bico_id));

  // Filtra as candidaturas específicas da vaga que está aberta no Modal
  const candidaturasDaVagaModal = vagaSelecionadaModal 
    ? candidaturas.filter(c => c.bico_id === vagaSelecionadaModal.id)
    : [];

  return (
    <div className="dashboard-layout">
      <header className="navbar">
        <h1 className="logo-nav">GoBicos</h1>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div className="user-profile-pill" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
            {user.name} <span style={{fontSize: '0.8em', marginLeft: '8px'}}>▼</span>
          </div>
          {showLogoutMenu && (
            <div style={{ position: 'absolute', top: '110%', right: '0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 0', zIndex: 100, minWidth: '120px' }}>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', width: '100%', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>🚪 Sair</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Painel de Controle</h2>
            <p>Gerencie as vagas publicadas por <strong>{user.name}</strong></p>
          </div>
          <button className="btn-nova-vaga" onClick={() => navigate('/nova-vaga')}>+ Nova Vaga</button>
        </div>

        {/* ESTATÍSTICAS REAIS! */}
        <div className="stats-grid">
          <div className="stat-card">
            <span>Vagas Ativas</span>
            <h3>{vagasAtivas}</h3>
          </div>
          <div className="stat-card">
            <span>Total Candidatos</span>
            <h3>{meusCandidatos.length}</h3>
          </div>
          <div className="stat-card">
            <span>Aprovações Pendentes</span>
            <h3 style={{color: '#f97316'}}>{meusCandidatos.filter(c => c.status === 'pendente').length}</h3>
          </div>
        </div>

        <div className="table-container">
          <h3>Minhas Vagas Publicadas</h3>
          
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Carregando suas vagas...</p>
          ) : (
            <table className="vagas-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Candidatos</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>Nenhuma vaga publicada.</td></tr>
                ) : (
                  vagas.map((vaga) => {
                    // Conta quantos candidatos ESSA vaga tem
                    const totalDestaVaga = candidaturas.filter(c => c.bico_id === vaga.id).length;
                    
                    return (
                      <tr key={vaga.id} style={{ opacity: vaga.status === 'fechada' ? 0.6 : 1 }}>
                        <td>{vaga.titulo}</td>
                        <td>
                          <span className={`badge ${vaga.status === 'aberta' ? 'badge-aberta' : ''}`} style={vaga.status === 'fechada' ? {backgroundColor: '#334155', color: '#94a3b8'} : {}}>
                            {vaga.status === 'aberta' ? 'Aberta' : 'Fechada'}
                          </span>
                        </td>
                        
                        {/* BOTÃO PARA ABRIR O MODAL DE CANDIDATOS */}
                        <td>
                          <button 
                            onClick={() => setVagaSelecionadaModal(vaga)}
                            style={{ background: 'transparent', border: 'none', color: totalDestaVaga > 0 ? '#f97316' : '#94a3b8', cursor: totalDestaVaga > 0 ? 'pointer' : 'default', fontWeight: 'bold' }}
                            disabled={totalDestaVaga === 0}
                          >
                            👥 {totalDestaVaga}
                          </button>
                        </td>
                        
                        <td>{formatarData(vaga.data_hora)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => alternarStatus(vaga)} style={{ background: 'transparent', color: vaga.status === 'aberta' ? '#eab308' : '#22c55e', border: 'none', cursor: 'pointer', marginRight: '15px' }}>
                            {vaga.status === 'aberta' ? '⏸️ Pausar' : '▶️ Reabrir'}
                          </button>
                          <button onClick={() => navigate(`/editar-vaga/${vaga.id}`)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', marginRight: '15px' }}>✏️ Editar</button>
                          <button onClick={() => deletarVaga(vaga.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>🗑️ Excluir</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ==============================================
          MODAL DE CANDIDATOS (oculto até clicar) 
          ============================================== */}
      {vagaSelecionadaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Candidatos: {vagaSelecionadaModal.titulo}</h3>
              <button className="btn-close" onClick={() => setVagaSelecionadaModal(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              {candidaturasDaVagaModal.map(cand => (
                <div key={cand.id} className="candidate-item" style={{ borderLeft: cand.status === 'aprovada' ? '4px solid #22c55e' : cand.status === 'recusada' ? '4px solid #ef4444' : '4px solid #eab308' }}>
                  <div className="candidate-item-header">
                    <div>
                      <h4>{cand.freelancer?.name || 'Freelancer'}</h4>
                      <p>📍 {cand.freelancer?.localizacao || 'Sem localização'}</p>
                    </div>
                    {/* Etiqueta atual do candidato */}
                    <span className={`badge badge-${cand.status}`} style={{ fontSize: '0.7rem' }}>
                      {cand.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p style={{ color: '#cbd5e1', fontStyle: 'italic', margin: '10px 0' }}>
                    "{cand.freelancer?.sobre || 'Nenhuma descrição informada pelo candidato.'}"
                  </p>

                  {/* Botões de Ação (só mostra se ainda estiver pendente) */}
                  {cand.status === 'pendente' && (
                    <div className="candidate-actions">
                      <button className="btn-aprovar" onClick={() => atualizarStatusCandidatura(cand.id, 'aprovada')}>✅ Aprovar</button>
                      <button className="btn-recusar" onClick={() => atualizarStatusCandidatura(cand.id, 'recusada')}>❌ Recusar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;