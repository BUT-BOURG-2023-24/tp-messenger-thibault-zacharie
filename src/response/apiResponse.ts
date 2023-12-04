import { type ErrorEnum, type CodeEnum } from './errorResponse'

export class ApiResponse {
  public error?: ErrorEnum | CodeEnum
  public data?: unknown

  constructor (error?: ErrorEnum | CodeEnum, data?: any) {
    this.error = error
    this.data = data
  }
}
