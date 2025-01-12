const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module for file paths

const app = express();
app.use(cors());
app.use(express.json()); // Ensure the server is configured to handle JSON requests

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Import the routes
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Mount the routes properly
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/expenses', expenseRoutes);

// Fallback for missing root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
