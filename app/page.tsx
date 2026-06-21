import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PfpGenerator from "./components/PfpGenerator";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Divider between hero and PFP generator */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-emerald-700/40" />
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-700/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <div className="w-1 h-1 rounded-full bg-emerald-700/60" />
              </div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-emerald-700/40" />
            </div>
          </div>
        </div>

        <PfpGenerator />
      </main>
      <Footer />
    </>
  );
}
