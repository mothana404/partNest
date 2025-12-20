const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  try {
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("JWT generation error:", error);
    return null;
  }
};

module.exports = { generateToken };
