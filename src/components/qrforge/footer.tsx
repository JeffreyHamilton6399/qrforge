export function Footer() {
  return (
    <footer className="h-8 shrink-0 border-t border-border bg-background">
      <div className="flex h-full items-center justify-center gap-1.5 px-3 text-[11px] text-muted-foreground">
        <span className="font-medium">V1</span>
        <span aria-hidden>·</span>
        <span>Jeffrey Hamilton</span>
        <span className="hidden text-emerald-600 sm:inline dark:text-emerald-400">
          · 100% private
        </span>
      </div>
    </footer>
  );
}
