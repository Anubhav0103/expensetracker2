const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use sessions for authentication
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true
}));

// ✅ Routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
const purchaseRoutes = require("./routes/purchaseRoutes"); // ✅ Correct file name
app.use("/purchase", purchaseRoutes);


// ✅ Serve static files (Frontend)
app.use(express.static('public'));

app.listen(5000, () => console.log("Server is running at http://localhost:5000"));
