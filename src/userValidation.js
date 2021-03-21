import { body, validationResult } from 'express-validator';

// post /users/login
export const loginValidation = [
    body('email')
        .isLength({ min: 1 })
        .withMessage('Netfang má ekki vera tómt'),
    body('email')
        .isLength({ max: 255 })
        .withMessage('Netfang má ekki vera lengra en 255 stafir'),
    body('email')
        .isEmail()
        .withMessage('Þarf að vera alvöru netfang'),
    body('email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Lykilorð má ekki vera tómt'),
    body('password')
        .isLength({ max: 255})
        .withMessage('Lykilorð getur ekki verið lengra en 255 stafir'),
    body('password')
        .trim()
        .escape()
];

// post /users/register
export const registerValidation = [
    body('name')
        .isLength({ min: 1 })
        .withMessage('Notendanafn má ekki vera tómt'),
    body('name')
        .isLength({max : 255})
        .withMessage('Notendanafn má ekki vera lengra en 255 stafir'),
    body('name')
        .trim()
        .escape(),
    body('email')
        .isLength({ min: 1 })
        .withMessage('Netfang má ekki vera tómt'),
    body('email')
        .isLength({ max: 255 })
        .withMessage('Netfang má ekki vera lengra en 255 stafir'),
    body('email')
        .isEmail()
        .withMessage('Þarf að vera alvöru netfang'),
    body('email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Lykilorð má ekki vera tómt'),
    body('password')
        .isLength({ max: 255})
        .withMessage('Lykilorð getur ekki verið lengra en 255 karakterar'),
    body('password')
        .trim()
        .escape()
];

// PATCH /users/me 
export const profileValidation = [
    body('email').optional()
        .isLength({ min: 1 })
        .withMessage('Netfang má ekki vera tómt'),
    body('email').optional()
        .isLength({ max: 255 })
        .withMessage('Netfang má ekki vera lengra en 255 stafir'),
    body('email').optional()
        .isEmail()
        .withMessage('Þarf að vera alvöru netfang'),
    body('email').optional()
        .normalizeEmail(),
    body('password').optional()
        .isLength({ min: 1 })
        .withMessage('Lykilorð má ekki vera tómt'),
    body('password').optional()
        .isLength({ max: 255})
        .withMessage('Lykilorð getur ekki verið lengra en 255 karakterar'),
    body('password').optional()
        .trim()
        .escape()
]