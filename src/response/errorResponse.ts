export enum CodeEnum {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export enum ErrorEnum {
  USER_NOT_FOUND = 'user not found',
  LOGIN_PASSWORD_NOT_MATCH = 'login or password not match',
  INTERNAL_SERVER_ERROR = 'internal server error',
  CONVERSATION_NOT_FOUND = 'conversation not found',
  USERS_NOT_FOUND = 'users not found',
  AUTHENTICATION_NEEDED = 'authentication needed',
  MESSAGE_CONTENT_NOT_FOUND = 'message content not found',
  MESSAGE_ID_NOT_FOUND = 'messageId not found',
  MESSAGE_NOT_FOUND = 'message not found',
}
