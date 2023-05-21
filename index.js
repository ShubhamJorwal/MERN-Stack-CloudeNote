const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 
const dotenv = require("dotenv");
const path = require("path");

connectToMongo();


// Config
dotenv.config({ path: "C.env" })

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


// to run together both (server + client)
app.use(express.static(path.join(__dirname, "./dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})