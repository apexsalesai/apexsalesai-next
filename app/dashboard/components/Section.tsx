export default function Section({title, children}:{title:string; children:React.ReactNode}) {
  return (
    <section className="space-y-3 animate-fadeIn transition-smooth">
      <h2 className="text-lg md:text-xl font-semibold text-slate-200">{title}</h2>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
