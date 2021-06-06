const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('token')
  if (!token)
    return res.status(401).json({ message: 'Authentication error Error' })

  try {
    const decoded = jwt.verify(token, 'randomString')
    req.user = decoded.user
    next()
  } catch (e) {
    console.error(e)
    res.status(500).send({ message: 'Invalid Token' })
  }
}
