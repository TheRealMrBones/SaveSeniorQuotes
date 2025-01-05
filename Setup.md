### Setup:
1. `npm install` Install dependencies
2. `npx prisma generate` Generate DB Schema
3. `npm run dev` OR  `npm run prod` Starts server

### .env Requirements:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
SECRET_KEY="secretkey"
```

### Update Database
- `npx prisma db push` Push schema changes to the database
- `npx prisma studio` Live view of the database