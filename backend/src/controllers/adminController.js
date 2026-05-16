const sqlService = require('../services/sqlService');

exports.createDatabase = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Database name is required' });
  
  try {
    // Sanitize name by wrapping in brackets
    const query = `CREATE DATABASE [${name.replace(/\]/g, ']]')}]`;
    await sqlService.executeQuery(query);
    res.json({ message: `Database ${name} created successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create database', error: err.message });
  }
};

exports.dropDatabase = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Database name is required' });

  try {
    const query = `DROP DATABASE [${name.replace(/\]/g, ']]')}]`;
    await sqlService.executeQuery(query);
    res.json({ message: `Database ${name} dropped successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to drop database', error: err.message });
  }
};

exports.createLogin = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ message: 'Login name and password are required' });

  try {
    const query = `CREATE LOGIN [${name.replace(/\]/g, ']]')}] WITH PASSWORD = '${password.replace(/'/g, "''")}'`;
    await sqlService.executeQuery(query);
    res.json({ message: `Login ${name} created successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create login', error: err.message });
  }
};

exports.dropLogin = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Login name is required' });

  try {
    const query = `DROP LOGIN [${name.replace(/\]/g, ']]')}]`;
    await sqlService.executeQuery(query);
    res.json({ message: `Login ${name} dropped successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to drop login', error: err.message });
  }
};

exports.backupDatabase = async (req, res) => {
  const { name, path } = req.body;
  if (!name || !path) return res.status(400).json({ message: 'Database name and backup path are required' });

  try {
    const query = `BACKUP DATABASE [${name.replace(/\]/g, ']]')}] TO DISK = '${path.replace(/'/g, "''")}'`;
    await sqlService.executeQuery(query);
    res.json({ message: `Backup of ${name} started successfully at ${path}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to backup database', error: err.message });
  }
};

exports.restoreDatabase = async (req, res) => {
  const { name, path } = req.body;
  if (!name || !path) return res.status(400).json({ message: 'Database name and backup path are required' });

  try {
    // We use WITH REPLACE to overwrite any existing database with the same name
    // We also use SINGLE_USER mode to kick off any active connections before restoring
    const query = `
      ALTER DATABASE [${name.replace(/\]/g, ']]')}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
      GO
      RESTORE DATABASE [${name.replace(/\]/g, ']]')}] FROM DISK = '${path.replace(/'/g, "''")}' WITH REPLACE;
      GO
      ALTER DATABASE [${name.replace(/\]/g, ']]')}] SET MULTI_USER;
    `;
    await sqlService.executeScript(query);
    res.json({ message: `Database ${name} restored successfully from ${path}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to restore database', error: err.message });
  }
};
