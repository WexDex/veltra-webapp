"use client";

import Link from "next/link";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import VeltraLogo from "@/components/ui/VeltraLogo";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 p-3 rounded-xl bg-blue-700/10 border border-blue-700/20">
            <VeltraLogo size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">
            Create an account
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Join Veltra to access the chat
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col gap-5">
          <Input
            label="Full Name"
            id="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            autoComplete="name"
          />
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            autoComplete="email"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            autoComplete="new-password"
          />
          <Button className="w-full mt-1" size="lg">
            Create Account
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
