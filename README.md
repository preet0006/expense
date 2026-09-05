# Pocketwise — Smart Expense Tracker

A full-stack expense tracker: React + Tailwind CSS frontend, Express + MongoDB backend.

```
expense-tracker/
├── backend/                    Express API + MongoDB (Mongoose)
│   ├── config/db.js            Mongo connection
│   ├── models/                 Transaction.js, Budget.js (schemas)
│   ├── controllers/            transactionController.js, budgetController.js
│   ├── routes/                 transactionRoutes.js, budgetRoutes.js
│   ├── middleware/errorHandler.js
│   ├── seed/seedData.js        Seeds fake transactions + a budget
│   ├── server.js               App entry point
│   ├── package.json
│   └── .env.example            Copy to .env
│
└── frontend/                   React (Vite) + Tailwind CSS
    ├── src/
    │   ├── api/api.js          All API calls (axios)
    │   ├── context/ThemeContext.jsx   Light/dark mode
    │   ├── components/         Topbar, SummaryCards, CategoryChart,
    │   │                       BudgetProgress, Insights, TransactionForm,
    │   │                       TransactionTable
    │   ├── pages/Dashboard.jsx Main page, wires everything together
    │   ├── utils/format.js     Currency/date formatting, categories, colors
    │   ├── App.jsx / main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    ├── package.json
    └── .env.example            Copy to .env
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
CLIENT_URL=http://localhost:5173
```

Use a local MongoDB (`mongod` running on your machine) or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster — just paste its
connection string into `MONGO_URI`.

Seed the database with realistic fake data (income, expenses across all
categories, and a monthly budget):

```bash
npm run seed
```

Start the API:

```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```

The API runs at `http://localhost:5000/api`. Check it's alive at
`http://localhost:5000/api/health`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` just needs to point at the backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173`.

## API reference

| Method | Route                       | Description                              |
|--------|------------------------------|-------------------------------------------|
| GET    | `/api/transactions`          | List transactions (`?search=&type=&category=&month=`) |
| GET    | `/api/transactions/summary`  | Totals, monthly spend, category breakdown, insights, budget progress |
| GET    | `/api/transactions/:id`      | Get one transaction |
| POST   | `/api/transactions`          | Create a transaction |
| PUT    | `/api/transactions/:id`      | Update a transaction |
| DELETE | `/api/transactions/:id`      | Delete a transaction |
| GET    | `/api/budget?month=YYYY-MM`  | Get the budget for a month (defaults to current) |
| PUT    | `/api/budget`                | Create/update a month's budget: `{ limit, month? }` |

## Data model

**Transaction**
- `amount` (Number, required, > 0)
- `type` (`"Income"` \| `"Expense"`, required)
- `category` (`Food` \| `Transport` \| `Shopping` \| `Bills` \| `Entertainment` \| `Health` \| `Other`)
- `description` (String, optional)
- `date` (Date, required)

**Budget**
- `month` (String, `"YYYY-MM"`, unique)
- `limit` (Number)

## Notes

- Smart insights and the budget progress bar are computed server-side in
  `getSummary` (`backend/controllers/transactionController.js`) using simple
  rules (top spending category, % of budget used, overall balance).
- Light/dark mode is a simple class toggle on `<html>`, persisted to
  `localStorage`.
- The UI is a single dashboard page (cards, chart, budget, insights, table)
  rather than multiple routes, matching a "small, clean" tracker — easy to
  extend with `react-router` later if you want separate pages.

## Dashboard features

- Select any month to keep transactions, totals, category spending, insights,
  and budget progress synchronized with the same database query.
- Export the currently visible, filtered transactions as a CSV file.
- Clear search and filters without leaving the page.

The month-aware summary endpoint is available at
`GET /api/transactions/summary?month=YYYY-MM`. For a production build, build
the frontend with `npm run build`, serve its `dist/` directory from your web
server, and run the backend with `npm start`. Set `VITE_API_URL` at frontend
build time and keep `MONGO_URI` only in the backend deployment environment.
