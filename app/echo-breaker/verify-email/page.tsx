export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-3xl font-bold text-white mb-4">Check your email</h1>
        <p className="text-slate-300 mb-6">
          A sign-in link has been sent to your email address. Click the link in the email to sign in to your account.
        </p>
        <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-indigo-200">
            <strong>Tip:</strong> The link will expire in 24 hours for security.
          </p>
        </div>
        <a
          href="/echo-breaker"
          className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105"
        >
          ← Back to Echo Breaker
        </a>
      </div>
    </div>
  );
}
