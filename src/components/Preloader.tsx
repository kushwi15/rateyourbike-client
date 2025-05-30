import React from 'react';
import icon from '../assets/icon.png';

const Preloader: React.FC = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Spinning Glowing Background Ring */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-[conic-gradient(#00ffcc,#0066ff,#cc00ff,#00ffcc)] blur-3xl animate-spin-slow z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing, Bouncing Icon */}
        <div className="mb-6 animate-bounce">
  <img
    src={icon}
    alt="Bike Icon"
    className="h-32 drop-shadow-[0_0_10px_#00ffe1] animate-glow"
  />
</div>


        {/* Typing Loading Text */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white overflow-hidden whitespace-nowrap border-r-2 border-white animate-typing">
  RateYourBike...
</h1>

        {/* Shimmering Tagline */}
        <p className="text-sm md:text-lg mt-3 bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent animate-shimmer">
          Reving up your experience...
        </p>
      </div>

      {/* Embedded Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px #00ffe1); }
          50% { filter: drop-shadow(0 0 20px #00ffe1); }
        }
        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }

        @keyframes typing {
    from { width: 0; }
    to { width: 15ch; } /* exactly length of "RateYourBike..." */
  }
  @keyframes blink {
    0%, 100% { border-color: white; }
    50% { border-color: transparent; }
  }
  .animate-typing {
    width: 0; /* start width */
    animation:
      typing 3s steps(15) forwards, /* type exactly 15 chars */
      blink 0.75s step-end infinite;
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid white;
  }
      `}</style>
    </div>
  );
};

export default Preloader;
