# GoBicos

## Resumo
O GoBicos é uma plataforma Full Stack desenvolvida para digitalizar e otimizar o mercado de trabalho informal e autônomo. O contexto do projeto surge da necessidade de conectar, contratantes (empresas ou pessoas físicas) que demandam serviços pontuais com freelancers disponíveis em suas respectivas regiões. A aplicação atua como uma ponte facilitadora, oferecendo não apenas a vitrine de vagas, mas também ferramentas de gestão de candidaturas, comunicação direta e construção de reputação profissional.

## 1. Funcionalidades implementadas
* **Autenticação e Perfis de Usuário:** Sistema de login e cadastro com segregação de papéis (Empresa e Freelancer), além de painéis de edição de perfil e atualização de sessão em tempo real.
* **Gestão de Vagas (CRUD):** Criação, edição, visualização e controle de status (aberta/fechada) de anúncios de bicos, exigindo dados precisos como valor, localização e intervalo de horário (início e término).
* **Fluxo de Match e Candidatura:** Freelancers podem se candidatar a múltiplas vagas, enquanto as empresas gerenciam essas requisições por meio de um Dashboard, podendo aprovar ou recusar candidatos.
* **Filtros e Integração Geográfica:** Consumo da API pública do IBGE para padronizar o cadastro de Estados e Municípios, garantindo um filtro de localização preciso e livre de erros de digitação no Feed de vagas.
* **Busca Tolerante a Erros:** Implementação de algoritmos de string matching no backend para garantir que a busca por palavras-chave retorne resultados relevantes mesmo com pequenos erros ortográficos do usuário.

## 2. Funcionalidades não previstas que foram implementadas
* **Chat Interno (Tempo Real):** Um canal de comunicação privado entre a empresa e o freelancer aprovado, implementado via *short polling* e com proteção de rota para garantir que apenas os envolvidos acessem as mensagens.
* **Sistema de Reputação (Rating):** Sistema de avaliação mútua (1 a 5 estrelas) após a conclusão ou negociação do bico, com cálculo automático de média e exibição nos perfis.

## 3. Funcionalidades não implementadas
* Processamento de pagamentos dentro da plataforma (o pagamento do bico é externo).
* Versão mobile nativa (apenas responsividade web).

## 4. Principais desafios e dificuldades
* **Padronização de Dados de Localização:** Substituir entradas de texto livre por uma integração confiável com a API do IBGE exigiu a criação de componentes React complexos e reaproveitáveis que gerenciassem estados dependentes (o carregamento de cidades dependendo do estado selecionado).
* **Validações Estritas no Backend:** Lidar com regras de negócio no Laravel para atualizações parciais (ex: permitir pausar uma vaga sem que o framework exigisse o reenvio das datas de início e término) exigiu um aprofundamento nas regras de validação (`sometimes`).
* **Sincronia e Layout do Chat:** Construir uma interface de chat responsiva, que mantivesse o scroll fixo nas mensagens mais recentes e que atualizasse o banco de dados frequentemente sem travar o navegador do cliente.

## 5. Instruções para instalação e execução

**Pré-requisitos:** Node.js, PHP 8.1+, Composer e PostgreSQL.

**Backend (Laravel):**
1. Acesse a pasta `backend`.
2. Instale as dependências: `composer install`.
3. Configure o arquivo de ambiente: `cp .env.example .env` e `php artisan key:generate`.
4. Configure as credenciais do PostgreSQL no arquivo `.env`.
5. Rode as migrations: `php artisan migrate`.
6. Inicie o servidor: `php artisan serve` (Rodará em `http://localhost:8000`).

**Frontend (React):**
1. Acesse a pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Inicie o servidor de desenvolvimento: `npm run dev`.
4. Acesse a aplicação no navegador (Geralmente em `http://localhost:5173`).

## 6. Referências
* **React Documentation:** https://react.dev/
* **Laravel Documentation:** https://laravel.com/docs
* **API de Localidades do IBGE:** https://servicodados.ibge.gov.br/api/docs/localidades
* **Documentação do PostgreSQL:** https://www.postgresql.org/docs/
