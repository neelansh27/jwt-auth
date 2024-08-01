const express = require('express')
const bodyParser=require('body-parser')
const router = require('./router/routes')
const PORT = process.env.PORT || 3000;
const cors = require('cors')
const app = express()

// Allowing access to frontend origin
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

// Connecting to router
app.use('/',router);
app.listen(PORT,()=>{
  console.log(`app listening on port ${PORT}`);
})

