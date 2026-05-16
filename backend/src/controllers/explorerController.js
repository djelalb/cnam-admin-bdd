const sqlService = require('../services/sqlService');

exports.getDatabases = async (req, res) => {
  try {
    const result = await sqlService.executeQuery("SELECT name, database_id, create_date FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch databases', error: err.message });
  }
};

exports.getLogins = async (req, res) => {
  try {
    const result = await sqlService.executeQuery("SELECT name, type_desc, create_date FROM sys.server_principals WHERE type IN ('S', 'U', 'G')");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logins', error: err.message });
  }
};
