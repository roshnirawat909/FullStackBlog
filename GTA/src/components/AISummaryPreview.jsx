import React, { useState } from 'react';
import AIAssistant from './AIAssistant';
import PropTypes from 'prop-types';

const AISummaryPreview = ({ posts, onSummaryGenerated }) => {
  const [showSummaries, setShowSummaries] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});

  const handleSummaryGenerated = (summary, postId) => {
    setSummaries(prev => ({ ...prev, [postId]: summary }));
    setLoadingSummaries(prev => ({ ...prev, [postId]: false }));
    onSummaryGenerated?.(postId, summary);
  };

  const toggleSummaries = () => {
    setShowSummaries(!showSummaries);
    if (!showSummaries) {
      // Pre-generate summaries for first 3 posts on open
      posts.slice(0, 3).forEach(post => {
        if (!summaries[post._id] && post.body) {
          setLoadingSummaries(prev => ({ ...prev, [post._id]: true }));
          // Note: Individual AIAssistant handles actual API call
        }
      });
    }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="mb-8 p-4 bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
      <button 
        onClick={toggleSummaries}
        className="mb-4 bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
        disabled={showSummaries && Object.keys(summaries).length === 0}
      >
        ✨ AI {showSummaries ? 'Hide' : 'Show'} Post Previews ({Object.keys(summaries).length}/{posts.length})
      </button>

      {showSummaries && (
        <div className="space-y-3">
          {posts.slice(0, 6).map(post => (
            <div key={post._id || post.title} className="flex gap-3 items-start p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="shrink-0 w-12 h-12 bg-linear-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                {loadingSummaries[post._id] ? (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    Generating summary...
                  </div>
                ) : summaries[post._id] ? (
                  <div className="text-sm text-gray-800 line-clamp-2 leading-relaxed">
                    "{summaries[post._id]}"
                  </div>
                ) : (
                  <AIAssistant 
                    initialContent={`Create a 1-2 sentence preview summary for this post titled "${post.title}": ${post.body?.substring(0, 300)}...`}
                    initialType="summary"
                    onContentGenerated={(summary) => handleSummaryGenerated(summary, post._id)}
                    className="p-0 border-none bg-transparent"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">{post.title}</p>
              </div>
            </div>
          ))}
          {posts.length > 6 && (
            <p className="text-center text-sm text-gray-500">
              Showing previews for first 6 posts...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

AISummaryPreview.propTypes = {
  posts: PropTypes.array.isRequired,
  onSummaryGenerated: PropTypes.func,
};

export default AISummaryPreview;

