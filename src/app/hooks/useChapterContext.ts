// src/app/hooks/useChapterContext.ts
"use client";

import { useState, useEffect } from "react";
import { getLLMResponse } from "@/lib/llmClient";
import confetti from "canvas-confetti";

export const useChapterContext = () => {
  const [chapter, setChapter] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [rewardShown, setRewardShown] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("Hi there! I’m your Maths Buddy 🐰");

  const [studentRewards, setStudentRewards] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showRewards, setShowRewards] = useState(false); // added state for toggling reward UI

  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/getRewards?studentId=student_001");
      if (res.ok) {
        const data: any[] = await res.json();
        setStudentRewards(data);
        // Calculate total points, handling both 'reward' and 'points' properties
        const total = data.reduce((sum: number, r: any) => {
          return sum + (typeof r.reward === 'number' ? r.reward : 0) + (typeof r.points === 'number' ? r.points : 0);
        }, 0);
        setTotalPoints(total);
      } else {
        console.error("Failed to fetch rewards:", res.status);
        setStudentRewards([]);
        setTotalPoints(0);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setStudentRewards([]);
      setTotalPoints(0);
    }
  };
  

  const showReward = () => {
    confetti();
    setMascotMessage("Yay! You did it! +10 points! 🎉");
    setTimeout(() => {
      fetch("/api/logReward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter,
          reward: 10,
          timestamp: new Date().toISOString(),
          studentId: "student_001",
        }),
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setExpanded({});
    setRewardShown(false);
    setMascotMessage("Thinking... 🤔");

    try {
      const data = await getLLMResponse(chapter);
      setResult(data);
      setMascotMessage("Here’s what I found for you! 🧠");
    } catch (err: any) {
      setError(err.message);
      setMascotMessage("Oops! That didn’t work. Try another topic? 🐣");
    }

    setLoading(false);
  };
  const fetchResultFromTopic = async (topic: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
  
    try {
      const response = await fetch("/api/get-topic-context", {
        method: "POST",
        body: JSON.stringify({ chapterName: topic }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch context");
      }
  
      const data = await response.json();
      setResult(data);
      setRewardShown(true);
    } catch (err) {
      setError("Could not generate content.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggle = (key: string) => {
    const newExpanded = { ...expanded, [key]: !expanded[key] };
    setExpanded(newExpanded);

    const allKeys = ["elementary", "advanced", "project", "fact"];
    const allOpened = allKeys.every((k) => newExpanded[k]);

    if (allOpened && !rewardShown) {
      setRewardShown(true);
      showReward();
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []); // Fetch rewards on component mount

  return {
    chapter,
    setChapter,
    result,
    loading,
    error,
    expanded,
    rewardShown,
    handleSubmit,
    handleToggle,
    mascotMessage,
    studentRewards,
    totalPoints,
    fetchRewards,
    showRewards,
    setShowRewards,
    fetchResultFromTopic,
  };
};