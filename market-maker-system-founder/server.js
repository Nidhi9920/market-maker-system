// server.js

const express = require('express');
const cors = require('cors');
const createVolume  = require('./src/volumeCreators'); 
const collectSol = require('./src/volatilityHandlers');
const closeSplAccounts = require('./src/closeAccounts')
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Define API endpoints

app.post('/api/volume', (req, res) => {
    const { distributionNumber, totalTransactions } = req.body;
    const result = createVolume(distributionNumber, totalTransactions);
    res.status(201).json(result);
});

app.post('/api/collectSol', (req, res) => {
    const result = collectSol(); // Call the collectSol function
    res.json(result);
});

app.post('/api/closeSpl', (req, res) => {
    const result = closeSplAccounts(); // Call the closeSplAccounts function
    res.json(result);
});

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

app.get('/', (req, res) => {
    res.send('CORS is enabled and server is running');
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
