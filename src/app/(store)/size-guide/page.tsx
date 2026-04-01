export const metadata = {
  title: "Size Guide | ਵਿਰਸਾ Style",
  description: "Find your perfect fit with ਵਿਰਸਾ Style's comprehensive size guide.",
};

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Find Your Fit</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Size Guide</h1>
        <p className="text-sm text-luxury-text mt-4 max-w-xl mx-auto">
          Use the charts below to find your perfect size. If you&apos;re between sizes, we recommend going one size up for a comfortable fit.
        </p>
      </div>

      <div className="space-y-12">
        {/* How to Measure */}
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-4">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pastel-cream p-5">
              <p className="text-sm font-medium text-luxury-dark mb-2">Bust</p>
              <p className="text-xs text-luxury-text leading-relaxed">
                Measure around the fullest part of your bust, keeping the tape straight across the back.
              </p>
            </div>
            <div className="bg-pastel-cream p-5">
              <p className="text-sm font-medium text-luxury-dark mb-2">Waist</p>
              <p className="text-xs text-luxury-text leading-relaxed">
                Measure around the narrowest part of your natural waistline, typically above the belly button.
              </p>
            </div>
            <div className="bg-pastel-cream p-5">
              <p className="text-sm font-medium text-luxury-dark mb-2">Hips</p>
              <p className="text-xs text-luxury-text leading-relaxed">
                Measure around the widest part of your hips, approximately 8 inches below the waistline.
              </p>
            </div>
          </div>
        </section>

        {/* Clothing Size Chart */}
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-4">Clothing Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-pastel-pink">
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Size</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Bust (inches)</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Waist (inches)</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Hips (inches)</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">US Size</th>
                </tr>
              </thead>
              <tbody className="text-luxury-text">
                {[
                  { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35", us: "0-2" },
                  { size: "S", bust: "34-35", waist: "26-27", hips: "36-37", us: "4-6" },
                  { size: "M", bust: "36-37", waist: "28-29", hips: "38-39", us: "8-10" },
                  { size: "L", bust: "38-40", waist: "30-32", hips: "40-42", us: "12-14" },
                  { size: "XL", bust: "41-43", waist: "33-35", hips: "43-45", us: "16-18" },
                  { size: "XXL", bust: "44-46", waist: "36-38", hips: "46-48", us: "20-22" },
                ].map((row) => (
                  <tr key={row.size} className="border-b border-pastel-cream">
                    <td className="py-3 px-4 font-medium text-luxury-dark">{row.size}</td>
                    <td className="py-3 px-4">{row.bust}</td>
                    <td className="py-3 px-4">{row.waist}</td>
                    <td className="py-3 px-4">{row.hips}</td>
                    <td className="py-3 px-4">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ethnic Wear / Punjabi Suits */}
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-4">Ethnic Wear & Punjabi Suits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-pastel-pink">
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Size</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Kameez Length</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Chest (inches)</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Shoulder (inches)</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Sleeve (inches)</th>
                </tr>
              </thead>
              <tbody className="text-luxury-text">
                {[
                  { size: "S (36)", length: "42\"", chest: "36", shoulder: "14", sleeve: "17" },
                  { size: "M (38)", length: "43\"", chest: "38", shoulder: "14.5", sleeve: "17.5" },
                  { size: "L (40)", length: "44\"", chest: "40", shoulder: "15", sleeve: "18" },
                  { size: "XL (42)", length: "45\"", chest: "42", shoulder: "15.5", sleeve: "18.5" },
                  { size: "XXL (44)", length: "46\"", chest: "44", shoulder: "16", sleeve: "19" },
                ].map((row) => (
                  <tr key={row.size} className="border-b border-pastel-cream">
                    <td className="py-3 px-4 font-medium text-luxury-dark">{row.size}</td>
                    <td className="py-3 px-4">{row.length}</td>
                    <td className="py-3 px-4">{row.chest}</td>
                    <td className="py-3 px-4">{row.shoulder}</td>
                    <td className="py-3 px-4">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footwear */}
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-4">Footwear Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-pastel-pink">
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">India</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">UK</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">US</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">EU</th>
                  <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-accent">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="text-luxury-text">
                {[
                  { india: "3", uk: "3", us: "5", eu: "36", cm: "22.5" },
                  { india: "4", uk: "4", us: "6", eu: "37", cm: "23" },
                  { india: "5", uk: "5", us: "7", eu: "38", cm: "24" },
                  { india: "6", uk: "6", us: "8", eu: "39", cm: "24.5" },
                  { india: "7", uk: "7", us: "9", eu: "40", cm: "25.5" },
                  { india: "8", uk: "8", us: "10", eu: "41", cm: "26" },
                  { india: "9", uk: "9", us: "11", eu: "42", cm: "27" },
                ].map((row) => (
                  <tr key={row.india} className="border-b border-pastel-cream">
                    <td className="py-3 px-4 font-medium text-luxury-dark">{row.india}</td>
                    <td className="py-3 px-4">{row.uk}</td>
                    <td className="py-3 px-4">{row.us}</td>
                    <td className="py-3 px-4">{row.eu}</td>
                    <td className="py-3 px-4">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-pastel-lavender/30 p-6">
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Sizing Tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>Measure yourself wearing lightweight clothes for accuracy</li>
            <li>If between two sizes, choose the larger size for a relaxed fit</li>
            <li>Ethnic wear sizes may vary by design — check product descriptions for specific measurements</li>
            <li>For footwear, measure your foot in the evening when feet are slightly larger</li>
            <li>Not sure about your size? WhatsApp us at +91 8289012150 and we&apos;ll help!</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
