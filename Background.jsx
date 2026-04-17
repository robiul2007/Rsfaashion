import React, { useMemo } from 'react';

const Background = () => {
  // Pre-calculate shapes so they don't re-render and cause lag
  const shapes = useMemo(() => {
    const colors = ['#fce7f3', '#e0f2fe', '#d1fae5', '#ede9fe', '#fef3c7'];
    const paths = [
      '<circle cx="50" cy="50" r="40" />',
      '<path d="M20 50 Q 35 20 50 50 T 80 50" />',
      '<path d="M50 10 C 80 40 80 80 50 90 C 20 80 20 40 50 10" />',
      '<path d="M50 10 L 60 40 L 90 40 L 65 60 L 75 90 L 50 70 L 25 90 L 35 60 L 10 40 L 40 40 Z" />',
      '<path d="M30 20 C 60 10 80 30 70 60 C 60 90 20 80 10 50 C 0 20 10 30 30 20" />'
    ];

    return Array.from({ length: 25 }).map((_, i) => {
      const size = 30 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];
      return {
        id: `shape-${i}`,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 200}vh`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `drift ${15 + Math.random() * 20}s infinite linear alternate`,
        svgStr: `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round">${path}</svg>`
      };
    });
  }, []);

  // Pre-calculate stars
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const size = 1 + Math.random() * 3;
      return {
        id: `star-${i}`,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 200}vh`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `drift ${20 + Math.random() * 30}s infinite linear alternate`
      };
    });
  }, []);

  return (
    <div className="canvas-container">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="floating-shape"
          style={{ left: shape.left, top: shape.top, width: shape.width, height: shape.height, animation: shape.animation }}
          dangerouslySetInnerHTML={{ __html: shape.svgStr }}
        />
      ))}
      {stars.map((star) => (
        <div
          key={star.id}
          className="floating-star"
          style={{ left: star.left, top: star.top, width: star.width, height: star.height, animation: star.animation }}
        />
      ))}
    </div>
  );
};

export default Background;
