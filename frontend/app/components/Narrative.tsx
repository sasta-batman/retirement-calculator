"use client";

interface NarrativeProps {
  narrative: string;
}

export default function Narrative({ narrative }: NarrativeProps) {
  if (!narrative) return null;
  return (
    <div className="narrative-box fade-in-up">
      <p className="section-heading">📖 Your Retirement Story</p>
      <p>{narrative}</p>
    </div>
  );
}
