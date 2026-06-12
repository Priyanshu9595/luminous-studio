const express = require("express");
const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  const filter = category && category !== "All" ? { category } : {};

  const portfolio = await Portfolio.find(filter).sort({ createdAt: -1 });

  res.json(portfolio);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  res.json({ message: "Portfolio item deleted successfully" });
});

module.exports = router;