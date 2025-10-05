"use client";

import { useState } from "react";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
];

type LanguageSelectorProps = {
  conversationLanguage: string;
  targetLanguage: string;
  onSave: (conversationLang: string, targetLang: string) => Promise<void>;
  onCancel?: () => void;
};

export default function LanguageSelector({
  conversationLanguage,
  targetLanguage,
  onSave,
  onCancel,
}: LanguageSelectorProps) {
  const [selectedConversationLang, setSelectedConversationLang] = useState(conversationLanguage);
  const [selectedTargetLang, setSelectedTargetLang] = useState(targetLanguage);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (selectedConversationLang === selectedTargetLang) {
      setError("Conversation language and target language must be different!");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSave(selectedConversationLang, selectedTargetLang);
    } catch (err) {
      setError("Failed to save language preferences. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Language Preferences</h2>
      <p className="text-gray-400 mb-6">
        Choose the language you want to speak in and the language you want to learn.
      </p>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Conversation Language */}
        <div>
          <label className="block text-sm font-bold mb-2">
            I want to speak in (Conversation Language):
          </label>
          <select
            value={selectedConversationLang}
            onChange={(e) => setSelectedConversationLang(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-blue-500"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-400 mt-1">
            This is your native language. The AI will understand you in this language.
          </p>
        </div>

        {/* Target Language */}
        <div>
          <label className="block text-sm font-bold mb-2">
            I want to learn (Target Language):
          </label>
          <select
            value={selectedTargetLang}
            onChange={(e) => setSelectedTargetLang(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-blue-500"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-400 mt-1">
            This is the language you want to learn. Lessons will teach you this language.
          </p>
        </div>

        {/* Example */}
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-sm font-semibold mb-2">Example:</p>
          <p className="text-sm text-gray-300">
            If you select <span className="text-blue-400">Hindi</span> as conversation language and{" "}
            <span className="text-green-400">English</span> as target language, you'll speak mostly in Hindi
            while learning English phrases.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
