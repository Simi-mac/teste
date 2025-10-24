import React from 'react';
import type { TrackStep } from '../types';

interface TrackProgressProps {
  steps: TrackStep[];
}

const TrackProgress: React.FC<TrackProgressProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return null;
  }
  
  const ICONS = {
    CURRENT: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    UPCOMING: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    )
  }

  return (
    <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Sua Trilha de Aprendizado</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${index === 0 ? 'bg-blue-500' : 'bg-slate-200'}`}>
                {index === 0 ? ICONS.CURRENT : ICONS.UPCOMING}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{step.title}</h4>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackProgress;
