const router = require('express').Router();

router.get('/',(req,res)=>{
  res.send('App is working');
})

module.exports = router
