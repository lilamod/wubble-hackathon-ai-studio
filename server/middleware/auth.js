import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ success: false, error: 'Access denied. No token provided.' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token.' })
  }
}
