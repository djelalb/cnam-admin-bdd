const sqlService = require('../services/sqlService');

exports.execute = async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const result = await sqlService.executeQuery(query);
    res.json({
      recordset: result.recordset,
      rowsAffected: result.rowsAffected,
      output: result.output
    });
  } catch (err) {
    res.status(500).json({ message: 'Query execution failed', error: err.message });
  }
};
