require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db/connect");
const candidateRoutes = require("./routes/candidateRoutes");
const voterRoutes = require("./routes/voterRoutes");
const authenticationRoute = require("./routes/authenticationRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "votingSystem")));

app.use("/api", authenticationRoute);
app.use("/api", candidateRoutes);
app.use("/api", voterRoutes);

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  const dbResult = await connectDB();

  if (!dbResult.connected) {
    console.warn("[DB] Startup continuing without active MongoDB connection.");
    console.warn(`[DB] Last error: ${dbResult.error}`);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] Database mode: ${dbResult.mode}`);
  });
};

startServer().catch((error) => {
  console.error("[Server] Fatal startup error:", error);
  process.exit(1);
});
