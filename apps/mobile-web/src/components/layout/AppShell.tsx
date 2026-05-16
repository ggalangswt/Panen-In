import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="app-header">
          <p className="eyebrow">PanenIn</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
