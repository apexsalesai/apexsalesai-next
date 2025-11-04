import "@/styles/dashboard.css";

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
        {children}
      </div>
    </div>
  );
}
