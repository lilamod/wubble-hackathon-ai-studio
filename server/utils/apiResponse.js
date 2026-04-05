export class ApiResponse {
  constructor(message, data = null, success = true) {
    this.success = success
    this.message = message
    this.data = data
    this.timestamp = new Date().toISOString()
  }
}