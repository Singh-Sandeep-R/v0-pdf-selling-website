import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/navbar";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - SkillCrazyAI",
  description: "Get in touch with SkillCrazyAI for questions about our data science books or any support you need.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}
