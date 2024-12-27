const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const signupRoutes = require('./routes/signupRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


app.use('/signup', signupRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
