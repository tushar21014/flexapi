"use client";
import Lottie from "lottie-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import typingAnimation from "/public/assets/typing.json";

// Helper function to highlight SQL keywords in a line
function highlightSQL(line: string) {
  const keywords = [
    "SELECT", "FROM", "WHERE", "UPDATE", "SET", "CREATE", "VIEW", "AS", "CASE",
    "WHEN", "THEN", "ELSE", "END", "AND", "OR", "IN", "NOT"
  ];
  // Regex to match keywords, quoted strings, or words
  const regex = new RegExp(
    `(".*?"|\\b(?:${keywords.join("|")})\\b)`,
    "gi"
  );
  const parts = line.split(regex).filter(Boolean);

  return parts.map((part, idx) => {
    if (/^".*"$/.test(part)) {
      // Quoted string
      return (
        <span key={idx} className="text-[#A5F3FC]">
          {part}
        </span>
      );
    }
    if (keywords.includes(part.toUpperCase())) {
      return (
        <span key={idx} className="text-[#F472B6]">
          {part}
        </span>
      );
    }
    return (
      <span key={idx} className="text-[#38BDF8]">
        {part}
      </span>
    );
  });
}

export default function LoadingBattle() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const typingSpeed = 70; // milliseconds per character

  // Array of flattering SQL queries
  const flatteringQueries = [
    `SELECT name, fields FROM database.schemas
WHERE owner = CURRENT_USER;`,

    `SELECT title, author FROM content
WHERE schema_id = 1;`,

    `UPDATE schemas
SET status = 'AI_SUGGESTED'
WHERE reviewed = FALSE;`,

    `DELETE FROM schemas
WHERE obsolete = TRUE;`,
  ];

  // Reference to the current query
  const currentQuery = flatteringQueries[currentTextIndex];

  // Flattering messages for the loading text
  const flatteringMessages = [
    "Analyzing your requirements with AI precision...",
    "Designing the perfect schema for your content...",
    "Optimizing relationships and fields for your project...",
    "Ensuring your data model is robust and scalable...",
    "Almost done! Finalizing your custom schema...",
  ];

  // Ref for the code container to enable scrolling
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    if (typedText.length < currentQuery.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentQuery.substring(0, typedText.length + 1));

        // Auto-scroll as text is typed
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop =
            codeContainerRef.current.scrollHeight;
        }
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);

      // Move to next query after a delay
      const nextQueryTimeout = setTimeout(() => {
        setCurrentTextIndex(
          (prevIndex) => (prevIndex + 1) % flatteringQueries.length
        );
        setTypedText("");
        setIsTypingComplete(false);
      }, 3000);

      return () => clearTimeout(nextQueryTimeout);
    }
  }, [typedText, currentQuery]);

  // Loading dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Get current flattering message
  const currentMessage =
    flatteringMessages[currentTextIndex % flatteringMessages.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-around bg-black/30 backdrop-blur-sm">
      {/* Lottie Animation */}
      <div
        style={{
          width: "40%",
          background: "rgba(73,69,255,0.08)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Lottie
          animationData={typingAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* Modal Loader Box */}
      <div
        className="flex flex-col items-center justify-center h-fit"
        style={{
          width: "min(60vw, 600px)",
          minWidth: "320px",
          minHeight: "50vh",
          background: "rgba(24,24,27,0.95)",
          borderRadius: "2rem",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          padding: "2rem",
        }}
      >
        {/* Friendly message */}
        <div className="mb-4 text-2xl font-bold text-gray-300 text-center">
          Generating your schema with AI...
        </div>
        <div className="mb-6 text-gray-100 text-center max-w-lg">
          Please wait while our AI analyzes your input and creates a tailored
          schema for your project.
        </div>
        <motion.div
          className="w-full max-w-2xl bg-[#18181b] rounded-lg shadow-lg border border-[#334155] mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Code editor area */}
          <div
            ref={codeContainerRef}
            className="bg-[#0F172A] p-6 font-mono text-sm text-[#38BDF8] h-48 overflow-y-auto"
            style={{ minHeight: "12rem", maxHeight: "12rem" }}
          >
            {typedText.split("\n").map((line, i) => (
              <div key={i} className="min-h-[24px]">
                {highlightSQL(line)}
              </div>
            ))}
            {!isTypingComplete && (
              <motion.span
                className="inline-block w-2 h-4 bg-white ml-1 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            )}
          </div>
          {/* Terminal output */}
          <div className="bg-[#0F172A] border-t border-[#334155] p-3 text-[#94A3B8] font-mono text-sm">
            {isTypingComplete ? (
              <div className="text-green-400">
                Query executed successfully. Searching database...
              </div>
            ) : (
              <div>Typing query...</div>
            )}
          </div>
        </motion.div>
        {/* Loading message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center mb-2">
            <Loader2 className="w-5 h-5 text-[#38BDF8] mr-2 animate-spin" />
            <p className="text-white text-lg font-medium">
              {currentMessage}
              {loadingDots}
            </p>
          </div>
          <p className="text-[#94A3B8] text-sm">
            This might take a moment. Exceptional talent deserves a worthy
            match.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
