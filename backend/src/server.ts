import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MongoClient, Db, ObjectId } from "mongodb";
import { CreateClientInput, CreateProjectInput, CreateInvoiceInput, CompanySettings } from "./types";

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
app.post("/api/projects", async (req, res) => {
  try{
    const body = req.body as CreateProjectInput;

    if (!body.name || !body.clientId || !body.ownerId) {
      res.status(400).json({ error: "name, clientId, and ownerId are required." });
      return;
    }

    const doc = {
      ...body,
      status: body.status || "ongoing",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("projects").insertOne(doc);

    res.status(201).json({
      message: "Project created successfully",
      project: { _id: result.insertedId, ...doc },
    });
  }
  catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    console.log(req.query);
    const { ownerId, status, page = "1", limit = "10" } = req.query;

    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }

    const filter: any = { ownerId };
    if (status) filter.status = status;


    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      db.collection("projects")
        .aggregate([
          { $match: filter },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $lookup: {
              from: "clients",
              let: { clientObjectId: { $toObjectId: "$clientId" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$clientObjectId"] },
                  },
                },
              ],
              as: "client",
            },
          },
          {
            $addFields: {
              client: {
                $ifNull: [{ $arrayElemAt: ["$client", 0] }, null],
              },
            },
          },
        ])
        .toArray(),
      db.collection("projects").countDocuments(filter),
    ]);

    res.json({ projects, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.patch("/api/projects/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ["ongoing", "pending", "completed", "cancelled"];
    if (!valid.includes(status)) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }
    const result = await db.collection("projects").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result) {
      res.status(404).json({ error: "Project not found." });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
async function getNextInvoiceNumber(): Promise<string> {
  const last = await db.collection("invoices").findOne({}, { sort: { invoiceNumber: -1 } });
  const num = last ? parseInt(last.invoiceNumber.replace("INV-", ""), 10) + 1 : 1;
  return `INV-${String(num).padStart(3, "0")}`;
}

app.post("/api/invoices", async (req, res) => {
  try {
    const body = req.body as CreateInvoiceInput;

    if (!body.ownerId || !body.clientId || !body.projectId) {
      res.status(400).json({ error: "ownerId, clientId, and projectId are required." });
      return;
    }

    const invoiceNumber = await getNextInvoiceNumber();

    const doc = {
      ownerId: body.ownerId,
      clientId: body.clientId,
      projectId: body.projectId,
      invoiceNumber,
      amount: body.amount || 0,
      status: body.status || "pending",
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || "",
      notes: body.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("invoices").insertOne(doc);

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: { _id: result.insertedId, ...doc },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/invoices", async (req, res) => {
  try {
    const { ownerId, status, page = "1", limit = "10" } = req.query;

    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }

    const filter: any = { ownerId };
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [invoices, total] = await Promise.all([
      db.collection("invoices")
        .aggregate([
          { $match: filter },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $lookup: {
              from: "projects",
              let: { projectObjectId: { $toObjectId: "$projectId" } },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$projectObjectId"] } } },
              ],
              as: "project",
            },
          },
          {
            $addFields: {
              project: { $ifNull: [{ $arrayElemAt: ["$project", 0] }, null] },
            },
          },
          {
            $lookup: {
              from: "clients",
              let: { clientObjectId: { $toObjectId: "$clientId" } },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$clientObjectId"] } } },
              ],
              as: "client",
            },
          },
          {
            $addFields: {
              client: { $ifNull: [{ $arrayElemAt: ["$client", 0] }, null] },
            },
          },
        ])
        .toArray(),
      db.collection("invoices").countDocuments(filter),
    ]);

    res.json({ invoices, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/invoices/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const invoices = await db.collection("invoices")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "projects",
            let: { projectObjectId: { $toObjectId: "$projectId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$projectObjectId"] } } },
            ],
            as: "project",
          },
        },
        {
          $addFields: {
            project: { $ifNull: [{ $arrayElemAt: ["$project", 0] }, null] },
          },
        },
        {
          $lookup: {
            from: "clients",
            let: { clientObjectId: { $toObjectId: "$clientId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$clientObjectId"] } } },
            ],
            as: "client",
          },
        },
        {
          $addFields: {
            client: { $ifNull: [{ $arrayElemAt: ["$client", 0] }, null] },
          },
        },
      ])
      .toArray();

    if (!invoices.length) {
      res.status(404).json({ error: "Invoice not found." });
      return;
    }

    res.json(invoices[0]);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.patch("/api/invoices/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ["pending", "paid", "overdue", "cancelled"];
    if (!valid.includes(status)) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }

    const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(id) });
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found." });
      return;
    }

    if (status === "paid" && invoice.projectId) {
      await db.collection("projects").updateOne(
        { _id: new ObjectId(invoice.projectId) },
        { $set: { status: "completed", updatedAt: new Date() } }
      );
    }

    const result = await db.collection("invoices").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    res.json(result);
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const client = await db.collection("clients").findOne({ _id: new ObjectId(id) });

    if (!client) {
      res.status(404).json({ error: "Client not found." });
      return;
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/api/settings", async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }
    const settings = await db.collection("settings").findOne({ ownerId });
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const body = req.body as CompanySettings;
    if (!body.ownerId || !body.companyName) {
      res.status(400).json({ error: "ownerId and companyName are required." });
      return;
    }
    const doc = {
      ...body,
      updatedAt: new Date(),
    };
    const result = await db.collection("settings").findOneAndUpdate(
      { ownerId: body.ownerId },
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );
    res.json(result);
  } catch (error) {
    console.error("Error saving settings:", error);
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
