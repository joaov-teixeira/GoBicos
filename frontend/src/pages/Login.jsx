import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importa o navegador

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <-- Inicializa o navegador

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('user', JSON.stringify(dados.user));
        
        // Verifica o tipo de usuário e joga para a tela correta
        if (dados.user.tipo === 'empresa') {
          navigate('/dashboard'); 
        } else {
          navigate('/feed');
        }
      } else {
        alert(`Erro: ${dados.message}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">GoBicos</h1>
        <p className="subtitle">Sua plataforma de trabalhos freelance</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <label className="remember-me"><input type="checkbox" /> Lembrar-me</label>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        <p className="signup-link">
          Não tem uma conta? {' '}
          <span 
            onClick={() => navigate('/cadastro')} 
            style={{ color: '#f97316', fontWeight: '500', cursor: 'pointer' }}
          >
            Cadastre-se gratuitamente
          </span>
        </p>
      </div>
    </div>
  );
}
export default Login;