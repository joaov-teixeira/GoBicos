import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectLocalizacao from '../components/SelectLocalizacao';

function Cadastro() {
  const navigate = useNavigate();
  // Controle de qual passo estamos: 1 (Escolher Tipo) ou 2 (Formulário)
  const [passo, setPasso] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tipo: '', localizacao: '', sobre: ''
  });

  const selecionarTipo = (tipoEscolhido) => {
    setFormData({ ...formData, tipo: tipoEscolhido });
    setPasso(2); // Avança pro formulário
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Salva login e joga pra tela certa
        localStorage.setItem('token', dados.token);
        localStorage.setItem('user', JSON.stringify(dados.user));
        
        alert('🎉 Conta criada com sucesso!');
        if (dados.user.tipo === 'empresa') navigate('/dashboard');
        else navigate('/feed');
      } else {
        alert(`Erro: Verifique os dados. (Email já existe?)`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: passo === 1 ? '600px' : '400px' }}>
        <h1 className="logo">GoBicos</h1>
        
        {passo === 1 ? (
          <>
            <p className="subtitle" style={{ fontSize: '1.2rem', color: 'white' }}>Bem-vindo ao GoBicos</p>
            <p style={{ color: '#94a3b8' }}>Como você deseja continuar?</p>
            
            <div className="role-selection-grid">
              <div className="role-card" onClick={() => selecionarTipo('empresa')}>
                <div className="role-icon">🏢</div>
                <h3>Sou uma Empresa</h3>
                <p>Publique vagas e encontre os melhores freelancers para seu negócio</p>
                <span>Continuar como empresa ➔</span>
              </div>

              <div className="role-card" onClick={() => selecionarTipo('freelancer')}>
                <div className="role-icon">👤</div>
                <h3>Sou um Freelancer</h3>
                <p>Encontre oportunidades incríveis e trabalhe com flexibilidade</p>
                <span>Continuar como freelancer ➔</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="subtitle">Criar conta como <strong>{formData.tipo === 'empresa' ? 'Empresa' : 'Freelancer'}</strong></p>
            
            <form className="login-form" onSubmit={handleCadastro}>
              <div className="input-group">
                <label>Nome {formData.tipo === 'empresa' ? 'da Empresa' : 'Completo'}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Senha</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6" required />
              </div>

              <div className="input-group">
                <label>Sua Cidade / Região</label>
                <SelectLocalizacao 
                value={formData.localizacao} 
                onChange={(novoValor) => setFormData({ ...formData, localizacao: novoValor })} 
                />
              </div>

              <div className="input-group">
                <label>{formData.tipo === 'empresa' ? 'Sobre o Negócio' : 'Suas Habilidades'}</label>
                <textarea name="sobre" rows="3" placeholder="Conte um pouco sobre..." value={formData.sobre} onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="btn-primary">Criar Conta</button>
              <button type="button" onClick={() => setPasso(1)} style={{background: 'none', border: 'none', color: '#94a3b8', width: '100%', cursor: 'pointer'}}>
                ← Voltar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Cadastro;