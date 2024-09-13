'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Section {
  id: string
  title: string
  content: string
}

interface ReadmeState {
  projectName: string
  description: string
  uploadedFileName: string
  uploadedFileUrl: string
  sections: Section[]
}

interface ReadmeContextType {
  readmeState: ReadmeState
  updateReadmeState: (updates: Partial<ReadmeState>) => void
  updateSection: (id: string, content: string) => void
  addSection: (title: string) => void
  removeSection: (id: string) => void
  resetReadme: () => void
}

const initialState: ReadmeState = {
  projectName: '',
  description: '',
  uploadedFileName: '',
  uploadedFileUrl: '',
  sections: []
}

const ReadmeContext = createContext<ReadmeContextType | undefined>(undefined)

export const ReadmeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [readmeState, setReadmeState] = useState<ReadmeState>(initialState)

  const updateReadmeState = (updates: Partial<ReadmeState>) => {
    setReadmeState(prevState => ({ ...prevState, ...updates }))
  }

  const updateSection = (id: string, content: string) => {
    setReadmeState(prevState => ({
      ...prevState,
      sections: prevState.sections.map(section =>
        section.id === id ? { ...section, content } : section
      )
    }))
  }

  const addSection = (title: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      title,
      content: ''
    }
    setReadmeState(prevState => ({
      ...prevState,
      sections: [...prevState.sections, newSection]
    }))
  }

  const removeSection = (id: string) => {
    setReadmeState(prevState => ({
      ...prevState,
      sections: prevState.sections.filter(section => section.id !== id)
    }))
  }

  const resetReadme = () => {
    setReadmeState(initialState)
  }

  return (
    <ReadmeContext.Provider value={{
      readmeState,
      updateReadmeState,
      updateSection,
      addSection,
      removeSection,
      resetReadme
    }}>
      {children}
    </ReadmeContext.Provider>
  )
}

export const useReadme = () => {
  const context = useContext(ReadmeContext)
  if (context === undefined) {
    throw new Error('useReadme must be used within a ReadmeProvider')
  }
  return context
}