import * as joi from 'joi'

import { type Request } from 'express'
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = joi.extend(joiPasswordExtendCore)

interface JoiRequestValidatorResponse {
  error?: string
}

interface JoiRouteValidator {
  route: string
  method: string
  validatorSchema: joi.ObjectSchema<any>
}

class JoiRequestValidator {
  validators: JoiRouteValidator[] =
    [
      {
        route: '/users/login',
        method: 'POST',
        validatorSchema: joi.object({
          username: joi.string().alphanum().required(),
          password: joiPassword
            .string()
            .min(5).max(15)
            .onlyLatinCharacters()
            .required()
        })
      },
      {
        route: '/message/create',
        method: 'POST',
        validatorSchema: joi.object({
          conversationId: joi.string().hex().length(24),
          from: joi.string().hex().length(24),
          content: joi.string().max(255),
          replyTo: joi.string().hex().length(24).allow(null),
          edited: joi.boolean(),
          deleted: joi.boolean(),
          reactions: joi.object().allow(null),
          user: joi.object({
            id: joi.string().hex().length(24)
          })
        })
      },
      {
        route: '/message/:id/edit',
        method: 'POST',
        validatorSchema: joi.object({
          editContent: joi.string().max(255),
          user: joi.object({
            id: joi.string().hex().length(24)
          })
        })
      },
      {
        route: '/message/:id/react',
        method: 'POST',
        validatorSchema: joi.object({
          reaction: joi.string(),
          user: joi.object({
            id: joi.string().hex().length(24)
          })
        })
      },
      {
        route: '/conversations/create',
        method: 'POST',
        validatorSchema: joi.object({
          participants: joi.array().items(joi.string().hex().length(24)).required(),
          messages: joi.array().items(joi.string().hex().length(24)).required(),
          title: joi.string().max(24),
          seen: joi.array().items(
            joi.string().hex().length(24)
          ),
          user: joi.object({
            id: joi.string().hex().length(24)
          })
        })
      },
      {
        route: '/conversations/addMessage',
        method: 'PUT',
        validatorSchema: joi.object({
          message: joi.string().hex().length(24)
        }).or('message')
      },
      {
        route: '/conversations/setSeen',
        method: 'PUT',
        validatorSchema: joi.object({
          message: joi.string().hex().length(24)
        }).or('seen')
      }
    ]

  validate (request: Request): JoiRequestValidatorResponse {
    const validator = this.validators.find((validator) => validator.route === request.baseUrl + request.route.path)

    if (!validator) {
      return {}
    }

    const { error } = validator.validatorSchema.validate(request.body)

    if (error) {
      return { error: error.message }
    };

    return {}
  }
}

export const JoiRequestValidatorInstance = new JoiRequestValidator()
