const express = require('express');
const connectDB = require('./db');
const voterRoute = require('./routes/voterRoutes.js')
const candidateRoute = require('./routes/candidateRoutes.js')
const app = express();
app.use(express.json()); // Middleware to parse JSON request body

connectDB();


app.use('/voter', voterRoute)
app.use('/candidate', candidateRoute)


app.listen(3000, () => {
    console.log('server is running on port 3000');
});
