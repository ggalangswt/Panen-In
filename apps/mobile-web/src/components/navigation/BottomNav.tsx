const items = [
  { label: "Home", active: true },
  { label: "Konsultasi", active: false },
  { label: "Cuaca", active: false },
  { label: "Catatan", active: false },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {items.map((item) => (
        <a key={item.label} href="#" data-active={item.active}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
