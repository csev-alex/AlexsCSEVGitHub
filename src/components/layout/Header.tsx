import React from 'react';

interface HeaderProps {
  projectName?: string;
  onNewProject?: () => void;
  onOpenProjects?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onNewProject,
  onOpenProjects,
}) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/csev-logo.png"
              alt="ChargeSmart EV"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-sm text-neutral-500">
                EV Phase-In Rate Estimator
              </p>
            </div>
          </div>

          {/* Project Name & Actions */}
          <div className="flex items-center gap-4">
            {projectName && (
              <span className="text-sm text-neutral-600 hidden sm:block">
                {projectName}
              </span>
            )}

            <div className="flex items-center gap-2">
              {onOpenProjects && (
                <button
                  onClick={onOpenProjects}
                  className="text-neutral-600 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  title="My Projects"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </button>
              )}

              {onNewProject && (
                <button
                  onClick={onNewProject}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline">New Project</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
