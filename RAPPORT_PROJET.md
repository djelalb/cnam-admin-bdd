# Rapport de Projet : SSMS Web Client

## 1. Vue d'ensemble
L'objectif de ce projet était de créer une interface web moderne et intuitive reproduisant les fonctionnalités essentielles de **SQL Server Management Studio (SSMS)**. L'application permet de se connecter à une instance SQL Server, d'explorer ses objets, d'exécuter des requêtes et de réaliser des actions d'administration.

## 2. Stack Technique
- **Monorepo :** Gestion par npm workspaces.
- **Backend :** Node.js avec Express et la bibliothèque `mssql` pour la communication avec SQL Server.
- **Frontend :** React 19 (Vite), TailwindCSS pour le style, Lucide-React pour les icônes et Axios pour les appels API.
- **Base de données de test :** SQL Server 2022 fonctionnant sous Docker.

## 3. Fonctionnalités Implémentées

### A. Authentification
- Support de l'authentification **SQL Server** (User/Password).
- Support de l'authentification **Windows** (via `integratedSecurity`).
- Page de login stylisée avec feedback d'erreur en temps réel.

### B. Explorateur d'Objets (Sidebar)
- Affichage dynamique des **Bases de données** (filtrage des bases système).
- Affichage des **Logins** de sécurité au niveau du serveur.
- Bouton de rafraîchissement global.

### C. Éditeur de Requêtes SQL
- Zone de saisie multi-ligne avec numérotation.
- **Import SQL :** Possibilité d'importer et d'exécuter des fichiers `.sql` directement depuis l'interface.
- **Support Multi-Batch :** Gestion intelligente du mot-clé `GO` pour exécuter des scripts complexes en plusieurs étapes.
- Exécution de requêtes avec retour sur le temps d'exécution.
- Visualisation des résultats sous forme de tableau dynamique.
- Export des résultats au format **CSV**.
- Gestion des erreurs SQL détaillées.

### D. Actions d'Administration
- **Gestion des Bases :** Création et suppression de bases de données avec protection contre les injections SQL (via crochets `[]`).
- **Sécurité :** Création et suppression de Logins SQL Server avec définition de mot de passe.
- **Sauvegarde :** Lancement de backups vers un chemin spécifique sur le serveur.

## 4. Architecture du Code

### Backend (`/backend/src`)
- `index.js` : Point d'entrée, configuration Express et enregistrement des routes.
- `services/sqlService.js` : Singleton gérant le pool de connexion unique à SQL Server.
- `controllers/` : Logique métier pour chaque module (Auth, Explorer, Query, Admin).
- `routes/` : Définition des points de terminaison API.

### Frontend (`/frontend/src`)
- `App.jsx` : Gestion de l'état global (connexion, onglets actifs) et layout principal.
- `components/Login.jsx` : Interface de connexion avec animations.
- `components/ObjectExplorer.jsx` : Composant de navigation arborescente.
- `components/QueryEditor.jsx` : Éditeur de code et tableau de résultats.
- `components/AdminActions.jsx` : Formulaires d'administration groupés par section.

## 5. Guide de Test (Parcours Utilisateur)

### Étape 1 : Préparation de l'environnement
1. Assurez-vous que Docker est lancé.
2. Démarrez le projet : `npm run dev` à la racine.

### Étape 2 : Test de Connexion
1. Accédez à `http://localhost:5173`.
2. Utilisez les identifiants par défaut (remplis automatiquement) :
   - Serveur : `localhost`
   - User : `sa`
   - Password : `Password123!`
3. Cliquez sur **Se connecter**. Vous devriez arriver sur le Dashboard.

### Étape 3 : Exploration
1. Dans la colonne de gauche (**Explorateur**), cliquez sur "Bases de données".
2. Vous devriez voir `master`, `tempdb`, etc. (ou les bases que vous avez créées).
3. Cliquez sur "Sécurité / Logins" pour voir les utilisateurs du serveur.

### Étape 4 : Exécution de requêtes
1. Dans l'onglet **Query Editor**, tapez : `SELECT name, compatibility_level FROM sys.databases`.
2. Cliquez sur **Exécuter**.
3. Vérifiez que les résultats s'affichent dans le tableau en bas.
4. Testez le bouton **Copier CSV** pour vérifier l'export.

### Étape 5 : Administration
1. Allez dans l'onglet **Admin Actions**.
2. **Base de données :** Entrez "TestDB_Gemini" et cliquez sur **Créer**. Retournez dans l'Explorateur et cliquez sur le bouton de rafraîchissement pour voir la nouvelle base.
3. **Sécurité :** Créez un login "test_user" avec un mot de passe.
4. **Backup :** Entrez "master" comme base et `/var/opt/mssql/data/master_test.bak` comme chemin. Cliquez sur **Lancer le Backup**.

## 6. Améliorations UI/UX apportées
- **Thème Sombre Premium :** Palette de couleurs basée sur Slate-900/950 avec des touches de bleu électrique.
- **Animations :** Transitions fluides lors de la navigation entre onglets et apparition des composants (via Tailwind Animate).
- **Feedback visuel :** États de chargement (spinners), notifications de succès/erreur stylisées.
- **Ergonomie :** Tableaux de résultats avec survol de ligne (hover), barre d'état d'exécution, et sidebar rétractable.
