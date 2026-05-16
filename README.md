# SSMS Web Client

Interface web moderne pour la gestion de SQL Server, inspirée de SSMS.

## 🚀 Fonctionnalités
- **Authentification :** SQL Server (SA/Pass) & Windows Auth.
- **Explorateur d'Objets :** Visualisation des bases de données et des logins serveurs.
- **Éditeur SQL :** Exécution de requêtes avec rendu tabulaire, temps d'exécution et export CSV.
- **Administration :** Création/Suppression de bases et de logins, lancements de sauvegardes (backups).

## 🛠️ Stack Technique
- **Frontend :** React 19, Vite, TailwindCSS, Lucide Icons.
- **Backend :** Node.js, Express, mssql.
- **Database :** SQL Server 2022 (Docker).

## 📦 Installation & Démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Démarrer SQL Server (Docker) :**
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
   ```

3. **Lancer l'application (Backend + Frontend) :**
   ```bash
   npm run dev
   ```
   - Frontend : `http://localhost:5173`
   - Backend : `http://localhost:5000`

## 🔑 Identifiants de test par défaut
- **Serveur :** `localhost`
- **Utilisateur :** `sa`
- **Mot de passe :** `Password123!`
