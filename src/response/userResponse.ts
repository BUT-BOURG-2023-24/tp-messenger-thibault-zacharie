import { type IUser } from '../modules/users/userModel'

export class UserResponse {
  public user: IUser
  public token: string
  public isNewUser: boolean

  constructor (user: IUser, token: string, isNewUser: boolean) {
    this.user = user
    this.token = token
    this.isNewUser = isNewUser
  }
}
