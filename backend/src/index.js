require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const explorerRoutes = require('./routes/explorerRoutes');
const queryRoutes = require('./routes/queryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/explorer', explorerRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
