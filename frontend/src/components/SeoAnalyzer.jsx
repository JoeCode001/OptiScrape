import React from 'react';

const MetaTagCard = ({ title, tags }) => (
  <div className="bg-gray-800 rounded-lg shadow md:w-full w-[8cm] p-4 mb-4 border border-gray-700">
    <h3 className="text-lg font-semibold mb-2 text-[#FF7B25]">{title}</h3>
    {tags && tags.length > 0 ? (
      <ul className="space-y-2">
        {tags.map((tag, index) => (
          <li key={index} className="border-b border-gray-700 pb-2 last:border-0">
            <p className="font-medium text-gray-400">{tag.name || tag.property}:</p>
            <p className="text-gray-300 break-words">{tag.content}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">No {title.toLowerCase()} tags found</p>
    )}
  </div>
);

function Result({ seoAnalyzerResult }) {
  if (!seoAnalyzerResult) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
          <h1 className="text-2xl font-bold text-gray-300 mb-6">SEO Meta Results</h1>
          <p className="text-gray-400">No SEO data available. Please run an analysis first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto overflow-hidden">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-gray-300 mb-6">SEO Meta Results</h1>

        <div className="space-y-6">
            <div className=" w-full grid md:grid-cols-2 gap-4 relative">
              <MetaTagCard 
                title="Standard Tags" 
                tags={seoAnalyzerResult.current_data?.meta_tags?.standard || []} 
              />
              <MetaTagCard 
                title="OpenGraph Tags" 
                tags={seoAnalyzerResult.current_data?.meta_tags?.opengraph || []} 
              />
              <MetaTagCard 
                title="Twitter Tags" 
                tags={seoAnalyzerResult.current_data?.meta_tags?.twitter || []} 
              />
              <MetaTagCard 
                title="Other Tags" 
                tags={seoAnalyzerResult.current_data?.meta_tags?.other || []} 
              />
            </div>


          {/* SEO Analysis Section */}
          <div className="bg-gray-800 rounded-lg shadow p-2 relative border border-gray-700">
            <h2 className="text-xl font-semibold text-[#FF7B25] mb-4">SEO Analysis</h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-400">Performance Score</span>
                <span className="text-sm font-semibold text-gray-300">
                  {(seoAnalyzerResult.analysis?.performance_score || 0)}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    (seoAnalyzerResult.analysis?.performance_score || 0) >= 70
                      ? 'bg-green-500'
                      : (seoAnalyzerResult.analysis?.performance_score || 0) >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${seoAnalyzerResult.analysis?.performance_score || 0}%` }}
                ></div>
              </div>
            </div>

            {seoAnalyzerResult.analysis?.weaknesses?.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Weaknesses</h3>
                <ul className="space-y-2">
                  {seoAnalyzerResult.analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 italic">No major weaknesses found</p>
            )}
          </div>

          {/* Suggested Improvements Section */}
          {seoAnalyzerResult.analysis?.improvements ? (
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-[#FF7B25] mb-4">Suggested Improvements</h2>

              {seoAnalyzerResult.analysis.improvements.title ? (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Title</h3>
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 font-medium">Current:</p>
                    <p className="text-gray-300 mb-2">{seoAnalyzerResult.current_data?.title || 'Not found'}</p>
                    <p className="text-gray-400 font-medium">Suggested:</p>
                    <p className="text-gray-300">{seoAnalyzerResult.analysis.improvements.title}</p>
                  </div>
                </div>
              ) : null}

              {seoAnalyzerResult.analysis.improvements.standard?.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Standard Meta Tags</h3>
                  <div className="space-y-3">
                    {seoAnalyzerResult.analysis.improvements.standard.map((tag, i) => (
                      <div key={i} className="bg-gray-700 p-4 rounded-lg border border-gray-600 relative">
                        <p className="text-gray-400 font-medium">{tag.name}:</p>
                        <p className="text-gray-300">{tag.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {seoAnalyzerResult.analysis.improvements.opengraph?.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">OpenGraph Tags</h3>
                  <div className="space-y-3">
                    {seoAnalyzerResult.analysis.improvements.opengraph.map((tag, i) => (
                     <div key={i} className="bg-gray-700 p-4 rounded-lg border border-gray-600 min-w-0">
                     <p className="text-gray-400 font-medium truncate">{tag.property}:</p>
                     <p className="text-gray-300 break-words whitespace-normal">{tag.content}</p>
                   </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">Suggested Improvements</h2>
              <p className="text-gray-500 italic">No specific improvements suggested</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;