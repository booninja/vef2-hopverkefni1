import { body } from 'express-validator';

export const seriesValidation = [
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

export const genreValidation = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('name is required'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('max 128 characters'),
];
export const serieValidation = [
  body('number')
    .isInt({ min: 1 })
    .withMessage('must be an integer larger than 0'),
  // body('image')
  //  .is
  //  .withMessage('image is required'),
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

// //patch
// export const patchSeriesValidation = [
//   if(body('name').exists()).isLength({ min: 1 })
//     .withMessage('name is required'),
//   body('name').if().exists()
//     .isLength({ max: 128 })
//     .withMessage('max 128 characters'),
//    body('airDate').if().exists()
//      .isDate()
//     .withMessage('airDate must be a date'),
//   body('inproduction').if().exists()
//     .isBoolean()
//     .withMessage('inproduction must be a boolean'),
//   // body('image').if().exists()
//   //   .is
//   //   .withMessage('image is required'),
//   body('description').if().exists()
//     .isString()
//     .withMessage('description must be a string'),
//   body('language').if().exists()
//       .isLength({ min: 2 })
//     .withMessage('language must be a string of length 2'),
//   body('language').if().exists()
//       .isLength({ max: 2 })
//     .withMessage('language must be a string of length 2'),
//   body('network').if().exists()
//     .isString()
//     .withMessage('network must be a string'),
//   body('website').if().exists()
//     .isString()
//     .withMessage('url must be a string'),
// ];
