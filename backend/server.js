import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import env from "./src/config/config.js";

async function start() {
  try {
    await connectToDb();
    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
