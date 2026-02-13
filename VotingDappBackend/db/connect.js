const mongoose = require("mongoose");

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/votingdapp";

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const withDefaultTimeout = (rawValue, fallback) => {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildConnectionOptions = () => ({
  serverSelectionTimeoutMS: withDefaultTimeout(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 10000),
  maxPoolSize: withDefaultTimeout(process.env.MONGO_MAX_POOL_SIZE, 10),
  autoIndex: process.env.NODE_ENV !== "production",
});

const sanitizeMongoError = (error) => {
  if (!error) return "Unknown MongoDB error";
  const message = error.message || String(error);
  if (message.includes("querySrv ECONNREFUSED")) {
    return "Atlas SRV DNS lookup failed (querySrv ECONNREFUSED).";
  }
  return message;
};

const tryConnect = async ({ label, uri, options }) => {
  await mongoose.connect(uri, options);
  return {
    connected: true,
    mode: label,
    uri,
  };
};

const connectDB = async (mongoUriFromCaller) => {
  const atlasUri =
    mongoUriFromCaller || process.env.MONGO_URI || process.env.MONGO_URL || "";
  const atlasDirectUri = process.env.MONGO_URI_DIRECT || "";
  const localUri = process.env.MONGO_LOCAL_URI || DEFAULT_LOCAL_URI;

  const baseOptions = buildConnectionOptions();

  const targets = [];

  if (isNonEmptyString(atlasUri)) {
    targets.push({
      label: "atlas",
      uri: atlasUri.trim(),
      options: {
        ...baseOptions,
        family: 4,
      },
    });

    if (atlasUri.startsWith("mongodb+srv://") && isNonEmptyString(atlasDirectUri)) {
      targets.push({
        label: "atlas-direct",
        uri: atlasDirectUri.trim(),
        options: baseOptions,
      });
    }
  } else {
    console.warn("[DB] MONGO_URI/MONGO_URL not set. Atlas connection skipped.");
  }

  targets.push({
    label: "local",
    uri: localUri,
    options: baseOptions,
  });

  let lastError = null;

  for (const target of targets) {
    try {
      const result = await tryConnect(target);
      if (target.label === "atlas") {
        console.log("[DB] Connected to MongoDB Atlas.");
      } else if (target.label === "atlas-direct") {
        console.log("[DB] Connected using direct Atlas URI fallback.");
      } else {
        console.log(`[DB] Connected to local MongoDB (${target.uri}).`);
      }
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[DB] ${target.label} connection failed: ${sanitizeMongoError(error)}`);
    }
  }

  return {
    connected: false,
    mode: "none",
    uri: null,
    error: sanitizeMongoError(lastError),
  };
};

module.exports = connectDB;
