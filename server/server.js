import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const plants = client.db("nativePlantDB").collection("plants");
console.log("Connected to MongoDB: nativePlantDB.plants");

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
  const plant = await plants.findOne({ _id: new ObjectId(req.params.id) });
  plant ? res.json(plant) : res.status(404).json({ error: "Not found" });
});

// CREATE a plant
app.post("/api/plants", async (req, res) => {
  const result = await plants.insertOne(req.body);
  res.status(201).json({ _id: result.insertedId, ...req.body });
});

// UPDATE a plant
app.put("/api/plants/:id", async (req, res) => {
  const { _id, ...updates } = req.body;
  const result = await plants.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updates }
  );
  result.matchedCount
    ? res.json({ message: "Updated" })
    : res.status(404).json({ error: "Not found" });
});

// DELETE a plant
app.delete("/api/plants/:id", async (req, res) => {
  const result = await plants.deleteOne({ _id: new ObjectId(req.params.id) });
  result.deletedCount
    ? res.json({ message: "Deleted" })
    : res.status(404).json({ error: "Not found" });
});

app.listen(5001, () => console.log("API running on http://localhost:5001"));