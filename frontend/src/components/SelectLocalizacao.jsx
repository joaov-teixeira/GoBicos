import { useState, useEffect } from 'react';

export default function SelectLocalizacao({ value, onChange }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  
  const [ufSelecionada, setUfSelecionada] = useState('');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');

  // 1. Ao carregar o componente, se já existir um valor (ex: "João Monlevade - MG"), ele separa a string
  useEffect(() => {
    if (value && value.includes(' - ')) {
      const [cid, uf] = value.split(' - ');
      setUfSelecionada(uf);
      setCidadeSelecionada(cid);
    }
  }, [value]);

  // 2. Busca os Estados do IBGE ao iniciar
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error("Erro ao buscar estados:", err));
  }, []);

  // 3. Busca as Cidades sempre que o Estado (UF) mudar
  useEffect(() => {
    if (!ufSelecionada) {
      setCidades([]);
      return;
    }
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios?orderBy=nome`)
      .then(res => res.json())
      .then(data => setCidades(data))
      .catch(err => console.error("Erro ao buscar cidades:", err));
  }, [ufSelecionada]);

  // Ações ao trocar os selects
  const handleUfChange = (e) => {
    const novaUf = e.target.value;
    setUfSelecionada(novaUf);
    setCidadeSelecionada('');
    onChange(''); // Limpa o valor final até que ele escolha a cidade
  };

  const handleCidadeChange = (e) => {
    const novaCidade = e.target.value;
    setCidadeSelecionada(novaCidade);
    if (novaCidade && ufSelecionada) {
      // Devolve para o formulário pai a string padronizada: "Cidade - UF"
      onChange(`${novaCidade} - ${ufSelecionada}`);
    } else {
      onChange('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select 
        value={ufSelecionada} 
        onChange={handleUfChange} 
        required 
        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', outline: 'none' }}
      >
        <option value="">Estado</option>
        {estados.map(est => (
          <option key={est.id} value={est.sigla}>{est.sigla}</option>
        ))}
      </select>

      <select 
        value={cidadeSelecionada} 
        onChange={handleCidadeChange} 
        required 
        disabled={!ufSelecionada} 
        style={{ flex: 3, padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', outline: 'none', cursor: ufSelecionada ? 'pointer' : 'not-allowed' }}
      >
        <option value="">{ufSelecionada ? 'Selecione a Cidade' : 'Escolha o Estado primeiro'}</option>
        {cidades.map(cid => (
          <option key={cid.id} value={cid.nome}>{cid.nome}</option>
        ))}
      </select>
    </div>
  );
}