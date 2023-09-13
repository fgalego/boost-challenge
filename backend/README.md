# Boost Challenge

Sign-Up/Sign-In backend app.

## Technologies

Software prerequisites:

- Node.js
- Express.js
- MongoDB
- JSON Web Token
- Multer
- bcrypt

## Usage

Must have Node installed on your machine.

Clone the repository (or download the code)

```bash
  git clone https://github.com/fgalego/boost-challenge.git
```

Access the project folder

```bash
  cd backend
```

Setup the .env file

```bash
  DB_USER= (database username)
  DB_PASSWORD= (database password)
  DB_LINK= (database link)
  JWT_SECRET= (secret key)

```

Verify the mongoose connection link in conn.js (db folder)

```bash
  `mongodb+srv://${dbUser}:${dbPassword}@${dbLink}`
```

Install NPM

```bash
  npm install
```

Run the app

```bash
  npm start
```
