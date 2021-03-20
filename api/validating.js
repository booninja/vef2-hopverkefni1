import { body, validationResult } from 'express-validator';
import xss from 'xss';


const SerievalidationMiddleware = [
    body('name')
      .isLength({ min: 1 })
      .withMessage('name is required'),
    body('name')
      .isLength({ max: 128 })
      .withMessage('max 128 characters'),
    body('airDate')
      .isDate()
      .withMessage('airDate must be a date'),
    body('inproduction is required')
      .isBoolean()
      .withMessage('inproduction must be a boolean'),
    body('image')
      .isLength({min: 1})
      .withMessage('image is required'),
    body('descritption')
      .isString()
      .withMessage('description must be a string'),
    body('language')
        .isLength({ min: 2 })
      .withMessage('language must be a string of length 2'),
    body('language')
        .isLength({ max: 2 })
      .withMessage('language must be a string of length 2'),
  ];
  const SeriexssSanitizationMiddleware = [
    body('name').customSanitizer((v) => xss(v)),
    body('nationalId').customSanitizer((v) => xss(v)),
    body('comment').customSanitizer((v) => xss(v)),
    body('anonymous').customSanitizer((v) => xss(v)),
  ];

  body('id')
  .isLength({ min: 1 })
  .withMessage('name is required'),
body('rating')
  .isLength({ max: 128 })
  .withMessage('rating must be an integer, one of 0, 1, 2, 3, 4, 5'),

  //hvernig validation á image????