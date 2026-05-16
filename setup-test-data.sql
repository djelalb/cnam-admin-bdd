-- =======================================================
-- SCRIPT DE TEST COMPLET POUR SSMS WEB CLIENT
-- =======================================================
-- Ce script crée une base de données de test, des tables,
-- insère des données et propose des requêtes de test CRUD.
-- =======================================================

-- 1. CRÉATION DE LA BASE DE DONNÉES
-- Exécutez ce bloc en premier
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'GestionMagasin')
BEGIN
    CREATE DATABASE [GestionMagasin];
END
GO

-- 2. UTILISATION DE LA BASE ET CRÉATION DES TABLES
USE [GestionMagasin];
GO

-- Table des Catégories
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
    CREATE TABLE Categories (
        ID INT PRIMARY KEY IDENTITY(1,1),
        Nom NVARCHAR(50) NOT NULL,
        Description NVARCHAR(255)
    );
END

-- Table des Produits
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Produits]') AND type in (N'U'))
BEGIN
    CREATE TABLE Produits (
        ID INT PRIMARY KEY IDENTITY(1,1),
        Nom NVARCHAR(100) NOT NULL,
        Prix DECIMAL(10, 2) NOT NULL,
        Stock INT DEFAULT 0,
        CategoryID INT,
        DateAjout DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Produits_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(ID)
    );
END
GO

-- 3. INSERTION DE DONNÉES (Create)
INSERT INTO Categories (Nom, Description) VALUES 
('Électronique', 'Gadgets et appareils'),
('Mobilier', 'Meubles de bureau et maison'),
('Fournitures', 'Papeterie et consommables');

INSERT INTO Produits (Nom, Prix, Stock, CategoryID) VALUES 
('Ordinateur Portable', 1200.00, 15, 1),
('Souris Sans Fil', 25.50, 50, 1),
('Chaise de Bureau', 150.00, 20, 2),
('Bureau en Bois', 300.00, 5, 2),
('Cahier A4', 2.00, 200, 3);
GO

-- 4. REQUÊTE DE LECTURE (Read)
SELECT p.ID, p.Nom, p.Prix, p.Stock, c.Nom AS Categorie
FROM Produits p
JOIN Categories c ON p.CategoryID = c.ID;
GO

-- 5. EXEMPLE DE MISE À JOUR (Update)
UPDATE Produits SET Prix = 1299.99 WHERE Nom = 'Ordinateur Portable';
GO

-- 6. VÉRIFICATION
SELECT * FROM Produits;
GO
