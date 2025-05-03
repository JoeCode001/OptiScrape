import React from 'react';

const PageSpeedReport = ({ data }) => {
  // Check if data is empty or invalid
  if (!data || !data.lighthouseResult || !data.lighthouseResult.audits) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">No Data Available</h1>
          <p className="text-gray-400">
            The PageSpeed Insights report data is empty or invalid.
          </p>
        </div>
      </div>
    );
  }

  // Extract core metrics from audits
  const coreMetrics = {
    'First Contentful Paint': {
      value: data.lighthouseResult.audits['first-contentful-paint']?.displayValue,
      score: data.lighthouseResult.audits['first-contentful-paint']?.score,
      fieldData: data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS
    },
    'Largest Contentful Paint': {
      value: data.lighthouseResult.audits['largest-contentful-paint']?.displayValue,
      score: data.lighthouseResult.audits['largest-contentful-paint']?.score,
      fieldData: data.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS
    },
    'Cumulative Layout Shift': {
      value: data.lighthouseResult.audits['cumulative-layout-shift']?.displayValue,
      score: data.lighthouseResult.audits['cumulative-layout-shift']?.score,
      fieldData: data.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE
    },
    'Total Blocking Time': {
      value: data.lighthouseResult.audits['total-blocking-time']?.displayValue,
      score: data.lighthouseResult.audits['total-blocking-time']?.score
    },
    'Speed Index': {
      value: data.lighthouseResult.audits['speed-index']?.displayValue,
      score: data.lighthouseResult.audits['speed-index']?.score
    }
  };

  // Get performance score
  const performanceScore = data.lighthouseResult.categories?.performance?.score
    ? Math.round(data.lighthouseResult.categories.performance.score * 100)
    : null;

  // Format distribution data for display
  const formatDistribution = (distributions) => {
    return distributions.map((dist, i) => (
      <div key={i} className="text-sm text-gray-400">
        {dist.min}-{dist.max || '∞'}ms: {(dist.proportion * 100).toFixed(1)}%
      </div>
    ));
  };

  return (
    <div className="w-full mx-auto md:p-6 h-auto bg-gray-950">
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow mb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">PageSpeed Insights Report</h1>
            <p className="text-sm md:text-base text-gray-300 break-all">
              {data.lighthouseResult.requestedUrl || data.lighthouseResult.finalUrl}
            </p>
          </div>
          <div className="mt-2 md:mt-0 text-xs md:text-sm text-gray-400">
            Analyzed on: {new Date(data.lighthouseResult.fetchTime).toLocaleString()}
          </div>
        </div>

        {/* Performance Score Banner */}
        {performanceScore && (
          <div className={`mb-6 p-3 md:p-4 rounded-lg ${
            performanceScore >= 90 ? 'bg-green-900 text-green-100' :
            performanceScore >= 50 ? 'bg-yellow-900 text-yellow-100' :
            'bg-red-900 text-red-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base md:text-lg font-semibold">Overall Performance Score</h2>
                <p className="text-xs md:text-sm">
                  {performanceScore >= 90 ? 'Excellent' :
                   performanceScore >= 50 ? 'Needs Improvement' : 'Poor'}
                </p>
              </div>
              <div className="text-3xl md:text-4xl font-bold">{performanceScore}</div>
            </div>
          </div>
        )}

        {/* Core Metrics Section */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Core Web Vitals</h2>
          <div className="space-y-3 md:space-y-4">
            {Object.entries(coreMetrics).map(([name, metric]) => (
              <div key={name} className="border-b border-gray-700 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-200">{name}</div>
                    {metric.fieldData && (
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          metric.fieldData.category === 'FAST' ? 'bg-green-900 text-green-100' :
                          metric.fieldData.category === 'AVERAGE' ? 'bg-yellow-900 text-yellow-100' :
                          'bg-red-900 text-red-100'
                        }`}>
                          Field: {metric.fieldData.category} (P{metric.fieldData.percentile})
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{metric.value || 'N/A'}</div>
                    {metric.score !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        metric.score >= 0.9 ? 'bg-green-900 text-green-100' :
                        metric.score >= 0.5 ? 'bg-yellow-900 text-yellow-100' :
                        'bg-red-900 text-red-100'
                      }`}>
                        {metric.score >= 0.9 ? 'Good' :
                         metric.score >= 0.5 ? 'Needs Improvement' : 'Poor'}
                      </span>
                    )}
                  </div>
                </div>
                {metric.fieldData?.distributions && (
                  <div className="mt-2 text-xs">
                    <div className="font-medium text-gray-400">Real-user distribution:</div>
                    {formatDistribution(metric.fieldData.distributions)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Full Page Screenshot with responsive handling */}
        {data.lighthouseResult.fullPageScreenshot?.screenshot?.data && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-xl font-semibold text-white">Full Page Screenshot</h2>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-sm bg-gray-800">
              <img 
                src={`${data.lighthouseResult.fullPageScreenshot.screenshot.data}`}
                alt="Full page screenshot"
                className="w-full h-auto max-h-[60vh] object-contain"
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400 text-center">
              Tip: Scroll horizontally if needed to view full screenshot
            </p>
          </div>
        )}

        {/* Loading Experience Summary */}
        {data.loadingExperience && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-white">Field Data Summary</h2>
            <div className={`p-2 rounded ${
              data.loadingExperience.overall_category === 'FAST' ? 'bg-green-900 text-green-100' :
              data.loadingExperience.overall_category === 'AVERAGE' ? 'bg-yellow-900 text-yellow-100' :
              'bg-red-900 text-red-100'
            }`}>
              <div className="font-medium">Overall Loading Experience:</div>
              <div className="text-lg font-bold">{data.loadingExperience.overall_category}</div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(data.loadingExperience.metrics || {}).map(([key, metric]) => (
                <div key={key} className="bg-gray-700 p-3 rounded shadow-xs">
                  <h3 className="text-sm font-medium text-gray-200">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <div className="mt-1">
                    <div className={`text-sm px-2 py-1 inline-block rounded ${
                      metric.category === 'FAST' ? 'bg-green-900 text-green-100' :
                      metric.category === 'AVERAGE' ? 'bg-yellow-900 text-yellow-100' :
                      'bg-red-900 text-red-100'
                    }`}>
                      {metric.category} (P{metric.percentile})
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <div className="font-medium text-gray-400">User distribution:</div>
                    {formatDistribution(metric.distributions)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {data.lighthouseResult.audits && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-white">Top Optimization Opportunities</h2>
            <div className="space-y-3">
              {Object.values(data.lighthouseResult.audits)
                .filter(audit => audit.score !== null && audit.score < 0.9 && audit.details?.items)
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((audit, index) => (
                  <div key={index} className="border-l-4 border-yellow-600 bg-yellow-900 bg-opacity-30 p-3 rounded-r">
                    <h3 className="font-medium text-sm md:text-base text-yellow-100">{audit.title}</h3>
                    <p className="text-xs md:text-sm text-gray-300 mt-1">{audit.description}</p>
                    {audit.displayValue && (
                      <p className="text-xs md:text-sm mt-1 font-medium text-yellow-100">{audit.displayValue}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSpeedReport;