import { Link } from "react-router-dom";

const THEMES: { title: string; description: string }[] = [
  { title: "Amizade", description: "Como fazer novos amigos e cuidar das amizades." },
  { title: "Empatia", description: "Perceber e respeitar os sentimentos dos outros." },
  { title: "Compartilhar brinquedos", description: "A alegria de brincar junto e dividir." },
  { title: "Respeito", description: "Tratar colegas e familiares com respeito." },
  { title: "Higiene pessoal", description: "Hábitos simples de cuidado com o corpo." },
  { title: "Segurança no trânsito", description: "Atravessar a rua com segurança, faixa de pedestres." },
  { title: "Segurança doméstica", description: "Cuidados dentro de casa." },
  { title: "Cooperação", description: "Trabalhar em equipe para alcançar um objetivo." },
  { title: "Organização", description: "Guardar brinquedos e manter a rotina organizada." },
  { title: "Alimentação saudável", description: "Escolhas de alimentos saudáveis." },
  { title: "Emoções", description: "Reconhecer e nomear sentimentos." },
  { title: "Respeito aos animais", description: "Cuidado e gentileza com os animais." },
];

const STRUCTURE = [
  "1. Situação inicial",
  "2. Objetivo do personagem",
  "3. Pequeno desafio",
  "4. Decisão ou ação",
  "5. Resolução",
  "6. Conclusão educativa",
];

export default function Stories() {
  return (
    <div>
      <h1>Histórias</h1>
      <p className="page-subtitle">
        Temas educativos disponíveis para as histórias infantis. Cada episódio segue uma estrutura visual,
        compreensível sem narração e sem diálogos.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Estrutura narrativa recomendada</h2>
        <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "var(--text-muted)" }}>
          {STRUCTURE.map((s) => <li key={s} style={{ marginBottom: 4 }}>{s}</li>)}
        </ol>
      </div>

      <div className="grid grid-3">
        {THEMES.map((t) => (
          <div key={t.title} className="card">
            <h2>{t.title}</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.description}</p>
            <Link to="/criar" className="btn small secondary">Usar neste tema</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
