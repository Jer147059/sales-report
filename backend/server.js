/**************************************************************************** */
// Setup
/**************************************************************************** */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")

require('dotenv').config();

// port and express
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

// support incoming JSON entities
app.use(express.json());
app.use(cors());


// connect to mongoDB server
mongoose.connect(process.env.SUPPLIESDB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

// route of sales API
const salesRouter = require('./routes/sales');
app.use('/sales', salesRouter);

app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
});

