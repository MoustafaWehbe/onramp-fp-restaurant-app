import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = parseInt(process.env.PORT ?? "3000", 10);

async function start(): Promise<void> {
  try {
    // Load application modules only after dotenv has populated process.env.
    // This matters because the mailer reads its SMTP settings as it is imported.
    const [{ app }, { initializeDatabase }] = await Promise.all([
      import("./app"),
      import("./src/lib/db"),
    ]);

    await initializeDatabase();

    app.listen(PORT, () => {
      console.info(`API server running on http://localhost:${PORT}`);
      console.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
