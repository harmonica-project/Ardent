/* eslint-disable */
import * as React from 'react';

const blankProject = {
  project: {
    url: '',
    name: '',
    description: ''
  }
}

const ProjectContext = React.createContext(blankProject);

function projectReducer(state, action) {
    switch (action.type) {
      case 'change': {
        localStorage.setItem('project', JSON.stringify({ project: action.payload }));
        return { project: action.payload }
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }

function ProjectProvider({children}) {
  const strNewProject = localStorage.getItem('project');
  const newProject = (strNewProject ? JSON.parse(strNewProject) : blankProject);

  const [state, dispatch] = React.useReducer(projectReducer, newProject)
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch}
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
  
function useProject() {
    const context = React.useContext(ProjectContext)
    if (context === undefined) {
      throw new Error('useProject must be used within a ProjectProvider')
    }
    return context
}

export { ProjectProvider, useProject }