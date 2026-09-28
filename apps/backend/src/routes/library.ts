import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { CHARACTER_LIST, SCENARIO_LIST, OBJECT_LIST } from "@kidsai/engine";
import { CHARACTERS_DIR } from "../paths.js";

export const libraryRouter = Router();

libraryRouter.get("/characters", (_req, res) => {
  const imported = fs.existsSync(CHARACTERS_DIR)
    ? fs.readdirSync(CHARACTERS_DIR).map((file) => ({
        id: file,
        name: path.parse(file).name,
        type: "importado",
        url: `/media/characters/imported/${file}`,
      }))
    : [];
  res.json({ builtIn: CHARACTER_LIST, imported });
});

libraryRouter.get("/scenarios", (_req, res) => {
  res.json({ builtIn: SCENARIO_LIST });
});

libraryRouter.get("/objects", (_req, res) => {
  res.json({ builtIn: OBJECT_LIST });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, CHARACTERS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [".png", ".svg", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      cb(new Error("Formato não suportado. Utilize PNG, SVG ou WebP."));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

libraryRouter.post("/characters/import", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Nenhum arquivo enviado." });
    return;
  }
  res.status(201).json({
    id: req.file.filename,
    name: path.parse(req.file.originalname).name,
    url: `/media/characters/imported/${req.file.filename}`,
    warning:
      "Imagens estáticas importadas (PNG/SVG/WebP) são exibidas como recortes na cena, mas não executam automaticamente os movimentos corporais programados (caminhar, acenar, etc.) que os personagens da biblioteca possuem.",
  });
});
