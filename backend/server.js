const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const vendors = []; // In-memory store for demo

app.post("/api/vendor/register", (req, res) => {
  const { fullName, phone, email, shopName, password } = req.body;

  // Basic validation
  if (!fullName || !phone || !email || !shopName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email already exists
  const existing = vendors.find((v) => v.email === email);
  if (existing) {
    return res.status(400).json({ message: "Vendor already registered with this email" });
  }

  // Save vendor (in real life, hash password and save to DB)
  vendors.push({ fullName, phone, email, shopName, password });

  res.status(201).json({ message: "Vendor registered successfully" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
