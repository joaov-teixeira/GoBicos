import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Chat() {
  const { id } = useParams(); // ID da candidatura
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  
  // Estados para a Avaliação
  const [mostrarAvaliacao, setMostrarAvaliacao] = useState(false);
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [avaliadoId, setAvaliadoId] = useState(null);
  
  const mensagensFimRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) return navigate('/login');
    const usuario = JSON.parse(userLogado);
    setUser(usuario);

    buscarMensagensEDetalhes(usuario);

    const intervalo = setInterval(() => {
      buscarMensagens();
    }, 3000);

    return () => clearInterval(intervalo);
  }, [id, navigate]);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const buscarMensagens = async () => {
    try {
      const resposta = await fetch(`http://localhost:8000/api/candidaturas/${id}/mensagens`);
      if (resposta.ok) setMensagens(await resposta.json());
    } catch (error) { console.error("Erro no chat", error); }
  };

  const buscarMensagensEDetalhes = async (usuarioAtual) => {
    buscarMensagens();
    try {
      const resCandidatura = await fetch('http://localhost:8000/api/candidaturas');
      const candidaturas = await resCandidatura.json();
      const minhaCandidatura = candidaturas.find(c => c.id === parseInt(id));
      
      if (minhaCandidatura) {
        if (usuarioAtual.tipo === 'freelancer') {
          setAvaliadoId(minhaCandidatura.bico.empresa_id);
        } else {
          setAvaliadoId(minhaCandidatura.freelancer_id);
        }
      }
    } catch (error) { console.error("Erro ao carregar detalhes", error); }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    try {
      const resposta = await fetch(`http://localhost:8000/api/candidaturas/${id}/mensagens`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remetente_id: user.id, conteudo: novaMensagem })
      });
      if (resposta.ok) {
        setNovaMensagem('');
        buscarMensagens();
      }
    } catch (error) { alert("Erro ao enviar."); }
  };

  const enviarAvaliacao = async () => {
    if (nota === 0) return alert("Selecione pelo menos 1 estrela!");
    
    try {
      const resposta = await fetch('http://localhost:8000/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          candidatura_id: id,
          avaliador_id: user.id,
          avaliado_id: avaliadoId,
          nota: nota
        })
      });

      if (resposta.ok) {
        alert("⭐ Avaliação enviada com sucesso! Obrigado pelo feedback.");
        setMostrarAvaliacao(false);
      } else {
        const dados = await resposta.json();
        alert(`❌ Erro: ${dados.message}`);
      }
    } catch (error) {
      alert("Erro ao enviar avaliação.");
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      
      {/* HEADER DO CHAT */}
      <header className="navbar">
        <button className="btn-voltar-pill" onClick={() => navigate(-1)}>← Voltar</button>
        <h2 style={{ fontSize: '1.2rem', marginLeft: '15px' }}>💬 Chat e Avaliação</h2>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '8px 16px', width: 'auto', marginBottom: 0, backgroundColor: '#eab308' }}
            onClick={() => setMostrarAvaliacao(!mostrarAvaliacao)}
          >
            ⭐ Avaliar Parceiro
          </button>
        </div>
      </header>

      {/* ÁREA PRINCIPAL DO CHAT */}
      <main className="dashboard-content" style={{ maxWidth: 'none', padding: '20px 0 0 0', alignItems: 'stretch' }}>
        <div className="chat-layout-container">
          
          {/* CAIXA DE AVALIAÇÃO */}
          {mostrarAvaliacao && (
            <div style={{ padding: '0 20px' }}>
              <div className="rating-container">
                <p style={{ color: 'white', fontWeight: 'bold' }}>Como foi a experiência?</p>
                <div className="stars-group">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <span 
                      key={estrela}
                      className={`star ${(hoverNota || nota) >= estrela ? 'active' : ''}`}
                      onMouseEnter={() => setHoverNota(estrela)}
                      onMouseLeave={() => setHoverNota(0)}
                      onClick={() => setNota(estrela)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '150px', padding: '10px', marginTop: '10px' }}
                  onClick={enviarAvaliacao}
                >
                  Enviar Nota
                </button>
              </div>
            </div>
          )}

          {/* CONTAINER DAS MENSAGENS E INPUT */}
          <div className="chat-container">
            <div className="chat-messages">
              {mensagens.length === 0 ? (
                <div className="empty-chat-message">
                  <span>💬</span>
                  <p>Inicie a conversa! Combinem os detalhes do bico aqui.</p>
                </div>
              ) : (
                mensagens.map((msg) => {
                  const ehMinha = msg.remetente_id === user.id;
                  return (
                    <div key={msg.id} className={`message-bubble ${ehMinha ? 'message-mine' : 'message-theirs'}`}>
                      {msg.conteudo}
                    </div>
                  );
                })
              )}
              <div ref={mensagensFimRef} />
            </div>

            <form className="chat-input-area" onSubmit={enviarMensagem}>
              <input type="text" placeholder="Digite sua mensagem..." value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} />
              <button type="submit">➤</button>
            </form>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Chat;