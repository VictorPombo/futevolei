'use client';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-[var(--header-h)] bg-[#080810]/80 backdrop-blur-md border-b border-[var(--admin-border)] flex items-center justify-between px-8 z-40 shrink-0">
      <h2 className="font-syne text-xl font-bold text-[var(--admin-text)]">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[var(--admin-primary-glow)] text-[var(--admin-primary)] border border-[rgba(232,131,58,0.2)]">
          V 1.0.4 - Beta
        </span>
        <span className="text-[var(--admin-text2)] text-sm font-dm-mono">
          Mai 2025
        </span>
      </div>
    </header>
  );
}
