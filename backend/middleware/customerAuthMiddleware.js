const jwt = require("jsonwebtoken");

const customerAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Customer token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer") {
      return res.status(403).json({ message: "Only customer can submit issue" });
    }

    req.customer = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid customer token" });
  }
};

module.exports = customerAuthMiddleware;