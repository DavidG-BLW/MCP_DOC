import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableMethod } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { PlaywrightServer } from "@playwright/mcp"; // Asegura la importación según la última documentación del paquete
import express from "express";

const app = express();
const port = process.env.PORT || 3000; // Railway inyectará el puerto automáticamente

// 1. Configurar e inicializar el servidor básico de Playwright MCP
const mcpServer = new PlaywrightServer(); 

// 2. Montar el endpoint '/mcp' usando transporte HTTP
app.post("/mcp", async (req, res) => {
  // El SDK de MCP procesa los mensajes entrantes del cliente remoto (Cursor/Claude)
  mcpServer.handleRequest(req, res);
});

app.listen(port, () => {
  console.log(`Playwright MCP remoto escuchando en el puerto ${port}`);
});
