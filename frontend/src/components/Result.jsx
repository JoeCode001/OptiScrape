import React from 'react';
import axios from 'axios';

// MetaTagCard Component
const MetaTagCard = ({ title, tags }) => (
  <div className="bg-transparent rounded-lg shadow p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {tags.length > 0 ? (
      <ul className="space-y-2">
        {tags.map((tag, index) => (
          <li key={index} className="border-b pb-2 last:border-0">
            <p className="font-medium text-gray-400">{tag.name || tag.property}:</p>
            <p className="text-gray-600 break-words">{tag.content}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No {title.toLowerCase()} tags found</p>
    )}
  </div>
);

// PageSpeedSection Component
const PageSpeedSection = ({ pageSpeedResult }) => (
  <div className="bg-transparent rounded-lg shadow-lg p-6 mt-6">
    <h2 className="text-xl font-semibold text-gray-400 mb-4">PageSpeed Insights</h2>

    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-400">Performance Score</span>
        <span className="text-sm font-semibold">
          {pageSpeedResult.performance}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            pageSpeedResult.performance >= 70
              ? 'bg-green-500'
              : pageSpeedResult.performance >= 40
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${pageSpeedResult.performance}%` }}
        ></div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400 mb-2">First Contentful Paint</h3>
        <p className="text-gray-400">{pageSpeedResult.first_contentful_paint}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Speed Index</h3>
        <p className="text-gray-400">{pageSpeedResult.speed_index}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Largest Contentful Paint</h3>
        <p className="text-gray-400">{pageSpeedResult.largest_contentful_paint}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Time to Interactive</h3>
        <p className="text-gray-400">{pageSpeedResult.time_to_interactive}</p>
      </div>
    </div>
  </div>
);

function Result({ seoAnalyzerResult, isSeoOrPageSpeed, pageSpeedResult }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-transparent rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-400 mb-6">
          {isSeoOrPageSpeed ? 'SEO Meta Result' : 'PageSpeed Result'}
        </h1>

        {isSeoOrPageSpeed  && seoAnalyzerResult && (
          <div className="space-y-6">
            <div className="bg-transparent rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-400 mb-4">Current Meta Tags</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <MetaTagCard title="Standard Tags" tags={seoAnalyzerResult.current_data.meta_tags.standard} />
                <MetaTagCard title="OpenGraph Tags" tags={seoAnalyzerResult.current_data.meta_tags.opengraph} />
                <MetaTagCard title="Twitter Tags" tags={seoAnalyzerResult.current_data.meta_tags.twitter} />
                <MetaTagCard title="Other Tags" tags={seoAnalyzerResult.current_data.meta_tags.other} />
              </div>
            </div>

            <div className="bg-transparent rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-400 mb-4">SEO Analysis</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Performance Score</span>
                  <span className="text-sm font-semibold">
                    {seoAnalyzerResult.analysis.performance_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      seoAnalyzerResult.analysis.performance_score >= 70
                        ? 'bg-green-500'
                        : seoAnalyzerResult.analysis.performance_score >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${seoAnalyzerResult.analysis.performance_score}%` }}
                  ></div>
                </div>
              </div>

              {seoAnalyzerResult.analysis.weaknesses.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Weaknesses</h3>
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
                        <span className="text-gray-400">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {seoAnalyzerResult.analysis.improvements && (
              <div className="bg-transparent rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-400 mb-4">Suggested Improvements</h2>

                {seoAnalyzerResult.analysis.improvements.title && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-400 mb-2">Title</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-400 font-medium">Current:</p>
                      <p className="text-gray-600 mb-2">{seoAnalyzerResult.current_data.title}</p>
                      <p className="text-gray-400 font-medium">Suggested:</p>
                      <p className="text-gray-400">{seoAnalyzerResult.analysis.improvements.title}</p>
                    </div>
                  </div>
                )}

                {seoAnalyzerResult.analysis.improvements.standard &&
                  seoAnalyzerResult.analysis.improvements.standard.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-400 mb-2">Standard Meta Tags</h3>
                      <div className="space-y-3">
                        {seoAnalyzerResult.analysis.improvements.standard.map((tag, i) => (
                          <div key={i} className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-gray-400 font-medium">{tag.name}:</p>
                            <p className="text-gray-400">{tag.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {seoAnalyzerResult.analysis.improvements.opengraph &&
                  seoAnalyzerResult.analysis.improvements.opengraph.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-400 mb-2">OpenGraph Tags</h3>
                      <div className="space-y-3">
                        {seoAnalyzerResult.analysis.improvements.opengraph.map((tag, i) => (
                          <div key={i} className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-gray-400 font-medium">{tag.property}:</p>
                            <p className="text-gray-400">{tag.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {!isSeoOrPageSpeed  && pageSpeedResult && (
          <PageSpeedSection pageSpeedResult={pageSpeedResult} />
        )}
      </div>
    </div>
  );
}

export default Result;
