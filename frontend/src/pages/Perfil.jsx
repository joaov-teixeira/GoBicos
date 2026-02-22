import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectLocalizacao from '../components/SelectLocalizacao';

function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    name: '',
    localizacao: '',
    sobre: ''
  });

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('user');
    if (!userLogado) {
      navigate('/login');
    } else {
      const usuario = JSON.parse(userLogado);
      setUser(usuario);
      // Preenche o formulário com os dados atuais do usuário
      setFormData({
        name: usuario.name || '',
        localizacao: usuario.localizacao || '',
        sobre: usuario.sobre || ''
      });
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowLogoutMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resposta = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        const usuarioAtualizado = await resposta.json();
        
        // Atualiza o localStorage com os novos dados, o nome novo já aparece no menu do topo na mesma hora
        localStorage.setItem('user', JSON.stringify(usuarioAtualizado));
        setUser(usuarioAtualizado);
        
        alert("✅ Perfil atualizado com sucesso!");
        
        // Volta para a tela inicial baseada no tipo de usuário
        if (usuarioAtualizado.tipo === 'empresa') {
          navigate('/dashboard');
        } else {
          navigate('/feed');
        }
      } else {
        alert("Erro ao atualizar o perfil.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
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
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  return (
    <div className="dashboard-layout">
      {/* HEADER PADRÃO */}
      <header className="navbar">
        <button className="btn-voltar-pill" onClick={() => navigate(user.tipo === 'empresa' ? '/dashboard' : '/feed')}>
          ← Voltar
        </button>
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

      <main className="dashboard-content" style={{ maxWidth: '600px', alignItems: 'center' }}>
        <div className="table-container" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="role-icon" style={{ margin: 0 }}>{user.tipo === 'empresa' ? '🏢' : '👤'}</div>
            <div>
              <h2>Meu Perfil</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Atualize suas informações públicas</p>
            </div>
          </div>
          
          <form className="login-form" onSubmit={handleSalvar}>
            <div className="input-group">
              <label>Nome {user.tipo === 'empresa' ? 'da Empresa' : 'Completo'}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Sua Cidade / Região</label>
              {/*Componente do IBGE */}
              <SelectLocalizacao 
                value={formData.localizacao} 
                onChange={(novoValor) => setFormData({ ...formData, localizacao: novoValor })} 
              />
            </div>

            <div className="input-group">
              <label>{user.tipo === 'empresa' ? 'Sobre o Negócio' : 'Suas Habilidades e Experiências'}</label>
              <textarea name="sobre" rows="5" value={formData.sobre} onChange={handleChange} placeholder="Escreva algo sobre você..."></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Perfil;