"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (username.length < 3) {
      setError("Le pseudo doit faire au moins 3 caractères.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username } },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Un compte existe déjà avec cet email."
          : "Une erreur est survenue. Réessaie."
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <div className="px-6 pt-14 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#8B85FF] flex items-center justify-center mb-6 shadow-lg shadow-[#6C63FF]/25">
          <span className="text-white text-xl font-black">W</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Crée ton compte</h1>
        <p className="text-gray-400 mt-2">Rejoins la communauté Wearlyx</p>
      </div>

      <form onSubmit={handleSignup} className="flex-1 px-6 flex flex-col gap-4">
        <Input
          label="Nom complet"
          type="text"
          placeholder="Jean Dupont"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Pseudo"
          type="text"
          placeholder="jeandupont"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
          leftIcon={<span className="text-gray-400 text-sm">@</span>}
          hint="Minimum 3 caractères, sans espace"
          required
        />

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
          placeholder="Minimum 6 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
          autoComplete="new-password"
        />

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" loading={loading} fullWidth size="lg">
            Créer mon compte
          </Button>
        </div>

        <div className="text-center pb-8">
          <p className="text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#6C63FF] font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
