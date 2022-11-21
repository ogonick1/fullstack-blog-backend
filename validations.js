import {body} from 'express-validator';

export const loginValidation = [
  body('email', 'not corect email').isEmail(),
  body('password', 'min 5 sumbol').isLength({min: 5}),
];
export const registerValidation = [
  body('email', 'not corect email').isEmail(),
  body('password', 'min 5 sumbol').isLength({min: 5}),
  body('fullName', 'write your name').isLength({min: 3}),
  body('avatar').optional().isURL(),
];
export const postCreateValidation = [
  body('title', 'write title').isLength({min: 3}).isString(),
  body('text', 'write text post').isLength({min: 5}).isString(),
  body('tags', 'write array tegs').optional().isString(),
  body('imageUrl', 'invalid URL').optional().isString(),
];