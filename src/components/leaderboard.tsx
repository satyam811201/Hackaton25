// components/Leaderboard.tsx
"use client";

import { useEffect, useState } from "react";

type RewardEntry = {
  studentId: string;
  reward?: number;
  points?: number;
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<{ studentId: string; total: number }[]>(
    []
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;

    fetch("/reward_log.json")
      .then((res) => res.json())
      .then((data: RewardEntry[]) => {
        const totals: Record<string, number> = {};

        data.forEach((entry) => {
          const id = entry.studentId;
          const value = entry.reward ?? entry.points ?? 0;
          if (!totals[id]) totals[id] = 0;
          totals[id] += value;
        });

        const sorted = Object.entries(totals)
          .map(([studentId, total]) => ({ studentId, total }))
          .sort((a, b) => b.total - a.total);

        setLeaders(sorted);
      });
  }, [show]);

  return (
    <div className="fixed top-6 right-6 z-50 text-sm">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 font-bold px-6 py-3 rounded-full shadow-lg"
        style={{ fontFamily: "Comic Sans MS, cursive" }}
      >
        🏆 Show Leaderboard
      </button>

      {show && (
        <div className="bg-white mt-4 p-6 rounded-xl shadow-xl border-4 border-purple-300 w-80">
          <h2 className="text-xl font-bold text-purple-700 text-center mb-4">
            📋 Leaderboard
          </h2>
          <ul className="space-y-2">
            {leaders.map((entry, index) => (
              <li
                key={entry.studentId}
                className="flex justify-between items-center p-2 text-black rounded-lg bg-purple-50"
              >
                <span>
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}{" "}
                  <strong>{entry.studentId}</strong>
                </span>
                <span className="text-purple-700 font-semibold">
                  {entry.total} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
