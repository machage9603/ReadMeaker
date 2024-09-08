'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ReadmeContextType {
  readmeState: ReadmeState
  updateReadmeState: (updates: Partial<ReadmeState>) => void
  updateSection: (id: string, content: string) => void
  addSection: (title: string) => void
  removeSection: (id: string) => void
}

interface Section {
  id: string
  title: string
  content: string
}

interface ReadmeState {
  projectName: string
  description: string
  sections: Section[]
  uploadedFileName: string
  uploadedFileUrl: string
}


const ReadmeContext = createContext<ReadmeContextType | undefined>(undefined)

interface ReadmeProviderProps {
  children: ReactNode
}

export function ReadmeProvider({ children }: ReadmeProviderProps) {
  const [readmeState, setReadmeState] = useState<ReadmeState>({
    projectName: '',
    description: '',
    sections: [],
    uploadedFileName: '',
    uploadedFileUrl: ''
  })

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

  const contextValue: ReadmeContextType = {
    readmeState,
    updateReadmeState,
    updateSection,
    addSection,
    removeSection
  }

  return (
    <ReadmeContext.Provider value={contextValue}>
      {children}
    </ReadmeContext.Provider>
  )
}

export function useReadme(): ReadmeContextType {
  const context = useContext(ReadmeContext)
  if (context === undefined) {
    throw new Error('useReadme must be used within a ReadmeProvider')
  }
  return context
}