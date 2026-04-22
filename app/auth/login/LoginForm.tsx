"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <div className="px-6 pt-14 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#8B85FF] flex items-center justify-center mb-6 shadow-lg shadow-[#6C63FF]/25">
          <span className="text-white text-xl font-black">W</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Bon retour !</h1>
        <p className="text-gray-400 mt-2">Connecte-toi à ton compte Wearlyx</p>
      </div>

      <form onSubmit={handleLogin} className="flex-1 px-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
          autoComplete="email"
        />

        <Input
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" loading={loading} fullWidth size="lg">
            Se connecter
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-[#6C63FF] font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
