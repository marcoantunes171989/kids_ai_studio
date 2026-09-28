import express from "express";
import cors from "cors";
import { ensureDataDirs, CHARACTERS_DIR, SCENARIOS_DIR, VIDEOS_DIR } from "./paths.js";
import { systemRouter } from "./routes/system.js";
import { libraryRouter } from "./routes/library.js";
import { projectsRouter } from "./routes/projects.js";
import { renderRouter } from "./routes/render.js";

ensureDataDirs();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/system", systemRouter);
app.use("/api/library", libraryRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/render", renderRouter);

app.use("/media/characters/imported", express.static(CHARACTERS_DIR));
app.use("/media/scenarios/imported", express.static(SCENARIOS_DIR));
app.use("/media/videos", express.static(VIDEOS_DIR));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Handler de erros central: nunca expor stack traces ao cliente; erros de validação de
// upload (Multer/fileFilter) e outros erros síncronos de rota chegam aqui.
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Erro interno do servidor.";
  console.error(err);
  res.status(400).json({ error: message });
});

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`Kids AI Studio backend rodando em http://localhost:${PORT}`);
});
