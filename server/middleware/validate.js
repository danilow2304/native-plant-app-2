const { body, param, validationResult } = require('express-validator');

const optionalText = (field, max) =>
  body(field).optional({ values: 'falsy' }).isString().trim().isLength({ max }).withMessage(`${field} must be at most ${max} characters`);

// Input validation + sanitization for plant create/update.
// (React escapes output by default, so we validate type/length here instead of HTML-escaping stored data.)
const plantRules = [
  body('name').isString().withMessage('name is required').trim().notEmpty().withMessage('name is required').isLength({ max: 100 }).withMessage('name must be at most 100 characters'),
  optionalText('scientificName', 150),
  optionalText('description', 2000),
  optionalText('sunlight', 100),
  optionalText('soil', 200),
  optionalText('water', 100),
  optionalText('height', 50),
  optionalText('bloomSeason', 100),
  optionalText('nativeRange', 300),
  optionalText('wildlifeBenefits', 500),
  body('image').optional({ values: 'falsy' }).trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('image must be an http(s) URL'),
];

const loginRules = [
  body('username').isString().trim().notEmpty().isLength({ max: 50 }),
  body('password').isString().notEmpty().isLength({ max: 200 }),
];

const idRule = [param('id').isMongoId().withMessage('Invalid plant id')];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array().map((e) => ({ field: e.path, message: e.msg })) });
  }
  next();
}

module.exports = { plantRules, loginRules, idRule, handleValidation };
