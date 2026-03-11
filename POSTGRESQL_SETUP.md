# Configuration PostgreSQL

## Étapes de configuration

### 1. Configurer les variables d'environnement
Modifiez le fichier `.env.local` avec vos identifiants PostgreSQL:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pays_db
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pays_db
```

### 2. Créer la base de données PostgreSQL
Connectez-vous à PostgreSQL et exécutez:
```sql
CREATE DATABASE pays_db;
```

### 3. Créer les tables
Exécutez le script SQL dans PostgreSQL:
```bash
psql -U postgres -d pays_db -f lib/init.sql
```

Ou directement dans psql:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob');
```

### 4. Démarrer l'application
```bash
npm run dev
```

### 5. Tester les endpoints

**GET - Récupérer tous les utilisateurs:**
```bash
curl http://localhost:3000/api/pays
```

**POST - Ajouter un nouvel utilisateur:**
```bash
curl -X POST http://localhost:3000/api/pays \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie"}'
```

## Structure des fichiers

- `.env.local` - Variables d'environnement
- `lib/db.ts` - Connexion à la base de données
- `lib/init.sql` - Script SQL pour initialier la base
- `app/api/pays/routes.js` - Routes API connectées à PostgreSQL
