import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export class UserService {
  async register(email, password) {
    const existing = await User.findOne({ email })
    if (existing) throw new Error('Email already in use')
    const user = await User.create({ email, password })
    return { user, token: this.generateToken(user._id) }
  }

  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials')
    }
    return { user, token: this.generateToken(user._id) }
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password')
    if (!user) throw new Error('User not found')
    return {
      id: user._id,
      email: user.email,
      wubbleApiKey: user.wubbleApiKey || null
    }
  }

  async saveWubbleApiKey(userId, apiKey) {
    await User.findByIdAndUpdate(userId, { wubbleApiKey: apiKey })
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  }
}

export const userService = new UserService()
