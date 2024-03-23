const express = require("express");
 
const bodyParser = require("body-parser");

const cors = require("cors");
const dotenv = require('dotenv');
const app = express();
dotenv.config();
// import user from "./Controllers/user.js";

app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))

 
app.use(express.json());

app.use(cors());
app.use('/', express.static("uploads"))
// import routes

const register = require("./user");
  
app.use("/api/user", register);
 
 

const PORT = process.env.PORT || 3000;
  app.listen(PORT, function(){
    console.log(`Server stated on port ${PORT}`)
})