"use client";

import { useState } from "react";
import { MessageCircle, Image as ImageIcon } from "lucide-react";

interface Props {
  productName: string;
  onReferenceNote: (note: string) => void;
}

export default function WhatsAppReference({ productName, onReferenceNote }: Props) {
  const [note, setNote] = useState("");

  const whatsappNumber = "918289012150";

  const sendReference = () => {
    const message = `Hi! I'm ordering *${productName}* from ਵਿਰਸਾ Style.\n\nI'd like to share my design reference/image for customization.\n\n${note ? `Note: ${note}` : "I'll share my reference image here."}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="border border-dashed border-pastel-lilac p-4 mt-4 bg-pastel-cream/50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle size={18} className="text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-1">
            Have a Design Reference?
          </p>
          <p className="text-[11px] text-luxury-text/60 leading-relaxed mb-3">
            Send us your design inspiration, reference image, or custom details via WhatsApp.
            Our tailor will stitch exactly to your vision.
          </p>

          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); onReferenceNote(e.target.value); }}
            placeholder="Any special design notes... (optional)"
            rows={2}
            className="w-full border border-pastel-rose px-3 py-2 text-xs focus:outline-none focus:border-accent resize-none mb-3"
          />

          <button
            onClick={sendReference}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-xs tracking-wider uppercase transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <ImageIcon size={14} />
            Send Reference on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
