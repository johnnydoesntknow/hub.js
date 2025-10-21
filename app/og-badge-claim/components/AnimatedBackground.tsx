export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="blue-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4105b6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7B328D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4105b6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="blue-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7B328D" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4105b6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C15483" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {[...Array(5)].map((_, i) => (
          <g key={i}>
            <path
              d={`M ${100 - i * 8} ${20 + i * 5} 
                  C ${80 - i * 6} ${40 + i * 3}, ${60 - i * 4} ${30 - i * 2}, ${40 - i * 2} ${50 + i * 4}
                  S ${20 + i * 3} ${60 - i * 3}, ${-10 + i * 5} ${40 + i * 5}`}
              stroke="#4105b6"
              strokeWidth="0.1"
              fill="none"
              opacity="0.2"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,0; ${-30 + i * 6},${20 - i * 4}; ${20 - i * 5},${-30 + i * 6}; ${30 - i * 4},${10 + i * 3}; 0,0`}
                dur={`${35 + i * 4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="d"
                values={`
                  M ${100 - i * 8} ${20 + i * 5} C ${80 - i * 6} ${40 + i * 3}, ${60 - i * 4} ${30 - i * 2}, ${40 - i * 2} ${50 + i * 4} S ${20 + i * 3} ${60 - i * 3}, ${-10 + i * 5} ${40 + i * 5};
                  M ${100 - i * 8} ${30 + i * 5} C ${85 - i * 6} ${20 + i * 3}, ${65 - i * 4} ${40 - i * 2}, ${45 - i * 2} ${30 + i * 4} S ${25 + i * 3} ${50 - i * 3}, ${-10 + i * 5} ${35 + i * 5};
                  M ${100 - i * 8} ${25 + i * 5} C ${75 - i * 6} ${50 + i * 3}, ${55 - i * 4} ${25 - i * 2}, ${35 - i * 2} ${55 + i * 4} S ${15 + i * 3} ${65 - i * 3}, ${-10 + i * 5} ${45 + i * 5};
                  M ${100 - i * 8} ${20 + i * 5} C ${80 - i * 6} ${40 + i * 3}, ${60 - i * 4} ${30 - i * 2}, ${40 - i * 2} ${50 + i * 4} S ${20 + i * 3} ${60 - i * 3}, ${-10 + i * 5} ${40 + i * 5}
                `}
                dur={`${28 + i * 2}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}
      </svg>
    </div>
  );
}