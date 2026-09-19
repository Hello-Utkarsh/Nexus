'use client';

import React from 'react';
import { LandingHero } from '../LandingHero';
import { IndiaMapBackdrop } from './IndiaMapBackdrop';

export interface OverviewViewProps {
  onStartInvestigation: () => void;
  onExploreDemo: () => void;
}

/**
 * OverviewView: High-Trust Operations Briefing & Command Console
 * Includes the tactical Survey of India map background with Varanasi radar pulse.
 */
export const OverviewView: React.FC<OverviewViewProps> = ({
  onStartInvestigation,
  onExploreDemo,
}) => {
  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-slate-950">
      {/* 1. Tactical India Map Wireframe & Varanasi Radar Beacon (First Child, z-0) */}
      <IndiaMapBackdrop />

      {/* 2. Existing Content Cards, Text, and Grids (relative z-10) */}
      <div className="relative z-10 w-full min-h-full">
        <LandingHero
          onStartInvestigation={onStartInvestigation}
          onExploreDemo={onExploreDemo}
        />
      </div>
    </div>
  );
};

export { IndiaMapBackdrop };
export default OverviewView;
