const jwt = require('jsonwebtoken');

function verify(req,res,next){
  const token = req.headers.token;
  console.log('sdf')
  if (!token){
    return res.status(400).json({err:"Token Verification Failed"});
  }
  const valid = jwt.verify(token,process.env.JWT_SECRET)
  if (!valid){
    return res.status(400).json({err: "Token is Invalid"})
  }
  console.log(valid)
  req.user=valid;
  return next();
}

module.exports = verify
