import Container from '@/components/ui/Container';

export default function Topbar() {
  return (
    <div className="w-full bg-brand-600 text-white">
      <Container className="flex h-8 items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span>24/7 Support</span>
          <a href="mailto:support@phixall.com" className="underline-offset-2 hover:underline">support@phixall.com</a>
          <a href="tel:+2340000000000" className="underline-offset-2 hover:underline">+234 000 000 0000</a>
        </div>
        <div className="hidden gap-4 md:flex">
          <a href="/clients" className="underline-offset-2 hover:underline">Clients</a>
          <a href="/phixers" className="underline-offset-2 hover:underline">Phixers</a>
        </div>
      </Container>
    </div>
  );
}



