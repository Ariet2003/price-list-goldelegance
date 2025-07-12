import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Reviews from '@/components/Reviews';
import HowWeWork from '@/components/HowWeWork';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Header />
        <Hero />
        <About />
        <Reviews />
        <HowWeWork />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
