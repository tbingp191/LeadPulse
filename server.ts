import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Lead Webhook (Automated Import)
  app.post("/api/webhooks/lead", (req, res) => {
    const { name, email, phone, source } = req.body;
    console.log("New Lead Received via Webhook:", { name, email, phone, source });
    
    // In a real scenario, we'd use Firebase Admin SDK here to inject into Firestore.
    // For this applet, since we only have Client SDK keys, we'll keep the server lean
    // and handle logic in the frontend or use the server as a proxy if needed.
    // However, the client can also listen to these events or we can store them in a queue.
    
    // For simplicity in this environment, we'll simulate the "Automated Import" 
    // by having a frontend component that triggers this or by having the server
    // just acknowledge it and we'll show it in the UI.
    
    res.json({ 
      status: "success", 
      message: "Lead received and queued for processing",
      data: { name, email, source, receivedAt: new Date().toISOString() }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> LeadPulse CRM Server is running on port ${PORT}`);
    console.log(`>>> Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
