const router = require('express').Router();

// Importing client object for database access
const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient();

router.get('/',(req,res)=>{
  res.send('App is working');
})

module.exports = router
