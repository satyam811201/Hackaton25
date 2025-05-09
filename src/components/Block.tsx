
import React from 'react';

interface BlockProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  details?: {
    example?: string;
    explanation?: string;
    visual_description?: string;
    visual_representation?: string;
    fact?: string;
  };
  projectDetails?: {
    title?: string;
    explanation?: string;
    visual_description?: string;
    visual_representation?: string;
    youtubeUrl?: string;
  };
}

export default function Block({ title, isOpen, onClick, details, projectDetails }: BlockProps) {
  const toggleText = isOpen
    ? `Hide ${title.replace('💡 ', '').replace('🚀 ', '').replace('🌟 ', '')}`
    : `Show ${title.replace('💡 ', '').replace('🚀 ', '').replace('🌟 ', '')}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-300">
      <h2 className="text-xl font-bold text-blue-700 mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        {title}
      </h2>
      <button
        onClick={onClick}
        className="w-full text-left py-2 rounded-md focus:outline-none focus:shadow-outline"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {title === "🎨 Fun Time: Project Idea!" && projectDetails?.title
              ? (isOpen ? "Hide Project Details" : projectDetails.title)
              : toggleText}
          </span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Project Section */}
      {isOpen && title === "🎨 Fun Time: Project Idea!" && projectDetails ? (
        <div className="mt-4 space-y-4">
          {projectDetails.title && (
            <h3 className="text-xl font-bold text-purple-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {projectDetails.title}
            </h3>
          )}
          {projectDetails.visual_description && (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-gray-700 italic" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Visual Guide: {projectDetails.visual_description}
              </p>
              {projectDetails.visual_representation && (
                <pre className="font-mono text-sm mt-2 bg-gray-100 p-2 rounded-md border border-gray-200">
                  {projectDetails.visual_representation}
                </pre>
              )}
              <p className="text-gray-600 mt-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                (Imagine an image or diagram here based on the description above!)
              </p>
            </div>
          )}
          {projectDetails.explanation && (
            <div className="text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              <h4 className="font-semibold text-lg text-green-700 mb-2">How to do it:</h4>
              <p className="whitespace-pre-line">{projectDetails.explanation}</p>
            </div>
          )}
          {projectDetails.youtubeUrl && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-red-600 mb-2">Watch Project in Action:</h4>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={projectDetails.youtubeUrl}
                  title="Project Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 rounded-xl shadow-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      ) : isOpen && details ? (
        // Details Section
        <div className="mt-2 text-gray-800 space-y-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          {details.example && (
            <>
              <h4 className="font-semibold text-lg text-green-700 mb-1">Example:</h4>
              <p>{details.example}</p>
            </>
          )}
          {details.explanation && (
            <>
              <h4 className="font-semibold text-lg text-green-700 mb-1">Explanation:</h4>
              <p>{details.explanation}</p>
            </>
          )}
          {details.visual_description && (
            <div className="bg-yellow-50 p-2 rounded-md border border-yellow-200">
              <p className="text-gray-700 italic">Visual Hint: {details.visual_description}</p>
              {details.visual_representation && (
                <pre className="font-mono text-sm mt-1 bg-gray-100 p-1 rounded-md border border-gray-200">
                  {details.visual_representation}
                </pre>
              )}
              <p className="text-gray-600 mt-1">(Imagine a simple visual here!)</p>
            </div>
          )}
          {details.fact && (
            <>
              <h4 className="font-semibold text-lg text-purple-600 mb-1">Fun Fact:</h4>
              <p>{details.fact}</p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
