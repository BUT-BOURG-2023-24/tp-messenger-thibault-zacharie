import * as joi from "joi";
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
				username: joi.string().alphanum().min(5).required(),
				password: joi.string().min(8).required()
			})
		},
		{
			route: '/users/login',
			method: 'POST',
			validatorSchema: joi.object({
				username: joi.string().required(),
				password: joi.string().required()
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