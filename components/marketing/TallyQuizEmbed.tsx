"use client";

import { useEffect } from "react";

interface TallyQuizEmbedProps {
  formId: string;
}

export function TallyQuizEmbed({ formId }: TallyQuizEmbedProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="500"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title="Metabolic Health Quiz"
        className="bg-white"
      />
    </div>
  );
}
