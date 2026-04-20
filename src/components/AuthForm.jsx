import { useState } from "react";
import { supabase } from "../supabaseClient";

const AuthForm = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setSubmitting(true);

    if (isSigningUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setUser(null); 
        setSuccessMessage("Signup successful! Please check your email to confirm your account.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setUser(data?.user ?? null);
      }
    }

    setSubmitting(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setSubmitting(true);



    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setResetMode(false); 
    }

    setSubmitting(false);
  };

  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      {resetMode ? (
        
        <form onSubmit={handlePasswordReset} className="space-y-4 p-6 bg-white dark:bg-gray-800 shadow rounded w-full max-w-sm">
          <h2 className="text-xl font-bold text-center">Reset Password</h2>
          <input
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit">
            Send Reset Link
          </button>
          <p className="text-center text-sm cursor-pointer text-blue-500" onClick={() => setResetMode(false)}>
            Back to Login
          </p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      ) : (
        
        <form onSubmit={handleAuth} className="space-y-4 p-6 bg-white dark:bg-gray-800 shadow rounded w-full max-w-sm">
          <h2 className="text-xl font-bold text-center">{isSigningUp ? "Sign Up" : "Log In"}</h2>
          <input
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : isSigningUp ? "Sign Up" : "Log In"}
          </button>
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
          <p className="text-center text-sm cursor-pointer text-blue-500" onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </p>
          <p className="text-center text-sm cursor-pointer text-blue-500" onClick={() => setResetMode(true)}>
            Forgot your password?
          </p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default AuthForm;
