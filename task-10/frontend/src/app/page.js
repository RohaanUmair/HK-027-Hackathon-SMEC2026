import Link from "next/link";
import { Recycle, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Recycle className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ReUseX</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Marketplace</a>
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">Sustainability</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-bold">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Empowering circular economy
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight max-w-4xl mx-auto">
            Sustainable Sharing <br />
            <span className="text-blue-500">Made Simple.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Join the community of conscious consumers. Rent, barter, or list your items
            to reduce waste and save money. The future of ownership is shared.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 text-lg">
                Start Trading Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg">
              Explore Listings
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          {[
            { icon: Shield, title: "Secure Barter", desc: "Trade items with confidence through our verified user system." },
            { icon: Zap, title: "Instant Rentals", desc: "Find what you need nearby and rent it for as long as you want." },
            { icon: Globe, title: "Eco-Friendly", desc: "Reduce your carbon footprint by reusing resources within your community." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl space-y-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Stats/Social Proof */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Recycle className="w-5 h-5" />
            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">ReUseX &copy; 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
