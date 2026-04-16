import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const AIAssistant = ({ onContentGenerated, initialContent, initialType = 'body' }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  // Prefill prompt for summaries or initial content
  useEffect(() => {
    if (initialContent && type === 'summary') {
      setPrompt(`Summarize this blog post in 3-5 concise sentences, capturing the main points and key takeaways: ${initialContent}`);
    } else if (initialContent) {
      setPrompt(initialContent);
    }
  }, [initialContent, type]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedText('');

    try {
      const response = await fetch('http://localhost:8080/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedText(data.text);
      } else {
        console.error('AI Error:', data.error);
        setGeneratedText(`Error: ${data.error || 'Unknown issue occurred.'}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setGeneratedText('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedText('');
  };

  const handleCopy = async () => {
    if (generatedText && navigator.clipboard) {
      await navigator.clipboard.writeText(generatedText);
      // Optional: Visual feedback
      const button = document.querySelector('[data-copy-button]');
      if (button) {
        const original = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => { button.textContent = original; }, 2000);
      }
    }
  };

  const handleUseContent = () => {
    onContentGenerated?.(generatedText, type);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6 text-white">
      <h3 className="text-xl font-bold mb-3 text-yellow-400 flex items-center gap-2">
        ✨ AI Writing Assistant
      </h3>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <select
          aria-label="Select content type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600 text-white focus:border-yellow-400 outline-none"
        >
          <option value="title">Generate Title</option>
          <option value="body">Generate Post Body</option>
          <option value="category">Generate Category</option>
          <option value="summary">Summarize Post</option>
        </select>

        <input
          aria-label="AI prompt input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic, keywords, or context..."
          className="grow p-2 rounded bg-gray-800 border border-gray-600 text-white focus:border-yellow-400 outline-none"
        />

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt}
        >
          {loading ? 'Generating...' : 'Ask AI'}
        </Button>

        <Button
          type="button"
          onClick={handleClear}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          disabled={!prompt && !generatedText}
        >
          Clear
        </Button>
      </div>

      {generatedText && (
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            Generated Result:
          </h4>
          <div className="whitespace-pre-wrap mb-4 text-gray-200 max-h-40 overflow-y-auto">
            {generatedText}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="button"
              onClick={handleCopy}
              data-copy-button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
            >
              Copy Summary
            </Button>
            <Button
              type="button"
              onClick={handleUseContent}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
            >
              Use This Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

AIAssistant.propTypes = {
  onContentGenerated: PropTypes.func,
  initialContent: PropTypes.string,
  initialType: PropTypes.oneOf(['title', 'body', 'category', 'summary']),
};

AIAssistant.defaultProps = {
  initialType: 'body',
};

export default AIAssistant;

