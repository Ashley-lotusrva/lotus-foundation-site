"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="staff-shell" style={{ maxWidth: 600 }}>
      <div className="intake-card">
        <span className="eyebrow">The Lotus Foundation · Members</span>
        <h1>Welcome back.</h1>
        <p>
          Sign in with your approved staff account. Referral information is
          private.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const f = new FormData(e.currentTarget);
            try {
              const r = await fetch("/api/staff/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: f.get("email"),
                  password: f.get("password"),
                }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              router.replace("/staff");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Sign in failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="staff-muted">
          For account access or a password reset, contact your Foundation
          administrator.
        </p>
      </div>
    </main>
  );
}
