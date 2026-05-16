const sqlService = require('../services/sqlService');

exports.login = async (req, res) => {
  const { server, database, user, password, authType } = req.body;

  let config = {
    server: server,
    database: database || 'master',
    options: {
      trustServerCertificate: true
    }
  };

  if (authType === 'sql') {
    config.user = user;
    config.password = password;
  } else {
    // Windows Auth usually requires domain or specific settings in Node.js mssql
    // This is often handled by leaving user/password empty if running on Windows with integrated security
    // or using 'domain' property.
    config.options.integratedSecurity = true;
  }

  try {
    await sqlService.connect(config);
    res.json({ message: 'Login successful', server, database: config.database });
  } catch (err) {
    res.status(401).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await sqlService.disconnect();
    res.json({ message: 'Logged out successful' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};
