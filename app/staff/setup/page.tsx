"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Setup() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <main className="staff-shell" style={{ maxWidth: 600 }}>
      <div className="intake-card">
        <span className="eyebrow">The Lotus Foundation · Members</span>
        <h1>Set up your staff account</h1>
        <p>
          Choose a password with at least 12 characters. This link can be used
          once.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const token = new URLSearchParams(location.hash.slice(1)).get(
              "token",
            );
            if (!token) {
              setError("Open the full setup link from your email.");
              return;
            }
            if (f.get("password") !== f.get("confirm")) {
              setError("Your passwords don’t match.");
              return;
            }
            setBusy(true);
            setError("");
            try {
              const r = await fetch("/api/staff/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: f.get("password") }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              history.replaceState(null, "", "/staff/setup");
              router.replace("/staff/login?setup=complete");
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Please try again.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            New password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save password and go to sign-in"}
          </button>
        </form>
      </div>
    </main>
  );
}
