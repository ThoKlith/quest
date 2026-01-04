'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface GuessSliderProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export default function GuessSlider({ value, onChange, disabled = false }: GuessSliderProps) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="w-full space-y-6">
            {/* Value display */}
            <motion.div
                className="text-center"
                animate={{ scale: isDragging ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <div className="text-7xl font-bold gradient-text mb-2">
                    {value}%
                </div>
                <p className="text-sm opacity-70">Your guess</p>
            </motion.div>

            {/* Slider */}
            <div className="relative px-2">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    disabled={disabled}
                    className="slider w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, 
              #667eea 0%, 
              #764ba2 ${value}%, 
              rgba(255,255,255,0.1) ${value}%, 
              rgba(255,255,255,0.1) 100%)`
                    }}
                />

                {/* Percentage markers */}
                <div className="flex justify-between mt-2 text-xs opacity-50">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.7);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
