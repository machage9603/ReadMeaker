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

const ReadmeContext = createContext<ReadmeContextType | undefined>(undefined)

const initialState: ReadmeState = {
  projectName: '',
  description: '',
  uploadedFileName: '',
  uploadedFileUrl: '',
  sections: []
}

const templateSections = {
  "Features": `## Features

- Easy to use
- Customizable
- Cross-platform compatibility
- Regular updates`,
  "Installation": `## Installation

\`\`\`bash
npm install my-project
cd my-project
npm start
\`\`\``,
  "Contributing": `## Contributing

Contributions are always welcome!

Please adhere to this project's \`code of conduct\`.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request`,
  "Acknowledgements": `## Acknowledgements

- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)`,
  "Authors": `## Authors

- [@yourusername](https://www.github.com/yourusername)

## 🚀 About Me
I'm a full stack developer...`
}

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
      content: templateSections[title as keyof typeof templateSections] || ''
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