const jwt = require('jsonwebtoken')

const authentication = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res.status(401).json({ message: 'Authentication Failed' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey')
    req.accountAddress = decoded.accountAddress
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { authentication }
