import { body } from 'express-validator';

export const seriesValidation = [
  body('name')
    .isString()
    .withMessage('name is required'),
  body('name')
    .isLength({ min: 1 })
    .withMessage('name is required'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
  body('airDate')
    .if(body('airDate').exists())
    .isDate()
    .withMessage('airDate must be a date'),
  body('inProduction')
    .if(body('inProduction').exists())
    .isBoolean()
    .withMessage('inproduction must be a boolean'),
  body('image')
    .if(body('image').exists())
    .isBase64()
    .withMessage('image is required'),
  body('description')
    .if(body('description').exists())
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .if(body('language').exists())
    .isLength({ min: 2 })
    .withMessage('language must be a string of length 2'),
  body('language')
    .if(body('language').exists())
    .isLength({ max: 2 })
    .withMessage('language must be a string of length 2'),
  body('network')
    .isString()
    .withMessage('network must be a string'),
  body('homepage')
    .if(body('homepage').exists())
    .isURL()
    .withMessage('url must be a string'),
];

export const genreValidation = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('name is required'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
  body('name')
    .isString()
    .withMessage('name is required'),
];

export const serieValidation = [
  body('number')
    .isInt({min: 1 })
    .withMessage('must be an integer larger than 0'),
  body('image')
    .isBase64()
    .withMessage('image is required'),
];

export const seasonValidation = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('name is required'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
  body('number')
    .isInt({ min: 1 })
    .withMessage('must be an integer larger than 0'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('description')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
  body('image')
    .isBase64()
    .withMessage('image is required'),
];

export const rateValidation = [
  body('rating')
    .isInt({ min: 0 })
    .withMessage('Rating can be from 0-5'),
  body('rating')
    .isInt({ max: 5 })
    .withMessage('Rating can be from 0-5'),
];

export const stateValidation = [
  body('status')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
];

  //hvernig validation á image????