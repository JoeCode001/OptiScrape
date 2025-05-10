import React from 'react';

const MetaTagCard = ({ title, tags }) => (
  <div className="bg-gray-800 rounded-lg shadow w-full p-4 mb-4 border border-gray-700 min-w-0 overflow-hidden">
    <h3 className="text-lg font-semibold mb-2 text-[#FF7B25]">{title}</h3>
    {tags && tags.length > 0 ? (
      <ul className="space-y-2">
        {tags.map((tag, index) => (
          <li key={index} className="border-b border-gray-700 pb-2 last:border-0 break-words">
            <p className="font-medium text-gray-400 truncate whitespace-normal">{tag.name || tag.property}:</p>
            <p className="text-gray-300 break-words whitespace-normal">{tag.content}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">No {title.toLowerCase()} tags found</p>
    )}
  </div>
);

const PreviewCard = ({ previewData, metaTags }) => {
  const twitterTags = metaTags?.twitter || previewData?.twitter_data || [];

  const twitterData = twitterTags.reduce((acc, tag) => {
    const key = tag.property || tag.name;
    if (key && tag.content) {
      acc[key] = tag.content;
    }
    return acc;
  }, {});

  const og = previewData?.og_data || {};

  const title = twitterData['twitter:title'] || og['og:title'] || previewData?.title || 'Untitled';
  const description = twitterData['twitter:description'] || og['og:description'] || previewData?.meta_description || 'No description available';
  const image = twitterData['twitter:image'] || og['og:image'] || '';
  const url = og['og:url'] || previewData?.url || '';
  const displayUrl = url ? new URL(url).hostname.replace('www.', '') : 'example.com';

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700 mb-6 max-w-full overflow-hidden">
      <h2 className="text-xl font-semibold text-[#FF7B25] mb-4">Social Media Preview</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">How your link will appear when shared:</h3>
        <div className="max-w-lg w-full border border-gray-600 rounded-lg overflow-hidden bg-gray-900">
          {image && (
            <div className="h-48 bg-gray-700 overflow-hidden relative">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
          )}
          <div className="p-4">
            <div className="text-xs text-[#FF7B25] uppercase tracking-wider mb-1 truncate">{displayUrl}</div>
            <h4 className="text-lg text-white font-bold mb-1 line-clamp-2">{title}</h4>
            <p className="text-sm text-gray-300 line-clamp-2 mb-2">{description}</p>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#FF7B25] flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400 truncate">via YourSite</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">OpenGraph Data</h3>
          <div className="bg-gray-700 rounded-lg p-3 w-full overflow-x-auto">
            <div className="space-y-3">
              {Object.entries(og).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-start sm:gap-4 min-w-0">
                  <div className="text-gray-400 font-medium text-sm w-full sm:w-28 flex-shrink-0 break-words">
                    {key}:
                  </div>
                  <div
                    className={`text-sm break-words min-w-0 ${value ? 'text-gray-300' : 'text-gray-500 italic'}`}
                    title={value}
                  >
                    {value || 'Not set'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Twitter Card Data</h3>
          <div className="bg-gray-700 rounded-lg p-4 w-full overflow-x-auto">
            {twitterTags.length > 0 ? (
              <div className="space-y-3">
                {twitterTags.map((tag, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <div className="text-gray-400 font-medium w-full sm:w-40 break-words">
                      {tag.property || tag.name}:
                    </div>
                    <div className="text-gray-300 flex-1 break-words">
                      {tag.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No Twitter card tags found</p>
            )}
          </div>
        </div>

      </div>

      {(previewData?.warnings?.length > 0 || previewData?.notices?.length > 0) && (
        <div className="mt-4 space-y-3">
          {previewData.warnings?.map((warning, i) => (
            <div key={`warn-${i}`} className="flex items-start p-3 bg-red-900/30 rounded-lg border border-red-800">
              <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-gray-300">{warning}</span>
            </div>
          ))}
          {previewData.notices?.map((notice, i) => (
            <div key={`notice-${i}`} className="flex items-start p-3 bg-blue-900/30 rounded-lg border border-blue-800">
              <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300">{notice}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    <div className="w-full mx-auto px-1 sm:px-1">
      <div className="bg-gray-900 rounded-lg shadow-lg p-2 sm:p-2 border border-gray-800 max-w-full overflow-x-hidden">
        <h1 className="text-2xl font-bold text-gray-300 mb-6">SEO Meta Results</h1>

        <div className="space-y-6">
          {seoAnalyzerResult.current_data?.preview_data && (
            <PreviewCard
              previewData={seoAnalyzerResult.current_data.preview_data}
              metaTags={seoAnalyzerResult.current_data?.meta_tags}
            />
          )}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
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
                  className={`h-2.5 rounded-full ${(seoAnalyzerResult.analysis?.performance_score || 0) >= 70
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

          {seoAnalyzerResult.analysis?.improvements ? (
            <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-[#FF7B25] mb-4">Suggested Improvements</h2>

              {seoAnalyzerResult.analysis.improvements.title && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Title</h3>
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 font-medium">Current:</p>
                    <p className="text-gray-300 mb-2">{seoAnalyzerResult.current_data?.title || 'Not found'}</p>
                    <p className="text-gray-400 font-medium">Suggested:</p>
                    <p className="text-gray-300">{seoAnalyzerResult.analysis.improvements.title}</p>
                  </div>
                </div>
              )}

              {seoAnalyzerResult.analysis.improvements.standard?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Standard Meta Tags</h3>
                  <div className="space-y-3">
                    {seoAnalyzerResult.analysis.improvements.standard.map((tag, i) => (
                      <div key={i} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-400 font-medium">{tag.name}:</p>
                        <p className="text-gray-300 break-words">{tag.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {seoAnalyzerResult.analysis.improvements.opengraph?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">OpenGraph Tags</h3>
                  <div className="space-y-3">
                    {seoAnalyzerResult.analysis.improvements.opengraph.map((tag, i) => (
                      <div key={i} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-400 font-medium truncate">{tag.property}:</p>
                        <p className="text-gray-300 break-words whitespace-normal">{tag.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {seoAnalyzerResult.analysis.improvements.twitter?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-[#FF7B25] mb-2">Twitter Tags</h3>
                  <div className="space-y-3">
                    {seoAnalyzerResult.analysis.improvements.twitter.map((tag, i) => (
                      <div key={i} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-400 font-medium truncate">{tag.name}:</p>
                        <p className="text-gray-300 break-words whitespace-normal">{tag.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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