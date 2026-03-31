# Carteira Frontend

Interface web da carteira financeira digital. Permite cadastro, login, depósito, transferência entre usuários e estorno de transações.

## Tecnologias

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Autenticação via Bearer Token armazenado em `localStorage`

## Telas

| Rota | Descrição |
|------|-----------|
| `/login` | Login com e-mail e senha |
| `/register` | Cadastro de nova conta |
| `/dashboard` | Saldo, ações e histórico de transações |

## Fluxo

1. Acesso em `/` redireciona para `/dashboard`
2. Sem token → redireciona para `/login`
3. Após login, token salvo em `localStorage` e usuário vai para `/dashboard`
4. Dashboard exibe saldo, botões de Depositar e Transferir (abrem modal) e o histórico completo
5. Na transferência: busca o destinatário por e-mail antes de confirmar o valor
6. Cada transação no histórico tem um botão de estorno (quando aplicável)

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost/api
```

## Como rodar

### Com Docker

```bash
docker compose up
```

Frontend disponível em `http://localhost:3000`.

> O `docker-compose.yml` usa a imagem `node:20-alpine`, monta o código como volume e roda `npm install && npm run dev` automaticamente.

### Sem Docker

Requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

Frontend disponível em `http://localhost:3000`.

### Build de produção

```bash
npm run build
npm start
```
