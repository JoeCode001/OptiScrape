import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSEO = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:8000/analyze`, {
        params: { url },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze URL");
    } finally {
      setLoading(false);
    }
  };

  const MetaTagCard = ({ title, tags }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {tags.length > 0 ? (
        <ul className="space-y-2">
          {tags.map((tag, index) => (
            <li key={index} className="border-b pb-2 last:border-0">
              <p className="font-medium text-gray-700">{tag.name || tag.property}:</p>
              <p className="text-gray-600 break-words">{tag.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No {title.toLowerCase()} tags found</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">SEO Meta Tag Analyzer</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g., https://example.com)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={analyzeSEO}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze SEO"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Meta Tags</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <MetaTagCard title="Standard Tags" tags={result.current_data.meta_tags.standard} />
                <MetaTagCard title="OpenGraph Tags" tags={result.current_data.meta_tags.opengraph} />
                <MetaTagCard title="Twitter Tags" tags={result.current_data.meta_tags.twitter} />
                <MetaTagCard title="Other Tags" tags={result.current_data.meta_tags.other} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO Analysis</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Performance Score</span>
                  <span className="text-sm font-semibold">
                    {result.analysis.performance_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.analysis.performance_score >= 70 ? 'bg-green-500' :
                      result.analysis.performance_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${result.analysis.performance_score}%` }}
                  ></div>
                </div>
              </div>

              {result.analysis.weaknesses.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Weaknesses</h3>
                  <ul className="space-y-2">
                    {result.analysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.analysis.improvements && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested Improvements</h2>
                {result.analysis.improvements.title && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Title</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium">Current:</p>
                      <p className="text-gray-600 mb-2">{result.current_data.title}</p>
                      <p className="text-gray-700 font-medium">Suggested:</p>
                      <p className="text-gray-800">{result.analysis.improvements.title}</p>
                    </div>
                  </div>
                )}

                {result.analysis.improvements.standard && result.analysis.improvements.standard.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Standard Meta Tags</h3>
                    <div className="space-y-3">
                      {result.analysis.improvements.standard.map((tag, i) => (
                        <div key={i} className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700 font-medium">{tag.name}:</p>
                          <p className="text-gray-800">{tag.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.analysis.improvements.opengraph && result.analysis.improvements.opengraph.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">OpenGraph Tags</h3>
                    <div className="space-y-3">
                      {result.analysis.improvements.opengraph.map((tag, i) => (
                        <div key={i} className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700 font-medium">{tag.property}:</p>
                          <p className="text-gray-800">{tag.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}