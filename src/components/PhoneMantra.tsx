export function PhoneMantra({ mantra }: { mantra: string }) {
  return (
    <div className="mx-auto w-[260px] rounded-[2.5rem] border-8 border-neutral-800 bg-black shadow-2xl overflow-hidden">
      <div className="aspect-[9/19.5] bg-gradient-to-b from-ink to-surface flex items-center justify-center p-8 relative">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />
        <p className="relative text-2xl font-thin leading-snug text-center">{mantra}</p>
      </div>
    </div>
  );
}
