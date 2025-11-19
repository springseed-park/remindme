import React from 'react';

interface GaugeChartProps {
  score: number;
  maxScore: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ score, maxScore }) => {
  const percentage = Math.min(Math.max(score / maxScore, 0), 1);
  const angle = percentage * 180;
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;       
  }
  
  const arcPath = describeArc(50, 50, 40, 0, angle);
  const backgroundPath = describeArc(50, 50, 40, 0, 180);

  // FIX: Removed a block of unused code that was causing a compile error
  // due to a variable being used before its declaration. The removed code
  // appeared to be from an unfinished refactoring.

  return (
    <svg viewBox="0 0 100 55" className="w-32 h-auto mx-auto">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path
        d={backgroundPath}
        fill="none"
        stroke="#374151" // gray-700
        strokeWidth="10"
        strokeLinecap="round"
      />
      {percentage > 0 && <path
        d={arcPath}
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />}
    </svg>
  );
};

export default GaugeChart;