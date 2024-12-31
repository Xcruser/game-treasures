export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#111827] py-12">
      <div className="container mx-auto px-4 text-white">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Allgemeine Hinweise</h3>
              <p className="text-gray-300">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                werden können.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf unserer Website</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cookies</h3>
              <p className="text-gray-300">
                Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. 
                Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
              </p>
              <p className="text-gray-300">
                Einige Cookies sind "Session-Cookies." Solche Cookies werden nach Ende Ihrer Browser-Sitzung von selbst gelöscht. 
                Hingegen bleiben andere Cookies auf Ihrem Endgerät bestehen, bis Sie diese selbst löschen. Solche Cookies helfen 
                uns, Sie bei Rückkehr auf unserer Website wiederzuerkennen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Newsletter</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse. 
                Diese wird ausschließlich für den Versand des Newsletters verwendet und nicht an Dritte weitergegeben.
              </p>
              <p className="text-gray-300">
                Ihre Einwilligung zur Speicherung der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie 
                jederzeit widerrufen. Der Widerruf kann über einen Link in den Newslettern selbst oder per E-Mail erfolgen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Analyse und Tracking</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                Diese Website verwendet keine Tracking-Tools zur Analyse des Nutzerverhaltens.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Ihre Rechte</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren 
                Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser 
                Daten.
              </p>
              <p className="text-gray-300">
                Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
