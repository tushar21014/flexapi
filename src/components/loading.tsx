"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingBattle() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [loadingDots, setLoadingDots] = useState("")
  const typingSpeed = 70 // milliseconds per character

  // Array of flattering SQL queries
  const flatteringQueries = [
    `SELECT opponent FROM coders 
WHERE skill_level <= (
  SELECT extraordinary_skill 
  FROM elite_coders 
  WHERE username = You
);`,

    `SELECT challenger FROM matches
  WHERE coding_ability = exceptional
  AND can_handle_pressure = TRUE
  AND worthy_of_opponent = (
    SELECT brilliance FROM users
    WHERE current_user = TRUE
  );`,

    `UPDATE leaderboard
SET status = trembling
WHERE competitors NOT IN (
  SELECT you FROM current_session
)
AND fear_level > 9000;`,

    `CREATE VIEW worthy_opponents AS
SELECT * FROM all_coders
WHERE problem_solving < (
  SELECT genius_level FROM current_user
)
AND can_appreciate = Your elegant code;`,

    `SELECT * FROM challenges
WHERE difficulty = (
  SELECT 
    CASE
      WHEN skill_level > 95 THEN "worthy of your time"
      ELSE "too easy for you" 
    END
  FROM current_user
);`,
  ]

  // Reference to the current query
  const currentQuery = flatteringQueries[currentTextIndex]

  // Flattering messages for the loading text
  const flatteringMessages = [
    "Finding an opponent worthy of your brilliance...",
    "Searching for someone who can handle your code...",
    "Looking for a challenger who might keep up with you...",
    "Scanning the platform for elite minds like yours...",
    "Matching you with someone who appreciates genius...",
  ]

  // Ref for the code container to enable scrolling
  const codeContainerRef = useRef<HTMLDivElement>(null)

  // Typing effect
  useEffect(() => {
    if (typedText.length < currentQuery.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentQuery.substring(0, typedText.length + 1))

        // Auto-scroll as text is typed
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight
        }
      }, typingSpeed)

      return () => clearTimeout(timeout)
    } else {
      setIsTypingComplete(true)

      // Move to next query after a delay
      const nextQueryTimeout = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % flatteringQueries.length)
        setTypedText("")
        setIsTypingComplete(false)
      }, 3000)

      return () => clearTimeout(nextQueryTimeout)
    }
  }, [typedText, currentQuery])

  // Loading dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Get current flattering message
  const currentMessage = flatteringMessages[currentTextIndex % flatteringMessages.length]

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
      {/* Code editor container */}
      <motion.div
        className="w-full max-w-2xl bg-[#1E293B] rounded-lg overflow-hidden shadow-xl border border-[#334155]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Editor header */}
        <div className="bg-[#1E293B] border-b border-[#334155] p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-[#94A3B8] text-sm ml-2">query.sql</span>
          </div>
          <div className="text-[#94A3B8] text-xs">SQL Query</div>
        </div>

        {/* Line numbers and code */}
        <div className="flex">
          {/* Line numbers */}
          <div className="bg-[#1E293B] text-[#64748B] p-4 text-right select-none font-mono text-sm">
            {Array.from({ length: currentQuery.split("\n").length }).map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code content */}
          <div ref={codeContainerRef} className="bg-[#0F172A] p-4 font-mono text-sm overflow-auto flex-1 max-h-[300px]">
            <div className="text-white leading-6">
              {typedText.split("\n").map((line, i) => (
                <div key={i} className="min-h-[24px]">
                  <span className="text-[#38BDF8]">
                    {line.includes("SELECT") && line.split("SELECT")[0]}
                    {line.includes("SELECT") && <span className="text-[#F472B6]">SELECT</span>}
                    {line.includes("SELECT") && line.split("SELECT")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("FROM") && line.split("FROM")[0].replace("SELECT", "")}
                    {line.includes("FROM") && <span className="text-[#F472B6]">FROM</span>}
                    {line.includes("FROM") && line.split("FROM")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("WHERE") && line.split("WHERE")[0].replace("SELECT", "").replace("FROM", "")}
                    {line.includes("WHERE") && <span className="text-[#F472B6]">WHERE</span>}
                    {line.includes("WHERE") && line.split("WHERE")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("UPDATE") && line.split("UPDATE")[0]}
                    {line.includes("UPDATE") && <span className="text-[#F472B6]">UPDATE</span>}
                    {line.includes("UPDATE") && line.split("UPDATE")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("SET") && line.split("SET")[0].replace("UPDATE", "")}
                    {line.includes("SET") && <span className="text-[#F472B6]">SET</span>}
                    {line.includes("SET") && line.split("SET")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("CREATE") && line.split("CREATE")[0]}
                    {line.includes("CREATE") && <span className="text-[#F472B6]">CREATE</span>}
                    {line.includes("CREATE") && line.split("CREATE")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("VIEW") && line.split("VIEW")[0].replace("CREATE", "")}
                    {line.includes("VIEW") && <span className="text-[#F472B6]">VIEW</span>}
                    {line.includes("VIEW") && line.split("VIEW")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("AS") && line.split("AS")[0].replace("CREATE", "").replace("VIEW", "")}
                    {line.includes("AS") && <span className="text-[#F472B6]">AS</span>}
                    {line.includes("AS") && line.split("AS")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("CASE") && line.split("CASE")[0]}
                    {line.includes("CASE") && <span className="text-[#F472B6]">CASE</span>}
                    {line.includes("CASE") && line.split("CASE")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("WHEN") && line.split("WHEN")[0].replace("CASE", "")}
                    {line.includes("WHEN") && <span className="text-[#F472B6]">WHEN</span>}
                    {line.includes("WHEN") && line.split("WHEN")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("THEN") && line.split("THEN")[0].replace("WHEN", "")}
                    {line.includes("THEN") && <span className="text-[#F472B6]">THEN</span>}
                    {line.includes("THEN") && line.split("THEN")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("ELSE") && line.split("ELSE")[0]}
                    {line.includes("ELSE") && <span className="text-[#F472B6]">ELSE</span>}
                    {line.includes("ELSE") && line.split("ELSE")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("END") && line.split("END")[0]}
                    {line.includes("END") && <span className="text-[#F472B6]">END</span>}
                    {line.includes("END") && line.split("END")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("AND") && line.split("AND")[0]}
                    {line.includes("AND") && <span className="text-[#F472B6]">AND</span>}
                    {line.includes("AND") && line.split("AND")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("OR") && !line.includes("ORDER") && line.split("OR")[0]}
                    {line.includes("OR") && !line.includes("ORDER") && <span className="text-[#F472B6]">OR</span>}
                    {line.includes("OR") && !line.includes("ORDER") && line.split("OR")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("IN") && !line.includes("INT") && line.split("IN")[0]}
                    {line.includes("IN") && !line.includes("INT") && <span className="text-[#F472B6]">IN</span>}
                    {line.includes("IN") && !line.includes("INT") && line.split("IN")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {line.includes("NOT") && line.split("NOT")[0]}
                    {line.includes("NOT") && <span className="text-[#F472B6]">NOT</span>}
                    {line.includes("NOT") && line.split("NOT")[1]}
                  </span>

                  <span className="text-[#38BDF8]">
                    {!line.includes("SELECT") &&
                      !line.includes("FROM") &&
                      !line.includes("WHERE") &&
                      !line.includes("UPDATE") &&
                      !line.includes("SET") &&
                      !line.includes("CREATE") &&
                      !line.includes("VIEW") &&
                      !line.includes("AS") &&
                      !line.includes("CASE") &&
                      !line.includes("WHEN") &&
                      !line.includes("THEN") &&
                      !line.includes("ELSE") &&
                      !line.includes("END") &&
                      !line.includes("AND") &&
                      !line.includes("OR") &&
                      !line.includes("IN") &&
                      !line.includes("NOT") &&
                      line}
                  </span>

                  {/* Highlight strings in quotes */}
                  {line.includes('"') &&
                    line.split('"').map((part, index) =>
                      index % 2 === 1 ? (
                        <span key={index} className="text-[#A5F3FC]">
                          "{part}"
                        </span>
                      ) : null,
                    )}
                </div>
              ))}
              {!isTypingComplete && (
                <motion.span
                  className="inline-block w-2 h-4 bg-white ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Terminal output */}
        <div className="bg-[#0F172A] border-t border-[#334155] p-3 text-[#94A3B8] font-mono text-sm">
          {isTypingComplete ? (
            <div className="text-green-400">Query executed successfully. Searching database...</div>
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
        <p className="text-[#94A3B8] text-sm">This might take a moment. Exceptional talent deserves a worthy match.</p>
      </motion.div>
    </div>
  )
}
