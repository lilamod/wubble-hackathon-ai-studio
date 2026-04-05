import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { user, token } = await userService.register(email, password)
    res.status(201).json(new ApiResponse('User registered successfully', {
      user: { id: user._id, email: user.email },
      token
    }))
  } catch (err) { next(err) }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { user, token } = await userService.login(email, password)
    res.json(new ApiResponse('Login successful', {
      user: { id: user._id, email: user.email },
      token
    }))
  } catch (err) { next(err) }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)
    res.json(new ApiResponse('Profile fetched successfully', user))
  } catch (err) { next(err) }
}
