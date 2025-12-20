require('dotenv').config();
const app = require("./app");
const { connectDatabase, syncDatabase } = require("./config/database");

// Import associations to set up relationships
require("../models/associations");

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Sync database (create tables if they don't exist)
    await syncDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();