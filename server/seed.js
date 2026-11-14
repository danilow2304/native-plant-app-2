import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const plants = client.db("nativePlantDB").collection("plants");

await plants.deleteMany({});
await plants.insertMany([
  { name: "Purple Coneflower", scientificName: "Echinacea purpurea", description: "Hardy perennial with large purple daisy-like flowers.", sunlight: "Full sun", soil: "Well-drained", water: "Low", height: "2-4 ft", bloomSeason: "Summer", nativeRange: "Eastern US", wildlifeBenefits: "Bees, butterflies, goldfinches", image: "" },
  { name: "Black-eyed Susan", scientificName: "Rudbeckia hirta", description: "Bright yellow flowers with dark centers.", sunlight: "Full sun", soil: "Average", water: "Low", height: "1-3 ft", bloomSeason: "Summer", nativeRange: "Eastern US", wildlifeBenefits: "Pollinators, birds", image: "" },
  { name: "Wild Bergamot", scientificName: "Monarda fistulosa", description: "Lavender flowers that attract many pollinators.", sunlight: "Full sun", soil: "Dry to medium", water: "Low", height: "2-4 ft", bloomSeason: "Summer", nativeRange: "North America", wildlifeBenefits: "Hummingbirds, bees", image: "" },
  { name: "New England Aster", scientificName: "Symphyotrichum novae-angliae", description: "Late-season purple blooms.", sunlight: "Full sun", soil: "Moist", water: "Medium", height: "3-6 ft", bloomSeason: "Fall", nativeRange: "Eastern US", wildlifeBenefits: "Monarch butterflies", image: "" },
  { name: "Virginia Bluebells", scientificName: "Mertensia virginica", description: "Spring ephemeral with blue bell-shaped flowers.", sunlight: "Part shade", soil: "Moist", water: "Medium", height: "1-2 ft", bloomSeason: "Spring", nativeRange: "Eastern US", wildlifeBenefits: "Bumblebees", image: "" },
]);

console.log("Seeded", await plants.countDocuments(), "plants");
await client.close();