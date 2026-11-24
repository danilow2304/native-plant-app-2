import express from "express";
import { ObjectId } from "mongodb";
import { plants } from "../db.js";
import requireAuth from "../middleware/auth.js";
import { plantRules, idRule, handleValidation } from "../middleware/validate.js";

const router = express.Router();
router.use(requireAuth); // every route below requires a logged-in admin

// Whitelist fields so clients can't inject extra properties.
const FIELDS = [
  "name", "scientificName", "description", "sunlight", "soil", "water",
  "height", "bloomSeason", "nativeRange", "wildlifeBenefits", "image",
];
const pick = (src) =>
  Object.fromEntries(FIELDS.filter((f) => src[f] !== undefined).map((f) => [f, src[f]]));

const wrap = (fn) => (req, res) =>
  fn(req, res).catch(() => res.status(500).json({ message: "Server error" }));

// View all plant records
router.get("/", wrap(async (req, res) => {
  res.json(await plants.find().sort({ name: 1 }).toArray());
}));

// View one plant record
router.get("/:id", idRule, handleValidation, wrap(async (req, res) => {
  const plant = await plants.findOne({ _id: new ObjectId(req.params.id) });
  if (!plant) return res.status(404).json({ message: "Plant not found" });
  res.json(plant);
}));

// Add
router.post("/", plantRules, handleValidation, wrap(async (req, res) => {
  const doc = pick(req.body);
  const result = await plants.insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
}));

// Edit
router.put("/:id", idRule, plantRules, handleValidation, wrap(async (req, res) => {
  const result = await plants.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: pick(req.body) }
  );
  if (!result.matchedCount) return res.status(404).json({ message: "Plant not found" });
  res.json({ message: "Updated" });
}));

// Delete
router.delete("/:id", idRule, handleValidation, wrap(async (req, res) => {
  const result = await plants.deleteOne({ _id: new ObjectId(req.params.id) });
  if (!result.deletedCount) return res.status(404).json({ message: "Plant not found" });
  res.json({ message: "Plant deleted" });
}));

export default router;
