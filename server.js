import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import express from "express";
// Corrección de la importación para módulos CommonJS
import pkg from "@playwright/mcp";
const { PlaywrightServer } = pkg;

const app = express();
const port = process.env.PORT || 3000;

// Definimos un token de seguridad básico
const API_KEY = process.env.MCP_API_KEY || "mi_clave_secreta_temporal";

app.use(express.json());

// Servidor de Playwright MCP
const mcpServer = new PlaywrightServer();

// Endpoint con verificación de seguridad integrada
app.post("/mcp", async (req, res) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey || clientKey !== API_KEY) {
    return res.status(401).json({ error: "No autorizado. Token inválido o ausente." });
  }

  // Si el token es correcto, procesamos la petición MCP
  mcpServer.handleRequest(req, res);
});

app.listen(port, () => {
  console.log(`¡Éxito! Playwright MCP remoto escuchando en el puerto ${port}`);
});
