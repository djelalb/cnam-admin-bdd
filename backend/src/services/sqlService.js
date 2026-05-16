const sql = require('mssql');

class SqlService {
  constructor() {
    this.pool = null;
  }

  async connect(config) {
    try {
      if (this.pool) {
        await this.pool.close();
      }
      
      // Default options for SQL Server
      const connectionConfig = {
        ...config,
        options: {
          encrypt: true, // For Azure/Modern SQL Server
          trustServerCertificate: true, // For self-signed certificates/local dev
          ...config.options
        }
      };

      this.pool = await sql.connect(connectionConfig);
      console.log('Connected to SQL Server');
      return true;
    } catch (err) {
      console.error('Database connection failed: ', err);
      throw err;
    }
  }

  async executeQuery(query) {
    if (!this.pool) {
      throw new Error('Not connected to database');
    }
    try {
      const result = await this.pool.request().query(query);
      return result;
    } catch (err) {
      console.error('SQL query execution failed: ', err);
      throw err;
    }
  }

  async executeScript(script) {
    if (!this.pool) {
      throw new Error('Not connected to database');
    }
    
    // Split the script into batches based on the "GO" keyword (case insensitive, start of line)
    const batches = script.split(/^\s*GO\s*$/im);
    const results = [];
    
    for (const batch of batches) {
      const trimmedBatch = batch.trim();
      if (trimmedBatch) {
        try {
          const result = await this.pool.request().query(trimmedBatch);
          results.push({
            recordset: result.recordset,
            rowsAffected: result.rowsAffected,
            status: 'success'
          });
        } catch (err) {
          results.push({
            status: 'error',
            error: err.message,
            batch: trimmedBatch.substring(0, 50) + '...'
          });
          // Stop execution on first error in script
          throw new Error(`Error in batch: ${err.message}`);
        }
      }
    }
    return results;
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}

module.exports = new SqlService();
