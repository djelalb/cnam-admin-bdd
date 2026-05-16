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

exports.getTables = async (req, res) => {
  const { dbName } = req.params;
  try {
    // We must separate USE and SELECT with GO for executeScript to return them as separate results
    const query = `USE [${dbName.replace(/\]/g, ']]')}];\nGO\nSELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`;
    const results = await sqlService.executeScript(query);
    // results[0] is for USE, results[1] is for SELECT
    res.json(results[1].recordset);
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch tables for ${dbName}`, error: err.message });
  }
};

exports.getTableDetails = async (req, res) => {
  const { dbName, tableName } = req.params;
  const schema = req.query.schema || 'dbo';
  try {
    const contextQuery = `USE [${dbName.replace(/\]/g, ']]')}];\nGO\n`;
    
    // Get Columns info
    const columnsQuery = `${contextQuery}SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, CHARACTER_MAXIMUM_LENGTH 
                          FROM INFORMATION_SCHEMA.COLUMNS 
                          WHERE TABLE_NAME = '${tableName.replace(/'/g, "''")}' AND TABLE_SCHEMA = '${schema.replace(/'/g, "''")}'`;
    
    // Get Data (limit to 100 for safety)
    const dataQuery = `${contextQuery}SELECT TOP 100 * FROM [${schema}].[${tableName}]`;
    
    // Get Primary Key
    const pkQuery = `${contextQuery}
      SELECT k.COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
      JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS c ON k.CONSTRAINT_NAME = c.CONSTRAINT_NAME
      WHERE c.CONSTRAINT_TYPE = 'PRIMARY KEY' AND k.TABLE_NAME = '${tableName.replace(/'/g, "''")}' AND k.TABLE_SCHEMA = '${schema.replace(/'/g, "''")}'`;

    const [colsRes, dataRes, pkRes] = await Promise.all([
      sqlService.executeScript(columnsQuery),
      sqlService.executeScript(dataQuery),
      sqlService.executeScript(pkQuery)
    ]);

    res.json({
      columns: colsRes[1].recordset,
      data: dataRes[1].recordset,
      primaryKeys: pkRes[1].recordset.map(r => r.COLUMN_NAME)
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch details for ${tableName}`, error: err.message });
  }
};
