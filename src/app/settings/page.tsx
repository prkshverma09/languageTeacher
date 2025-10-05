"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSelector from "@/components/LanguageSelector";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLanguages, setUserLanguages] = useState({ conversationLanguage: "en", targetLanguage: "en" });
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setUserLanguages({
            conversationLanguage: data.conversationLanguage || "en",
            targetLanguage: data.targetLanguage || "en",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserSettings();
    }
  }, [status]);

  const handleSaveLanguages = async (conversationLang: string, targetLang: string) => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationLanguage: conversationLang,
          targetLanguage: targetLang,
        }),
      });

      if (response.ok) {
        setUserLanguages({ conversationLanguage: conversationLang, targetLanguage: targetLang });
        setMessage({ type: "success", text: "Language preferences saved successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save language preferences. Please try again." });
      setTimeout(() => setMessage(null), 3000);
      throw error;
    }
  };

  const handleResetProgress = async () => {
    setIsResetting(true);
    try {
      const response = await fetch("/api/user/reset-progress", {
        method: "POST",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Progress reset successfully! Redirecting to lessons..." });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("Failed to reset");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to reset progress. Please try again." });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Language Preferences Section */}
        <section className="mb-8">
          <LanguageSelector
            conversationLanguage={userLanguages.conversationLanguage}
            targetLanguage={userLanguages.targetLanguage}
            onSave={handleSaveLanguages}
          />
        </section>

        {/* Progress Reset Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Reset Progress</h2>
          <p className="text-gray-400 mb-4">
            Reset your progress across all lessons. This will start you back at the beginning.
            This is useful for testing or if you want to practice from the start.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="bg-red-900 border border-red-600 p-4 rounded">
              <p className="font-bold mb-4">⚠️ Are you sure?</p>
              <p className="text-sm text-gray-300 mb-4">
                This will reset your progress in all lessons. You will start from the beginning.
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleResetProgress}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {isResetting ? "Resetting..." : "Yes, Reset Progress"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Back to Home */}
        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Lessons
          </button>
        </div>
      </div>
    </main>
  );
}
