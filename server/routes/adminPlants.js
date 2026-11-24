const express = require('express');
const Plant = require('../models/Plant');
const requireAuth = require('../middleware/auth');
const { plantRules, idRule, handleValidation } = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth); // every route below requires a logged-in admin

// Whitelist fields so clients can't inject extra properties (mass assignment).
const FIELDS = ['name', 'scientificName', 'description', 'sunlight', 'soil', 'water', 'height', 'bloomSeason', 'nativeRange', 'wildlifeBenefits', 'image'];
const pick = (src) => Object.fromEntries(FIELDS.filter((f) => src[f] !== undefined).map((f) => [f, src[f]]));

const wrap = (fn) => (req, res) => fn(req, res).catch(() => res.status(500).json({ message: 'Server error' }));

// View all plant records
router.get('/', wrap(async (req, res) => {
  res.json(await Plant.find().sort({ name: 1 }));
}));

// View one plant record
router.get('/:id', idRule, handleValidation, wrap(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json(plant);
}));

// Add
router.post('/', plantRules, handleValidation, wrap(async (req, res) => {
  res.status(201).json(await Plant.create(pick(req.body)));
}));

// Edit
router.put('/:id', idRule, plantRules, handleValidation, wrap(async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(req.params.id, { $set: pick(req.body) }, { new: true, runValidators: true });
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json(plant);
}));

// Delete
router.delete('/:id', idRule, handleValidation, wrap(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ message: 'Plant deleted' });
}));

module.exports = router;
