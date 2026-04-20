import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("waiting"); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
      setSessionChecked(true);
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <p>Checking session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <p>You must be logged in to reset your password. Please request a new link and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Set a New Password</h2>
        <input
          type="password"
          required
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
        />
        {status !== "success" && (
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg"
          >
            Update Password
          </button>
        )}

        {status === "success" && (
          <p className="text-green-600 text-center">Password updated! Redirecting...</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center">Error updating password. Try again.</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
