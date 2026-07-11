import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";
import { CreateClientInput } from "./types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let db: Db;

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/clienthub";
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log("Connected to MongoDB");
}

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/clients", async (req, res) => {
  try {
    const { ownerId, search, page = "1", limit = "10" } = req.query;

    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }

    const filter: any = { ownerId };

    if (search) {
      const s = search as string;
      filter.$or = [
        { companyName: { $regex: s, $options: "i" } },
        { contactPerson: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [clients, total] = await Promise.all([
      db.collection("clients")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      db.collection("clients").countDocuments(filter),
    ]);

    res.json({ clients, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const body = req.body as CreateClientInput;

    if (!body.companyName || !body.contactPerson || !body.email || !body.ownerId) {
      res.status(400).json({ error: "companyName, contactPerson, email, and ownerId are required." });
      return;
    }

    const doc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("clients").insertOne(doc);

    res.status(201).json({
      message: "Client created successfully",
      client: { _id: result.insertedId, ...doc },
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
