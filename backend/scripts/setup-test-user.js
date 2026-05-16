const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'master',
  options: {
    trustServerCertificate: true,
    integratedSecurity: true // This attempts Windows Authentication
  }
};

async function createTestUser() {
  const loginName = 'ssms_admin';
  const password = 'Password123!';

  console.log(`Attempting to connect to ${config.server} via Windows Auth...`);
  
  try {
    let pool = await sql.connect(config);
    console.log('Connected successfully!');

    console.log(`Creating login [${loginName}]...`);
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = '${loginName}')
      BEGIN
        CREATE LOGIN [${loginName}] WITH PASSWORD = '${password}';
        ALTER SERVER ROLE [sysadmin] ADD MEMBER [${loginName}];
        PRINT 'User created and granted sysadmin rights.';
      END
      ELSE
      BEGIN
        PRINT 'User already exists.';
      END
    `);

    await pool.close();
    console.log('--------------------------------------------------');
    console.log('SUCCESS! You can now use these credentials in the app:');
    console.log(`Server: localhost`);
    console.log(`Auth Type: SQL Server Auth`);
    console.log(`Username: ${loginName}`);
    console.log(`Password: ${password}`);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('FAILED to create user.');
    console.error('Error details:', err.message);
    console.log('\nPossible reasons:');
    console.log('1. SQL Server is not running on localhost.');
    console.log('2. Your current Windows account does not have sysadmin rights on SQL Server.');
    console.log('3. TCP/IP connections are disabled in SQL Server Configuration Manager.');
  }
}

createTestUser();
