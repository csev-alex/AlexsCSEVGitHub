import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProjectInfo } from './components/inputs/ProjectInfo';
import { UtilitySelector } from './components/inputs/UtilitySelector';
import { ServiceClassSelector } from './components/inputs/ServiceClassSelector';
import { MeteringSelector } from './components/inputs/MeteringSelector';
import { EVSEInstalled } from './components/inputs/EVSEInstalled';
import { OwnershipSettings } from './components/inputs/OwnershipSettings';
import { BillingPeriodInputs } from './components/inputs/BillingPeriodInputs';
import { RevenueSettings } from './components/inputs/RevenueSettings';
import { ResultsSummary } from './components/results/ResultsSummary';
import { SeasonBreakdown } from './components/results/SeasonBreakdown';
import { YearlyTotal } from './components/results/YearlyTotal';
import { CostHighlight } from './components/results/CostHighlight';
import { RevenueResults } from './components/results/RevenueResults';
import { DownloadButton } from './components/report/DownloadButton';
import { ProjectsModal } from './components/ProjectsModal';
import { useProjectStorage } from './hooks/useProjectStorage';
import { useCalculations } from './hooks/useCalculations';
import { Project } from './types';

function App() {
  const {
    projects,
    currentProject,
    isLoading,
    createProject,
    updateProject,
    selectProject,
    deleteProject,
    duplicateProject,
  } = useProjectStorage();

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const results = useCalculations(currentProject);

  // Create initial project if none exists
  useEffect(() => {
    if (!isLoading && projects.length === 0) {
      createProject('My First Project');
    }
  }, [isLoading, projects.length, createProject]);

  const handleNewProject = () => {
    const name = prompt('Enter project name:', 'New Project');
    if (name) {
      createProject(name);
    }
  };

  const handleUpdateProject = (updates: Partial<Project>) => {
    updateProject(updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header onNewProject={handleNewProject} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Welcome to EV Phase-In Rate Estimator
            </h2>
            <p className="text-neutral-600 mb-4">
              Create your first project to get started
            </p>
            <button onClick={handleNewProject} className="btn-primary">
              Create Project
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header
        projectName={currentProject.name}
        onNewProject={handleNewProject}
        onOpenProjects={() => setShowProjectsModal(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <ProjectInfo project={currentProject} onUpdate={handleUpdateProject} />

            <div className="card">
              <h2 className="section-title flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Rate Configuration
              </h2>
              <div className="space-y-4">
                <UtilitySelector
                  project={currentProject}
                  onUpdate={handleUpdateProject}
                />
                <ServiceClassSelector
                  project={currentProject}
                  onUpdate={handleUpdateProject}
                />
                <MeteringSelector
                  project={currentProject}
                  onUpdate={handleUpdateProject}
                />
              </div>
            </div>

            <EVSEInstalled
              project={currentProject}
              onUpdate={handleUpdateProject}
            />

            <OwnershipSettings
              project={currentProject}
              onUpdate={handleUpdateProject}
            />

            <BillingPeriodInputs
              project={currentProject}
              onUpdate={handleUpdateProject}
            />

            <RevenueSettings
              project={currentProject}
              onUpdate={handleUpdateProject}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Results</h2>
                  <DownloadButton results={results} />
                </div>

                <ResultsSummary results={results} />
                <CostHighlight results={results} />
                <SeasonBreakdown
                  summer={results.monthly.summer}
                  winter={results.monthly.winter}
                />
                <YearlyTotal yearly={results.yearly} />

                {results.revenue && (
                  <RevenueResults
                    revenue={results.revenue}
                    totalAnnualKwh={results.yearly.totalKwh}
                  />
                )}
              </>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-neutral-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                    Add EVSE to See Results
                  </h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    Add at least one EVSE to your inventory to calculate costs
                    and see your estimated savings under the EV Phase-In Rate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Projects Modal */}
      <ProjectsModal
        projects={projects}
        currentProjectId={currentProject.id}
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        onSelect={selectProject}
        onDelete={deleteProject}
        onDuplicate={duplicateProject}
        onCreate={handleNewProject}
      />
    </div>
  );
}

export default App;
