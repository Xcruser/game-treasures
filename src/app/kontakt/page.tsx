import BackgroundIcons from '@/components/BackgroundIcons';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function KontaktPage() {
  return (
    <main className="min-h-screen relative bg-background overflow-hidden">
      {/* Hintergrund mit Icons */}
      <div className="absolute inset-0 z-0">
        <BackgroundIcons />
      </div>

      {/* Kontakt Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kontaktieren Sie uns
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Haben Sie Fragen oder Anregungen? Wir sind für Sie da und freuen uns auf
            Ihre Nachricht!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
