const sqlService = require('../services/sqlService');

exports.execute = async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const results = await sqlService.executeScript(query);
    // For the UI, we'll return the last result set that has data, or the very last result
    const lastResultWithData = [...results].reverse().find(r => r.recordset && r.recordset.length > 0);
    const finalResult = lastResultWithData || results[results.length - 1];
    
    res.json({
      recordset: finalResult.recordset || [],
      rowsAffected: results.reduce((acc, r) => acc + (Array.isArray(r.rowsAffected) ? r.rowsAffected[0] : r.rowsAffected || 0), 0),
      batchesCount: results.length,
      status: 'success'
    });
  } catch (err) {
    res.status(500).json({ message: 'Query execution failed', error: err.message });
  }
};
