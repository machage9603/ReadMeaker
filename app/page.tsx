'use client'

import { useState } from 'react'
import { useReadme } from './ReadmeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, Trash2 } from 'lucide-react'

export default function ReadmeGenerator() {
  const { readmeState, updateReadmeState, updateSection, addSection, removeSection } = useReadme()
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const handleAddSection = () => {
    if (newSectionTitle) {
      addSection(newSectionTitle)
      setNewSectionTitle('')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">README Generator</h1>
      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <Input
                    id="projectName"
                    value={readmeState.projectName}
                    onChange={(e) => updateReadmeState({ projectName: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={readmeState.description}
                    onChange={(e) => updateReadmeState({ description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {readmeState.sections.map((section) => (
            <Card key={section.id} className="mt-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {section.title}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(section.id)}
                    aria-label={`Remove ${section.title} section`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  placeholder={`Enter content for ${section.title}`}
                  rows={5}
                />
              </CardContent>
            </Card>
          ))}

          <div className="mt-4 flex items-center space-x-2">
            <Input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="New section title"
            />
            <Button onClick={handleAddSection}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="prose max-w-none mt-6">
              <h1>{readmeState.projectName}</h1>
              <p>{readmeState.description}</p>
              {readmeState.sections.map((section) => (
                <div key={section.id}>
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}