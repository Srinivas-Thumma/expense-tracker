import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, payload);
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not continue. Check your details.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-600 text-white">
            <Wallet size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Expense Tracker</h1>
            <p className="text-sm text-slate-500">{mode === "login" ? "Login to continue" : "Create your account"}</p>
          </div>
        </div>

        {mode === "register" && (
          <>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
              placeholder="Your name"
              required
            />
          </>
        )}

        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="you@example.com"
          type="email"
          required
        />

        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="Password"
          type="password"
          required
        />

        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button className="w-full rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm font-medium text-emerald-700"
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
