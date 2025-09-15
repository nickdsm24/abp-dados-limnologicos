# 🌊 Aplicação Web para Visualização e Disseminação de Dados Limnológicos  

## 📌 Tema do Semestre  
**Aplicação Web para Visualização e Disseminação de Dados Limnológicos**  
Projeto acadêmico desenvolvido com foco em disponibilizar e analisar dados limnológicos e meteorológicos coletados em reservatórios da Furnas Centrais Elétricas S.A., em cooperação com o INPE, UFRJ, UFJF e IIE.  

---

## 📖 Descrição do Projeto  
Este projeto visa desenvolver uma aplicação web interativa para a visualização, consulta e disseminação de dados limnológicos e meteorológicos coletados em reservatórios da Furnas Centrais Elétricas S.A., em colaboração com as instituições INPE, UFRJ, UFJF e IIE.
O objetivo principal é subsidiar estudos sobre o Balanço de Carbono nos reservatórios, disponibilizando os dados de forma organizada e de fácil acesso para os usuários.

Os dados utilizados no sistema são de dois tipos:

Parâmetros limnológicos coletados manualmente, realizados em diferentes locais dos reservatórios durante curtos períodos, chamados de campanhas de coleta.

Dados coletados automaticamente pelo SIMA (Sistema Integrado de Monitoração Ambiental), desenvolvido pelo INPE, que realiza a monitoração em tempo real de sistemas hidrológicos em um único ponto do reservatório, registrando informações durante longos períodos.

A aplicação permite integrar e apresentar ambos os tipos de dados, facilitando análises científicas, consultas interativas, visualização em gráficos, mapas e exportação de dados, contribuindo para a pesquisa ambiental e a gestão sustentável dos reservatórios.---

## ✨ Funcionalidades  
- 📊 Visualização de parâmetros armazenados com filtros por **instituição, reservatório e período de tempo**.  
- 📑 Consulta de dados em **tabelas dinâmicas**.  
- 📥 Exportação de dados em **formato CSV**.  
- 🗺️ Localização das coletas em **mapa interativo**.  
- 📈 Visualização de **séries temporais em gráficos** (dados SIMA).  

---

## 🛠️ Tecnologias Utilizadas  
- **Front-end:** React + TypeScript  
- **Back-end:** Node.js + TypeScript + Express  
- **Banco de Dados:** PostgreSQL  
- **Infraestrutura:** Docker + Docker Compose  
- **Visualização:** Gráficos interativos (Chart.js/Recharts) e mapas (Leaflet/Mapbox)  

---

## 📌 Requisitos  

### ✅ Requisitos Funcionais  
- RF01: Visualizar parâmetros armazenados com filtros por instituição, reservatório e período.  
- RF02: Consultar e visualizar dados em formato de tabelas.  
- RF03: Exportar dados em formato **CSV**.  
- RF04: Visualizar localização dos dados em **mapa interativo**.  
- RF05: Exibir dados de séries temporais em **gráficos interativos**.  

### ⚙️ Requisitos Não Funcionais  
- RNF01: Interface intuitiva, clara e fácil de usar, mesmo para usuários não técnicos.  
- RNF02: Desempenho otimizado, com carregamento rápido dos dados.  
- RNF03: Interface seguindo a identidade visual do **INPE** e padrões institucionais.  

---

## 🚀 Sprint 1

### 🎯 Objetivo
Estruturar a base do projeto e iniciar a configuração do ambiente de desenvolvimento.

### 📅 Período
16/09/2025 a 06/10/2025

### 📋 Sprint Backlog
| Tarefa                                                                 | Responsável | User Story Associado | Story Points (Scrum Poker Planning) | Prioridade | Status       |
|------------------------------------------------------------------------|-------------|----------------------|--------------|------------|--------------|
| Montar protótipo da tela inicial da aplicação no Figma                 | Suelen      |    História 1        | 3            | Alta       | Em andamento |
| Escrever o protótipo da tela inicial em React                          | Suelen      |    História 1         | 5            | Alta       | Em andamento |
| Definir paleta de cores e tipografia alinhada ao INPE                  | Suelen      |    História 2        | 2            | Média      | Em andamento |
| Validar design com a equipe                                            | Suelen      |           História 2           | 2            | Média      | Em andamento |
| Criar o primeiro protótipo do componente de menu principal, possibilitando ao usuário uma visão geral dos recursos existentes no sistema             | Bruna       |      História 1                 | 5            | Alta       | Em andamento |
| Escrever o protótipo do menu principal em React                        | Bruna      |    História 1        | 5            | Alta       | Em andamento |
| Criar o primeiro protótipo do componente de tabela interativa          | Bruno       |      História 1                | 5            | Alta       | Em andamento |
| Implementar filtros por instituição, reservatório e período            | Bruno       |         História 1             | 3            | Alta       | Em andamento |
| Conectar tabela a dados mockados inicialmente (JSON fake)              | Bruno       |     História 1                 | 3            | Média      | Em andamento |
| Configurar o projeto Node.js + TS com Express                                 | Nicolas     |         História 10             | 3            | Alta       | Em andamento |
| Configurar scripts dev, build, start no package.json                   | Nicolas     |           História 10           | 2            | Média      | Em andamento |
| Criar estrutura MVC (controllers, services, routes, middlewares)       | Nicolas     |        História 10              | 5            | Alta       | Em andamento |
| Implementar middleware de erros e logs básicos                         | Nicolas     |        História 10              | 3            | Média      | Em andamento |
| Criar endpoint /health para checagem inicial                           | Nicolas     |         História 10             | 2            | Média      | Em andamento |
| Criar rotas para metade das tabelas existentes (getAll, getById)       | Nicolas     |           História 10           | 5            | Alta       | Em andamento |
| Criar rotas para metade das tabelas existentes (getAll, getById)       | Ryan        |          História 11            | 5            | Alta       | Em andamento |
| Testar as rotas                                                        | Ryan        |        História 12              | 3            | Alta       | Em andamento |
| Documentar a API conforme desenvolvimento                              | Ryan        |      História 12                | 3            | Média      | Em andamento |
| Criar o primeiro banco a partir dos scripts disponibilizados, testar consultas e verificar se a extensão geoespacial está habilitada           | Pedro       |      História 11                | 5            | Alta       | Em andamento |
| Hospedar o banco na Render para facilitar uso nesse primeiro momento                          | Pedro       |    História 11                  | 3            | Alta       | Em andamento |
| Buscar uma foto para cada reservatório na internet para uso no frontend| Pedro       |    História 2                  | 2            | Baixa      | Em andamento |



### 🔍 Sprint Review
- Data: 07/10/2025
- Formato:  vídeo
- Entrega:

### 🎲 Planning Poker  
| **História**                                                                                         | **Complexidade (pontos)** |
|------------------------------------------------------------------------------------------------------|----------------------------|
| Montar protótipo da tela inicial da aplicação no Figma                                               | 3                          |
| Escrever o protótipo da tela inicial em React                                                        | 5                          |
| Criar o primeiro protótipo do componente de menu principal                                           | 5                          |
| Escrever o protótipo do menu principal em React                                                      | 5                          |
| Criar o primeiro protótipo do componente de tabela interativa                                        | 5                          |
| Implementar filtros por instituição, reservatório e período                                          | 3                          |
| Conectar tabela a dados mockados inicialmente (JSON fake)                                            | 3                          |
| Definir paleta de cores e tipografia alinhada ao INPE                                                | 2                          |
| Validar design com a equipe                                                                          | 2                          |
| Buscar uma foto para cada reservatório na internet para uso no frontend                              | 2                          |
| Configurar o projeto Node.js + TS com Express                                                        | 3                          |
| Configurar scripts dev, build, start no package.json                                                 | 2                          |
| Criar estrutura MVC (controllers, services, routes, middlewares)                                     | 5                          |
| Implementar middleware de erros e logs básicos                                                       | 3                          |
| Criar endpoint /health para checagem inicial                                                         | 2                          |
| Criar rotas para metade das tabelas existentes (getAll, getById) – por Nicolas                       | 5                          |
| Criar rotas para metade das tabelas existentes (getAll, getById) – por Ryan                          | 5                          |
| Criar o primeiro banco a partir dos scripts disponibilizados, testar consultas etc.                  | 5                          |
| Hospedar o banco na Render para facilitar uso nesse primeiro momento                                 | 3                          |
| Testar as rotas                                                                                      | 3                          |
| Documentar a API conforme desenvolvimento                                                            | 3                          |


####Complexidade total da Sprint:74
####Quantidade de histórias planejadas:Alta

### 📉 Gráfico Burndown
![Burndown Sprint 1](/docs/sprint-1/burndown.png)  


🔗 [Ver tabela completa no Google Drive](https://docs.google.com/spreadsheets/d/1xV5XsTNYcUqYg82jIZkPI16sL_MuuDdo58Gj28kZsmI/edit?usp=sharing)
