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
  body('name')
    .isLength({ min: 1 })
    .withMessage('name is required'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
  body('airDate')
    .isDate()
    .withMessage('airDate must be a date'),
  body('inProduction')
    .isBoolean()
    .withMessage('inproduction must be a boolean'),
  body('image')
    .matches(new RegExp('^[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif)$'))
    .withMessage('image is required'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isLength({ min: 2 })
    .withMessage('language must be a string of length 2'),
  body('language')
    .isLength({ max: 2 })
    .withMessage('language must be a string of length 2'),
  body('network')
    .isString()
    .withMessage('network must be a string'),
  body('homepage')
    .isString()
    .withMessage('url must be a string'),
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
  // body('image')
  //  .is
  //  .withMessage('image is required'),
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
    .matches('Langar að horfa|Er að horfa|Hef horft|')
    .withMessage('Verður að tilgreina stöðu: Langar að horfa, Er að horfa, Heft horft eða enga stöðu'),
];

export const patchSeriesValidation = [
  body('name')
  .if(body('name').exists())
  .isLength({ min: 1 })
  .withMessage('name is required'),
body('name')
  .if(body('name').exists())
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
   .matches(new RegExp('^[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif)$'))
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
.if(body('network').exists())
  .isString()
  .withMessage('network must be a string'),
body('homepage')
.if(body('homepage').exists())
  .isString()
  .withMessage('url must be a string'),
];

export const episodeValidation = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('episodes name cannot be empty'),
  body('name')
    .isLength({ max: 255 })
    .withMessage('episode name cannot exceed 255 characters'),
  body('number')
    .isInt({ min: 1 })
    .withMessage('number must be larger than 0'),
  body('date')
    .isDate()
    .withMessage('date must be valid'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
];