import { spawn } from "child_process";
import express from "express";
import path from "path";

const app = express();
// Railway inyectará dinámicamente el puerto correcto aquí
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint HTTP que actúa como puente directo al binario de Playwright MCP
app.post("/mcp", async (req, res) => {
  try {
    // Invocamos directamente el script ejecutable del paquete instalado localmente en node_modules
    const playwrightMcpPath = path.resolve("node_modules/@playwright/mcp/cli.js");

    const mcpProcess = spawn("node", [playwrightMcpPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutData = "";
    let stderrData = "";

    // Enviamos la petición JSON entrante de la IA al proceso de Playwright
    mcpProcess.stdin.write(JSON.stringify(req.body) + "\n");
    mcpProcess.stdin.end();

    // Capturamos la respuesta del servidor oficial
    mcpProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    mcpProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    mcpProcess.on("close", (code) => {
      if (code !== 0 && !stdoutData) {
        console.error("Error en Playwright MCP:", stderrData);
        return res.status(500).json({ error: "Error interno en Playwright MCP", details: stderrData });
      }

      try {
        // Devolvemos la respuesta formateada al cliente (Cursor/Claude)
        const jsonResponse = JSON.parse(stdoutData.trim());
        res.json(jsonResponse);
      } catch (e) {
        // Si no es JSON puro, respondemos con el texto en crudo
        res.send(stdoutData);
      }
    });

  } catch (error) {
    console.error("Fallo al invocar el proceso:", error);
    res.status(500).json({ error: "Fallo en el puente del servidor" });
  }
});

// Forzamos a Express a escuchar en la IP 0.0.0.0 para que Railway pueda enrutar el tráfico público
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 ¡Servidor puente activo en Railway! Escuchando en el puerto ${port} sobre el host 0.0.0.0`);
});
