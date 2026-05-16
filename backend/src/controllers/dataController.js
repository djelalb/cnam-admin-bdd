const sqlService = require('../services/sqlService');

exports.updateRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, primaryKeys, oldData, newData } = req.body;

  try {
    // Filter out primary keys from newData to avoid updating identity columns
    const updateData = { ...newData };
    if (primaryKeys && primaryKeys.length > 0) {
      primaryKeys.forEach(pk => delete updateData[pk]);
    }

    const setClause = Object.keys(updateData)
      .map(col => `[${col}] = ${formatValue(updateData[col])}`)
      .join(', ');

    if (!setClause) {
      return res.status(400).json({ message: 'Aucune donnée modifiée' });
    }

    const whereCols = primaryKeys && primaryKeys.length > 0 ? primaryKeys : Object.keys(oldData);
    const whereClause = whereCols
      .map(col => `[${col}] ${oldData[col] === null ? 'IS NULL' : `= ${formatValue(oldData[col])}`}`)
      .join(' AND ');

    const query = `UPDATE [${dbName}].[${schema}].[${tableName}] SET ${setClause} WHERE ${whereClause}`;
    await sqlService.executeQuery(query);
    res.json({ message: 'Ligne mise à jour avec succès' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Échec de la mise à jour', error: err.message });
  }
};

exports.deleteRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, primaryKeys, data } = req.body;

  try {
    const whereCols = primaryKeys && primaryKeys.length > 0 ? primaryKeys : Object.keys(data);
    const whereClause = whereCols
      .map(col => `[${col}] ${data[col] === null ? 'IS NULL' : `= ${formatValue(data[col])}`}`)
      .join(' AND ');

    const query = `DELETE FROM [${dbName}].[${schema}].[${tableName}] WHERE ${whereClause}`;
    await sqlService.executeQuery(query);
    res.json({ message: 'Ligne supprimée avec succès' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Échec de la suppression', error: err.message });
  }
};

exports.insertRow = async (req, res) => {
  const { dbName, tableName } = req.params;
  const { schema, data } = req.body;

  try {
    // Filter out IDENTITY columns if possible, but here we just try to insert what we have
    // Better: use full qualified name to avoid USE GO overhead
    const columns = Object.keys(data).map(c => `[${c}]`).join(', ');
    const values = Object.values(data).map(formatValue).join(', ');

    const query = `INSERT INTO [${dbName}].[${schema}].[${tableName}] (${columns}) VALUES (${values})`;
    await sqlService.executeQuery(query);
    res.json({ message: 'Ligne insérée avec succès' });
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(500).json({ message: 'Échec de l\'insertion', error: err.message });
  }
};

function formatValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''")}'`;
}
