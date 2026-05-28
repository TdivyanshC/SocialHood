"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMessage("Configuration error: Supabase credentials are not available.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("client_credentials")
      .select("client_name, password, display_name")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    setIsLoading(false);

    if (error) {
      setErrorMessage(`Supabase error: ${error.message}`);
      return;
    }

    if (!data) {
      setErrorMessage("Invalid username or password.");
      return;
    }

    if (data.password !== password) {
      setErrorMessage("Invalid username or password.");
      return;
    }

    const authValue = {
      clientName: data.client_name,
      username: username.trim().toLowerCase(),
      displayName: data.display_name || data.client_name,
      authenticatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("socialhood_client_auth", JSON.stringify(authValue));
    }

    router.push(`/${data.client_name}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Client Login</h1>
          <p className="mt-3 text-sm text-white/70">
            Enter the preassigned client username and password to open your custom client page.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-sm text-white/70">Client Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none transition focus:border-[#00B98E]"
              placeholder="e.g. krishna"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none transition focus:border-[#00B98E]"
              placeholder="Enter your assigned password"
              required
            />
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-[#00B98E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#00d494] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Validating…" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/60">
          <p>
            No sign-up is available. Credentials are preassigned for each client.
          </p>
          <p className="mt-3">
            If you are a client, use the preassigned username and password or contact support.
          </p>
        </div>

        <div className="mt-8 text-sm text-white/50">
          <p>
            Example client URL after login: <span className="font-medium text-white">https://thesocialhood.in/your_client_name</span>
          </p>
          <p className="mt-2">
            If you already have a client URL, you can go back to the homepage or login again.
          </p>
        </div>

        <div className="mt-8 text-sm text-white/70">
          <Link href="/" className="text-[#00B98E] hover:text-[#63ffcc]">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
