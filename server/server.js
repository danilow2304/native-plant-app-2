import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ObjectId } from "mongodb";
import { plants } from "./db.js";
import requireAuth from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import adminPlantRoutes from "./routes/adminPlants.js";

const app = express();
app.use(helmet());                                         // secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));                  // body size limit

// ---- Admin area ----
app.use("/api/auth", authRoutes);                          // login
app.use("/api/admin/plants", adminPlantRoutes);            // protected CRUD

// ---- Public plant API ----
// READ routes stay public. WRITE routes now require an admin token.

// READ all plants (optional search with ?q=)
app.get("/api/plants", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { scientificName: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      }
    : {};
  res.json(await plants.find(filter).toArray());
});

// READ one plant
app.get("/api/plants/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid id" });
  const plant = await plants.findOne({ _id: new ObjectId(req.params.id) });
  plant ? res.json(plant) : res.status(404).json({ error: "Not found" });
});

// CREATE a plant (admin only)
app.post("/api/plants", requireAuth, async (req, res) => {
  const result = await plants.insertOne(req.body);
  res.status(201).json({ _id: result.insertedId, ...req.body });
});

// UPDATE a plant (admin only)
app.put("/api/plants/:id", requireAuth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid id" });
  const { _id, ...updates } = req.body;
  const result = await plants.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updates }
  );
  result.matchedCount
    ? res.json({ message: "Updated" })
    : res.status(404).json({ error: "Not found" });
});

// DELETE a plant (admin only)
app.delete("/api/plants/:id", requireAuth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid id" });
  const result = await plants.deleteOne({ _id: new ObjectId(req.params.id) });
  result.deletedCount
    ? res.json({ message: "Deleted" })
    : res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));