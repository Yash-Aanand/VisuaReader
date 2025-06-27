import { AuroraBackground } from "@/components/aurora-background";
import { Navbar } from "@/components/navbar";
import { MainContent } from "@/components/main-content";
import { Footer } from "@/components/footer";

function App() {
  return (
    <AuroraBackground>
      <Navbar />
      <MainContent />
      <Footer />
    </AuroraBackground>
  );
}

export default App;