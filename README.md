## GoBicos
Plataforma digital que simplifica a contratação de serviços pontuais ("bicos"), conectando estabelecimentos a prestadores de serviço de forma ágil.

## CSI606-SISTEMAS-WEB-1-2025-01 - Proposta de Trabalho Final
Discente: João Victor Teixeira Pereira
Matrícula: 22.1.8052

## 0. Resumo
Este trabalho propõe o desenvolvimento de um sistema web, "GoBicos", uma aplicação web full-stack projetada para otimizar o mercado informal de trabalhos pontuais. O sistema contará com autenticação de usuários e múltiplos perfis de acesso (Empresas e Freelancers), visando centralizar ofertas que hoje estão dispersas. A funcionalidade principal permitirá que stakeholders (donos de bares, restaurantes…etc) publiquem vagas de curta duração e que estudantes ou freelancers se candidatem de forma ágil. O sistema gerenciará o ciclo de vida da vaga, desde a publicação até o preenchimento, permitindo o cruzamento de dados entre a oferta e a demanda. 

## 1. Tema
O trabalho final tem como tema o desenvolvimento de uma plataforma de empregabilidade focada em trabalhos informais temporários ("bicos"), incluindo autenticação de usuários com diferenciação de permissões, frontend, backend e um banco de dados relacional (PostgreSQL). O foco é aplicar conceitos de modelagem de dados complexa (relacionamentos N:N entre candidatos e vagas), gestão de estado no frontend e construção de APIs seguras.

## 2. Escopo
Este projeto terá as seguintes funcionalidades:

# Frontend:

* Páginas de Cadastro (Registro) e Login com distinção de perfil (Empresa ou Freelancer).

* Perfil Empresa:

* Dashboard para gerenciamento de vagas criadas.

* Formulário para criação de novas vagas (título, valor, data, requisitos).

* Visualização de lista de candidatos por vaga, com opção de "Aceitar" ou "Rejeitar".

* Perfil Freelancer:

* Feed principal com listagem de vagas disponíveis e filtros (por valor ou data).

* Página de "Meus Bicos", exibindo o status das candidaturas (Pendente, Aprovado, Recusado).

* Botão de ação rápida "Candidatar-se".

* Gerenciamento de estado global para persistência do usuário logado.

# Backend (API):

* Endpoints de autenticação (Registro, Login, Logout) com emissão de tokens.

* Middlewares para proteção de rotas (garantir que apenas Empresas possam criar vagas).

* Endpoints CRUD para Vagas.

* Endpoint específico para candidatura que cria o vínculo entre usuário e vaga.

* Lógica de negócios para impedir candidaturas duplicadas ou em vagas já fechadas.

* Retorno de dados formatados em JSON para consumo do frontend.

# Banco de Dados:

* Tabela users: Armazena dados comuns e o tipo de perfil (role).

* Tabela jobs: Armazena as vagas (título, descrição, valor, data, status, id_empresa).

* Tabela job_applications: Tabela pivô para ligar freelancers a vagas, contendo campos de controle como status (pendente/aprovado) e created_at.

* O banco de dados será pré-populado (via seeding) com usuários e vagas fictícias para fins de teste e apresentação.

## 3. Restrições
Neste trabalho não serão considerados:

* Processamento de pagamentos dentro da plataforma (o pagamento do bico é externo).

* Chat em tempo real entre empresa e freelancer.

* Sistema de avaliação/review de usuários (estrelas).

* Versão mobile nativa (apenas responsividade web).

## 4. Protótipo
### Os protótipos de interface estão sendo desenvolvidos na ferramenta Figma: https://www.figma.com/design/qHSOjQivQy6gsxSfBu6w3J/GoBicos-Kit-Design?node-id=0-1&t=UzQwN40RYpEiuRwg-1
