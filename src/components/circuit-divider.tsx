/** Thin right-angle PCB-style divider with a signal-blue trace node. */
export function CircuitDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-1.5 w-1.5 flex-none rotate-45 border border-signal/70" />
      <span className="circuit-divider w-full" />
      <span className="h-1.5 w-1.5 flex-none rotate-45 border border-signal/70" />
    </div>
  );
}
