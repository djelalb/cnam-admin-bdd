const sqlService = require('../services/sqlService');

exports.updateRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, primaryKeys, oldData, newData } = req.body;

  try {
    const contextQuery = `USE [${dbName.replace(/\]/g, ']]')}];\nGO\n`;
    
    // Build SET clause
    const setClause = Object.keys(newData)
      .map(col => `[${col}] = ${formatValue(newData[col])}`)
      .join(', ');

    // Build WHERE clause using Primary Keys or all old columns if no PK
    const whereCols = primaryKeys && primaryKeys.length > 0 ? primaryKeys : Object.keys(oldData);
    const whereClause = whereCols
      .map(col => `[${col}] ${oldData[col] === null ? 'IS NULL' : `= ${formatValue(oldData[col])}`}`)
      .join(' AND ');

    const query = `${contextQuery} UPDATE [${schema}].[${tableName}] SET ${setClause} WHERE ${whereClause}`;
    await sqlService.executeScript(query);
    res.json({ message: 'Row updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update row', error: err.message });
  }
};

exports.deleteRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, primaryKeys, data } = req.body;

  try {
    const contextQuery = `USE [${dbName.replace(/\]/g, ']]')}];\nGO\n`;
    
    const whereCols = primaryKeys && primaryKeys.length > 0 ? primaryKeys : Object.keys(data);
    const whereClause = whereCols
      .map(col => `[${col}] ${data[col] === null ? 'IS NULL' : `= ${formatValue(data[col])}`}`)
      .join(' AND ');

    const query = `${contextQuery} DELETE FROM [${schema}].[${tableName}] WHERE ${whereClause}`;
    await sqlService.executeScript(query);
    res.json({ message: 'Row deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete row', error: err.message });
  }
};

exports.insertRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, data } = req.body;

  try {
    const contextQuery = `USE [${dbName.replace(/\]/g, ']]')}];\nGO\n`;
    
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data).map(formatValue).join(', ');

    const query = `${contextQuery} INSERT INTO [${schema}].[${tableName}] (${columns}) VALUES (${values})`;
    await sqlService.executeScript(query);
    res.json({ message: 'Row inserted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to insert row', error: err.message });
  }
};

function formatValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''")}'`;
}
