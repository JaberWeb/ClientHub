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
