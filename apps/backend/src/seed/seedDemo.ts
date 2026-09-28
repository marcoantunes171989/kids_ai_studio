import { saveProject } from "../repositories/projectsRepo.js";
import { buildDemoEpisode } from "./demoEpisode.js";

const project = buildDemoEpisode();
saveProject(project);
console.log(`Projeto demonstrativo salvo: "${project.title}" (id: ${project.id})`);
