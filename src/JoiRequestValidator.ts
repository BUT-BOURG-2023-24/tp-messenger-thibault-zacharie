import * as joi from "joi";
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

import { Request } from "express";

interface JoiRequestValidatorResponse
{
	error?: string
}

interface JoiRouteValidator
{
	route: string,
	method: string,
	validatorSchema: joi.ObjectSchema<any>
}

class JoiRequestValidator 
{
	validators: JoiRouteValidator[] = 
	[
		{
			route: '/users/create',
			method: 'POST',
			validatorSchema: joi.object({
				username: joi.string().alphanum().min(4).max(12).required(),
				password: joiPassword
                    .string()
                    .minOfSpecialCharacters(1)
                    .minOfLowercase(1)
                    .minOfUppercase(1)
                    .minOfNumeric(1)
                  	.noWhiteSpaces()
                    .onlyLatinCharacters()
                    .required(),
			})
		},
		{
			route: '/users/login',
			method: 'POST',
			validatorSchema: joi.object({
				username: joi.string().required(),
				password: joi.string().required()
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
				edited: joi.boolean().required(),
				deleted: joi.boolean().required(),
				reactions: joi.object().allow(null)
			})
		}
	];

	validate(request: Request): JoiRequestValidatorResponse 
	{
		const validator = this.validators.find((validator) => validator.route === request.baseUrl + request.route.path);

		if(!validator) {
			return {};
		}

		const { error } = validator.validatorSchema.validate(request.body);

		if(error) {
			return { error: error.message };
		};

		return {};
	}
}

export const JoiRequestValidatorInstance = new JoiRequestValidator();