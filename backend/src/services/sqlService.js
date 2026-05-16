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

  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}

module.exports = new SqlService();
