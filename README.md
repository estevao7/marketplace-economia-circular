# Marketplace Economia Circular - UNIFOR

Marketplace de economia circular voltado para a comunidade do campus da UNIFOR, permitindo que estudantes anunciem, doem ou vendam itens que não usam mais (livros, materiais de engenharia, periféricos de computação, entre outros), promovendo reuso e reduzindo desperdício dentro do campus.

Projeto desenvolvido como parte do processo seletivo de estágio Full Stack/IA do Laboratório Vortex (UNIFOR).

## 🔗 Links em produção

- **Frontend:** https://marketplace-economia-circular-fnt3wkoeh-estevao6.vercel.app
- **Backend (API):** https://marketplace-economia-circular.onrender.com

> ⚠️ O backend está hospedado no plano gratuito do Render. Se a API estiver "dormindo" por inatividade, a primeira requisição pode levar de 30 a 50 segundos para responder.

## 🛠️ Tecnologias utilizadas

**Frontend**
- HTML5, CSS3 e JavaScript puro (vanilla)
- PWA (Progressive Web App): `manifest.json` + Service Worker

**Backend**
- Node.js + Express
- Armazenamento de dados em memória (array volátil no servidor)
- CORS para comunicação entre frontend e backend

**Ferramentas e deploy**
- Git e GitHub para versionamento
- Render (deploy do backend)
- Vercel (deploy do frontend)
- Thunder Client (testes de API)

## 📁 Estrutura do projeto

```
marketplace-economia-circular/
├── index.html          # Landing page (vitrine pública)
├── anunciar.html        # Formulário de anúncio + "Meus anúncios" (PWA)
├── style.css
├── script.js             # Lógica da landing page
├── anunciar.js           # Lógica do formulário e listagem por usuário
├── manifest.json         # Configuração do PWA
├── sw.js                 # Service Worker
├── icone-192.png / icone-512.png
└── backend/
    ├── index.js           # Servidor Express e rotas da API
    ├── database.js        # Armazenamento em memória
    └── package.json
```

## ▶️ Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- [Git](https://git-scm.com/) instalado
- Extensão **Live Server** no VS Code (ou qualquer servidor estático de sua preferência)

### 1. Clonar o repositório
```bash
git clone https://github.com/estevao7/marketplace-economia-circular.git
cd marketplace-economia-circular
```

### 2. Rodar o Backend
```bash
cd backend
npm install
npm run dev
```
O servidor sobe em `http://localhost:3000`.

### 3. Rodar o Frontend
Com o backend rodando, abra o arquivo `index.html` (ou `anunciar.html`) com o **Live Server** do VS Code, ou qualquer servidor estático.

> **Atenção:** para testar 100% localmente, é necessário trocar a constante `API_URL` no topo de `script.js` e `anunciar.js` de volta para `http://localhost:3000`, já que atualmente ela aponta para a API em produção no Render.

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/anuncios` | Lista todos os anúncios |
| GET | `/anuncios?categoria=livros` | Filtra anúncios por categoria |
| GET | `/anuncios?idUsuario=...` | Filtra anúncios de um usuário específico |
| POST | `/anuncios` | Cria um novo anúncio |
| DELETE | `/anuncios/:id` | Remove um anúncio pelo ID |

Todas as respostas são retornadas em formato JSON.

---

## 🤖 Diário de Bordo da IA

Como parte do processo seletivo, documento aqui como utilizei ferramentas de Inteligência Artificial ao longo do desenvolvimento deste projeto.

### Ferramentas utilizadas
- **Claude (Anthropic)** — principal ferramenta usada durante todo o desenvolvimento, do planejamento inicial até o deploy.

### Estratégia de Engenharia de Prompts

Como sou iniciante em programação, minha primeira estratégia foi definir logo no início como eu queria que a IA me ajudasse: pedi explicitamente que ela atuasse como um "auxiliador" ao longo de todo o projeto, guiando-me passo a passo em vez de apenas entregar código pronto — já que meu objetivo não era só ter o projeto concluído, mas realmente aprender no processo. A partir disso, sempre que pedia algo, buscava explicações **conceituais junto com o código**, sempre em passos pequenos. Alguns exemplos reais de prompts que usei:

1. *"Vou usar essa conversa pra tirar minhas principais dúvidas sobre o projeto, pois ainda sou iniciante (...). Você vai atuar como o meu auxiliador."* — esse foi o prompt inicial, logo no começo da conversa, definindo o "papel" que a IA deveria assumir durante todo o desenvolvimento: um guia que me ensina, não um gerador de código que eu simplesmente copio.

2. *"eu quero ir preenchendo o header"* — em vez de pedir a página inteira de uma vez, fui construindo o HTML seção por seção (header, hero, estatísticas, vitrine), pedindo explicação de cada tag nova antes de seguir para a próxima parte.

3. *"repeat(auto-fit, minmax(220px, 1fr) me explique essa parte especificamente"* — sempre que uma linha de código CSS ou JavaScript não fazia sentido pra mim, eu colava o trecho específico e pedia uma explicação isolada, em vez de seguir sem entender.

4. *"não existe outra opção de deploy?"* — quando enfrentei um erro persistente de incompatibilidade do `sqlite3` no ambiente de deploy do Render (detalhado abaixo), pedi diretamente por uma alternativa mais simples e confiável para destravar o problema.

### Reflexão crítica: um momento em que a IA errou e como identifiquei/corrigi

O maior desafio do projeto foi o **deploy do backend no Render**. Inicialmente, o projeto usava o pacote `sqlite3` para persistência em arquivo. Ao fazer o deploy, o servidor quebrava repetidamente com o erro `GLIBC_2.38 not found`, indicando incompatibilidade entre o binário nativo do `sqlite3` (compilado no meu Windows) e o ambiente Linux do Render.

A IA tentou, em sequência, várias correções que **não resolveram o problema real**: fixar a versão do Node.js, forçar compilação via variável de ambiente, e por fim trocar o pacote por `better-sqlite3`. Mesmo depois da troca, o erro persistiu (`Segmentation fault`) — e eu percebi, olhando os logs do Render junto com a IA, que a causa raiz não era a biblioteca em si, mas sim que a pasta `node_modules` (contendo binários compilados no Windows) estava sendo enviada acidentalmente para o GitHub por falha na configuração do `.gitignore`, e o Render estava reaproveitando esses binários incompatíveis em vez de reinstalar do zero no Linux.

Corrigir isso envolveu remover o `.gitignore` corretamente e usar `git rm -r --cached` para "destrackear" o `node_modules`. Para evitar continuar dependendo de um pacote com binário nativo (fonte recorrente desse tipo de problema em ambientes de deploy gratuitos), optei, com sugestão da IA, por trocar a persistência para **armazenamento em memória** (arrays no servidor) — solução que o próprio edital aceita como válida, e que eliminou de vez o problema de compatibilidade.

Esse episódio me ensinou a importância de **ler os logs de erro com atenção** (em vez de aceitar a primeira correção sugerida) e de entender o que realmente estava sendo enviado para o repositório Git, algo que reforcei bastante durante essa etapa.

