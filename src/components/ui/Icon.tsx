type IconName = 'wrench' | 'bolt' | 'thermo' | 'shield' | 'clock' | 'map' | 'card' | 'building' | 'gear' | 'users';

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const props = { className: className ?? 'h-5 w-5', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as any;
  switch (name) {
    case 'wrench':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M14 7l3 3m-1-8a7 7 0 01-7 7L3 18l3 3 6-6a7 7 0 007-7 5 5 0 01-2-4z"/></svg>
      );
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
      );
    case 'thermo':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M10 14a4 4 0 106 3.46V5a3 3 0 10-6 0v12.46A4 4 0 0010 14z"/></svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"/></svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M9 3l6 2 6-2v18l-6 2-6-2-6 2V5l6-2z"/><path d="M9 3v18M15 5v18"/></svg>
      );
    case 'card':
      return (
        <svg viewBox="0 0 24 24" {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
      );
    case 'building':
      return (
        <svg viewBox="0 0 24 24" {...props}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M12 21v-4"/></svg>
      );
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-2.2.4a7.9 7.9 0 01-.9 2.1l1.3 1.9-1.4 1.4-1.9-1.3a7.9 7.9 0 01-2.1.9L13 21h-2l-.4-2.2a7.9 7.9 0 01-2.1-.9l-1.9 1.3-1.4-1.4 1.3-1.9a7.9 7.9 0 01-.9-2.1L3 12l2.2-.4a7.9 7.9 0 01.9-2.1L4.8 7.6 6.2 6.2l1.9 1.3a7.9 7.9 0 012.1-.9L11 3h2l.4 2.2a7.9 7.9 0 012.1.9l1.9-1.3 1.4 1.4-1.3 1.9c.4.7.7 1.4.9 2.1L21 12z"/></svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" {...props}><path d="M16 11a4 4 0 10-8 0 4 4 0 008 0z"/><path d="M6 19a6 6 0 1112 0v2H6v-2z"/></svg>
      );
    default:
      return null;
  }
}



