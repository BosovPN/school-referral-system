# School-referral-system
### Installation

Cloning the repository
```bash
git clone https://github.com/BosovPN/school-referral-system.git
```
Move into the backend directory where we have the project files 
```bash
cd school-referral-system/
```

Install the dependencies
```bash
npm install
```

Set up environment variables in .env file
```bash
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development

DATABASE_URL=postgres://myuser:mypassword@127.0.0.1:5432/mydatabase

JWT_SECRET=supersecretkey
STRIPE_SECRET=sk_secret

AUTH0_DOMAIN=myapp.auth0.com
AUTH0_CLIENT_ID=myclientid
AUTH0_CLIENT_SECRET=myclientsecret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Running the Project
```bash
npx knex migrate:latest --knexfile src/config/knexfile.ts
npx knex seed:run --knexfile src/config/knexfile.ts
npm start
```
