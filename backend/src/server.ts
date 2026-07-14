import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MongoClient, ObjectId } from "mongodb";
import { CreateClientInput, CreateProjectInput, CreateInvoiceInput, CompanySettings } from "./types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/clienthub");
const db = client.db(process.env.DATABASE_NAME || "clienthub");

app.use(cors());
app.use(express.json());

app.get("/api/test", (_req, res) => {
  res.json({ status: "ok", message: "Backend is live", timestamp: new Date().toISOString() });
});

async function authMiddleware(req: any, res: any, next: any) {
  if (req.path === "/health") {
    next();
    return;
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized. No token provided." });
    return;
  }

  const token = header.split(" ")[1];
  const session = await db.collection("session").findOne({ token });

  if (!session) {
    res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
    return;
  }

  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    await db.collection("session").deleteOne({ token });
    res.status(401).json({ error: "Session expired." });
    return;
  }

     const userId = session.userId
        const userQuery = {_id: userId} 
        const user = await db.collection("user").findOne(userQuery);
        if(!user){
          return res.status(401).send({message: 'unauthorized access'})
        }
        //console.log('user of the sessio', user);
        req.user = user;
  next();
}

app.use("/api", authMiddleware);

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
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit as string, 10) || 10));
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
    const { ownerId, status, search, sort, page = "1", limit = "10" } = req.query;

    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }

    const filter: any = { ownerId };
    if (status) filter.status = status;
    if (search) {
      const s = search as string;
      filter.$or = [
        { name: { $regex: s, $options: "i" } },
      ];
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      value_high: { projectValue: -1 },
      value_low: { projectValue: 1 },
    };
    const sortStage = sortMap[(sort as string) || "newest"] || sortMap.newest;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      db.collection("projects")
        .aggregate([
          { $match: filter },
          { $sort: sortStage },
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

    const projects = await db.collection("projects")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
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

    if (!projects.length) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.json(projects[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Project not found." });
      return;
    }
    res.json({ message: "Project deleted." });
  } catch (error) {
    console.error("Error deleting project:", error);
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
app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("clients").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Client not found." });
      return;
    }
    res.json({ message: "Client deleted." });
  } catch (error) {
    console.error("Error deleting client:", error);
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

app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      res.status(400).json({ error: "ownerId query parameter is required." });
      return;
    }

    const [invoiceAgg, totalClients, totalProjects, activeProjects] = await Promise.all([
      db.collection("invoices")
        .aggregate([
          { $match: { ownerId } },
          {
            $facet: {
              revenue: [
                { $match: { status: "paid" } },
                { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } },
              ],
              overdueCount: [
                { $match: { status: "overdue" } },
                { $count: "count" },
              ],
              recentInvoices: [
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
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
              ],
            },
          },
        ])
        .toArray(),
      db.collection("clients").countDocuments({ ownerId }),
      db.collection("projects").countDocuments({ ownerId }),
      db.collection("projects").countDocuments({ ownerId, status: "ongoing" }),
    ]);

    const s = invoiceAgg[0] || {};

    res.json({
      totalClients,
      totalProjects,
      activeProjects,
      totalRevenue: s.revenue?.[0]?.total || 0,
      overdueInvoices: s.overdueCount?.[0]?.count || 0,
      recentInvoices: s.recentInvoices || [],
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || "molla.jaber@gmail.com",
      subject: `[ClientHub Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #2563EB;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: 600; color: #334155;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #334155;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #334155;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 16px 0;" />
          <p style="color: #334155; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

Promise.all([
  db.collection("clients").createIndex({ ownerId: 1, createdAt: -1 }),
  db.collection("projects").createIndex({ ownerId: 1, status: 1, createdAt: -1 }),
  db.collection("invoices").createIndex({ ownerId: 1, status: 1, createdAt: -1 }),
  db.collection("invoices").createIndex({ invoiceNumber: 1 }),
  db.collection("session").createIndex({ token: 1 }),
  db.collection("settings").createIndex({ ownerId: 1 }),
])
  .then(() => console.log("Indexes created successfully"))
  .catch((err) => {
    if (err.code !== 85) console.error("Index creation error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
