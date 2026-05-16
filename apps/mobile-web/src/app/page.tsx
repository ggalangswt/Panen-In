import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/navigation/BottomNav";
import { consultationSummary, weatherSnapshot } from "@/lib/mock/home";

export default function HomePage() {
  return (
    <AppShell
      title="Selamat pagi, Budi"
      subtitle="Pantau cuaca dan lanjutkan konsultasi tanamanmu."
    >
      <section className="stack">
        <div className="hero-card">
          <p className="eyebrow">Cuaca hari ini</p>
          <h2>{weatherSnapshot.condition}</h2>
          <p>
            {weatherSnapshot.temperature} dan kelembaban {weatherSnapshot.humidity}
          </p>
          <span className="badge">{weatherSnapshot.alert}</span>
        </div>

        <div className="grid-two">
          <article className="feature-card">
            <p className="eyebrow">Konsultasi AI</p>
            <h3>{consultationSummary.title}</h3>
            <p>{consultationSummary.description}</p>
          </article>
          <article className="feature-card">
            <p className="eyebrow">Prakiraan</p>
            <h3>5 hari ke depan</h3>
            <p>Siap untuk integrasi data cuaca real-time dari backend.</p>
          </article>
        </div>
      </section>
      <BottomNav />
    </AppShell>
  );
}
