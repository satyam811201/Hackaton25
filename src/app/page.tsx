"use client";

import { useChapterContext } from "@/app/hooks/useChapterContext";
import Block from "../components/Block";
import ChatBot from "../components/Assistant";
import DailyQuiz from "../components/DailyQuiz";
import Leaderboad from "../components/leaderboard";
import { useEffect, useState } from "react";

const kidFriendlyFont = "Comic Sans MS, cursive";

export default function Home() {
  const {
    chapter,
    setChapter,
    result,
    loading,
    error,
    rewardShown,
    expanded,
    handleToggle,
    mascotMessage,
    fetchRewards,
    handleSubmit,
    fetchResultFromTopic,
    studentRewards,
    totalPoints: totalPointsFromContext,
  } = useChapterContext();
  const handleSubmitFromStudent = (topic: string) => {
    setChapter(topic); // optional for display
    fetchResultFromTopic(topic); // this actually triggers the API
  };
  const [project, setProject] = useState(null);
  const [mascotFeedback, setMascotFeedback] = useState<string | null>(null);
  const [safeTotalPoints, setSafeTotalPoints] = useState<number>(0);
  const [rewardsVisible, setRewardsVisible] = useState(false); // New state to control reward visibility
  const projectDetails = project || result?.fun_project || null;

  useEffect(() => {
    if (
      typeof totalPointsFromContext === "number" &&
      !isNaN(totalPointsFromContext)
    ) {
      setSafeTotalPoints(totalPointsFromContext);
    } else {
      console.error(
        "Warning: Received NaN or non-numeric totalPoints from context:",
        totalPointsFromContext
      );
      setSafeTotalPoints(0);
    }
  }, [totalPointsFromContext]);

  return (
    <main
      className="min-h-screen bg-yellow-100 p-6 relative"
      style={{ fontFamily: kidFriendlyFont }}
    >
      {/* Mascot */}
      <div className="absolute top-20 left-50">
        <img src="/mascot.png" alt="Mascot" className="w-48 h-48 " />
      </div>

      {/* Mascot Message */}
      <div
        className="absolute top-60 left-6 bg-green-200 border border-green-400 text-pink-700 font-bold shadow-md rounded-lg px-4 py-2 max-w-xs text-lg"
        style={{ fontFamily: kidFriendlyFont }}
      >
        {mascotFeedback ?? mascotMessage}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-10">
        <h1
          className="text-6xl font-extrabold text-pink-800 text-center mb-8 drop-shadow-md"
          style={{ fontFamily: kidFriendlyFont }}
        >
          I-Ready Maths Buddy
        </h1>

        {/* Input Form */}
        {/* <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-8"
        >
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="What math topic are you curious about?"
            className="flex-1 p-4 rounded-xl border-2 border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg text-black font-bold text-lg w-full max-w-md"
            required
            style={{ fontFamily: kidFriendlyFont }}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg text-lg"
            style={{ fontFamily: kidFriendlyFont }}
          >
            {loading ? "Thinking..." : "✨ Show Me!"}
          </button>
        </form> */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-8"
        >
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="What math topic are you curious about?"
            className="flex-1 p-4 rounded-xl border-2 border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg text-black font-bold text-lg w-full max-w-md"
            required
            style={{ fontFamily: kidFriendlyFont }}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg text-lg"
            style={{ fontFamily: kidFriendlyFont }}
          >
            {loading ? "Thinking..." : "✨ Show Me!"}
          </button>

          {/* New: Random Topic Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch("/api/random-student");
                const data = await response.json();

                const name = data.studentName ?? "Unknown";
                const grade = data.grade ?? "?";
                const topic = data.topic || data.math_topic;
                const project = data.project ?? null;

                if (name && grade && topic) {
                  setMascotFeedback(
                    `🎉 Congrats ${name} of Grade ${grade}! Showing result for: ${topic}.`
                  );
                  setChapter(topic);
                  fetchResultFromTopic(topic);

                  // ✅ Set project details if available
                  if (project) {
                    const rawUrl = project.youtubeUrl;
                    let embedUrl = "";
                  
                    try {
                      const url = new URL(rawUrl);
                      if (url.pathname === "/watch" && url.searchParams.get("v")) {
                        const videoId = url.searchParams.get("v");
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      } else if (url.pathname === "/playlist" && url.searchParams.get("list")) {
                        const listId = url.searchParams.get("list");
                        embedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`;
                      } else {
                        embedUrl = rawUrl; // fallback
                      }
                    } catch (e) {
                      console.warn("Invalid YouTube URL format", rawUrl);
                      embedUrl = rawUrl;
                    }
                  
                    const safeProject = {
                      ...project,
                      youtubeUrl: embedUrl,
                    };
                  
                    setProject(safeProject);
                  } else {
                    setProject(null);
                  }
                  
                } else {
                  console.error("Missing student info:", data);
                  setMascotFeedback("🚫 Could not load student info.");
                }
              } catch (err) {
                console.error("Failed to fetch random topic", err);
                setMascotFeedback("❌ Oops! Something went wrong.");
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
            style={{ fontFamily: kidFriendlyFont }}
          >
            🎲 Based on Topic completed!
          </button>
        </form>
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-200 border border-red-400 text-red-900 p-6 rounded-xl mb-6 text-center shadow-lg"
            style={{ fontFamily: kidFriendlyFont }}
          >
            <strong className="text-xl">⚠️ Oops!</strong>
            <p className="mt-3 text-lg text-black font-bold">
              Hmm, that didn't quite work. Try asking about a topic like{" "}
              <em>"Fractions"</em> or <em>"Geometry"</em> 😊
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {rewardShown && (
              <div
                className="bg-green-200 border border-green-400 text-green-900 font-bold p-6 rounded-xl text-center shadow-lg text-lg"
                style={{ fontFamily: kidFriendlyFont }}
              >
                🎉 Awesome! You've unlocked all the cool stuff! You get +10
                super points!
              </div>
            )}

            <Block
              title="💡Application of concept"
              isOpen={expanded.elementary}
              onClick={() => handleToggle("elementary")}
              details={result.real_world_example?.elementary} // Pass elementary details
            />
            <Block
              title="🚀 How it is used in daily life"
              isOpen={expanded.advanced}
              onClick={() => handleToggle("advanced")}
              details={result.real_world_example?.advanced} // Pass advanced details
            />
            <Block
              title="🎨 Fun Time: Project Idea!"
              isOpen={expanded.project}
              onClick={() => handleToggle("project")}
              projectDetails={project || result.fun_project} // Pass project details
            >
             {projectDetails?.youtubeUrl && (
  <div className="mt-4">
    <iframe
      width="100%"
      height="315"
      src={projectDetails.youtubeUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)}

            </Block>

            <Block
              title="🌟 Fun fact?"
              isOpen={expanded.fact}
              onClick={() => handleToggle("fact")}
              details={result.fun_fact} // Pass fun fact details
            />
          </div>
        )}

        {/* Rewards Button Row */}
        <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-6 mt-8">
          <button
            onClick={() => {
              fetchRewards();
              setRewardsVisible(true);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-lg"
            style={{ fontFamily: kidFriendlyFont }}
          >
            🎁 Show My Super Rewards!
          </button>

          {studentRewards.length > 0 && (
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-300 hover:bg-pink-400 text-black font-bold py-3 px-6 rounded-xl shadow-lg text-lg"
              style={{ fontFamily: kidFriendlyFont }}
            >
              🔄 Let's Try Something Else!
            </button>
          )}
        </div>

        {/* Reward Summary - Shown only when rewardsVisible is true */}
        {rewardsVisible && studentRewards.length > 0 && (
          <div
            className="bg-purple-100 text-purple-800 p-6 rounded-xl mt-6 font-bold shadow-lg text-2xl text-center"
            style={{ fontFamily: kidFriendlyFont }}
          >
            🏆 You've collected{" "}
            <span className="text-purple-700 text-3xl">{safeTotalPoints}</span>{" "}
            super points! Keep learning! 🎉
          </div>
        )}
      </div>

      {/* Daily Quiz - Top Right Corner */}
      <div className="absolute top-6 right-6 w-40">
        <DailyQuiz />
      </div>

      {/* ChatBot - Bottom Right Corner */}
      <div className="fixed bottom-8 right-8 z-40">
        <img
          src="/mascot.png"
          alt="Chatbot Mascot"
          className="fixed bottom-16 right-100 z-40 w-20 h-20 animate-bounce"
        />

        <ChatBot />
        <Leaderboad />
      </div>
    </main>
  );
}
