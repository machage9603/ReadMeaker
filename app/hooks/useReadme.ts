// app/hooks/useReadme.ts
import { useState } from 'react';

type Section = {
    id: number;
    title: string;
    content: string;
};

type ReadmeState = {
    projectName: string;
    description: string;
    sections: Section[];
};

export function useReadme() {
    // Initialize the state with empty values
    const [readmeState, setReadmeState] = useState<ReadmeState>({
        projectName: '',
        description: '',
        sections: [],
    });

    // Function to update the entire state or parts of it
    const updateReadmeState = (newState: Partial<ReadmeState>) => {
        setReadmeState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    // Function to add a new section
    const addSection = (title: string) => {
        setReadmeState((prevState) => ({
            ...prevState,
            sections: [
                ...prevState.sections,
                { id: Date.now(), title, content: '' }, // Using Date.now() to generate a unique id
            ],
        }));
    };

    // Function to remove a section by ID
    const removeSection = (id: number) => {
        setReadmeState((prevState) => ({
            ...prevState,
            sections: prevState.sections.filter((section) => section.id !== id),
        }));
    };

    // Function to update the content of a section by ID
    const updateSection = (id: number, content: string) => {
        setReadmeState((prevState) => ({
            ...prevState,
            sections: prevState.sections.map((section) =>
                section.id === id ? { ...section, content } : section
            ),
        }));
    };

    return {
        readmeState,
        updateReadmeState,
        addSection,
        removeSection,
        updateSection,
    };
}
