import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const registerUser = async (req, res) => {
  const { email, password } = req.body
  const { user, token } = await userService.register(email, password)
  res.status(201).json(
    new ApiResponse('User registered successfully', {
      user: { id: user._id, email: user.email },
      token
    })
  )
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  const { user, token } = await userService.login(email, password)
  res.json(
    new ApiResponse('Login successful', {
      user: { id: user._id, email: user.email },
      token
    })
  )
}

export const getMe = async (req, res) => {
  const user = await userService.getProfile(req.user.id)
  res.json(new ApiResponse('Profile fetched successfully', user))
}
