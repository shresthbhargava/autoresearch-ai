/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from "./components/LandingPage";
import GeneratorPage from "./components/GeneratorPage";
import ResultsPage from "./components/ResultsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import { BRDDocument, ActivityLog } from './types';
import { mockBRDs, mockRecentActivities } from './mockData';
import Sidebar from "./components/Sidebar";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [savedBrds, setSavedBrds] = useState<BRDDocument[]>(mockBRDs);
  const [selectedDocId, setSelectedDocId] = useState<string>('brd-nexus');
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>(mockRecentActivities);

  // When a new BRD is compiled successfully (either via port 8000 fetch or dynamic simulation)
  const handleGenerationComplete = (newBrd: BRDDocument) => {
    setSavedBrds(prev => [newBrd, ...prev]);
    setSelectedDocId(newBrd.id);
    
    // Log the newly generated document activity at the top
    const cleanLogTitle = newBrd.title.replace('Business Requirement Document: ', '');
    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substring(2, 9),
      title: cleanLogTitle,
      status: 'Success',
      timestamp: 'Just now'
    };
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Redirect cleanly to the results tab to display it immediately!
    setCurrentPage('results');
  };

  const handleDocChange = (id: string) => {
    setSelectedDocId(id);
  };

  const handleNewResearch = () => {
    setCurrentPage('generator');
  };

  const handleExitToLanding = () => {
    setCurrentPage('landing');
  };

  // 1) Handle Landing Page View
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onStartGenerator={() => setCurrentPage('generator')}
        onViewSample={() => {
          setSelectedDocId('brd-nexus');
          setCurrentPage('results');
        }}
      />
    );
  }

  // 2) Handle Internal Workspace Layout with sidebar
  return (
    <div className="bg-white text-neutral-900 font-sans min-h-screen flex antialiased">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onNewResearch={handleNewResearch}
        onExitToLanding={handleExitToLanding}
        brdCount={savedBrds.length}
      />

      {/* Main Content frame container */}
      <main className="flex-1 ml-64 p-6 lg:p-8 max-w-[1300px] w-full min-h-screen">
        {currentPage === 'generator' && (
          <GeneratorPage 
            onGenerationComplete={handleGenerationComplete} 
            savedBrds={savedBrds}
          />
        )}

        {currentPage === 'results' && (
          <ResultsPage 
            documents={savedBrds}
            selectedDocId={selectedDocId}
            onDocChange={handleDocChange}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage 
            recentActivities={recentActivities} 
            brdCount={savedBrds.length}
          />
        )}
      </main>
    </div>
  );
}

