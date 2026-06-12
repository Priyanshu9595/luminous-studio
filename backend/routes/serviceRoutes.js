const express = require("express");
const Service = require("../models/Service");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  const filter = category && category !== "All" ? { category } : {};

  const services = await Service.find(filter).sort({ createdAt: -1 });

  res.json(services);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted successfully" });
});

module.exports = router;