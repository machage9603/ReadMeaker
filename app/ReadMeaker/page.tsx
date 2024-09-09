'use client'

import { useState, useRef } from 'react'
import { useReadme } from '@/app/ReadMeaker/ReadmeContext'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Textarea } from '@/app/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/ui/tabs'
import { PlusCircle, Trash2, Upload, Copy, Download } from 'lucide-react'
import { useToast } from "@/app/ui/use-toast"


export default function ReadmeGenerator() {
  const { readmeState, updateReadmeState, updateSection, addSection, removeSection } = useReadme()
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleAddSection = () => {
    if (newSectionTitle) {
      addSection(newSectionTitle)
      setNewSectionTitle('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      updateReadmeState({
        uploadedFileName: file.name,
        uploadedFileUrl: URL.createObjectURL(file)
      })
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const copyToClipboard = () => {
    const content = generateReadmeContent()
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied!",
        description: "README content copied to clipboard.",
      })
    })
  }

  const downloadReadme = () => {
    const content = generateReadmeContent()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReadmeContent = () => {
    let content = `# ${readmeState.projectName}\n\n${readmeState.description}\n\n`
    if (readmeState.uploadedFileName) {
      content += `![${readmeState.uploadedFileName}](${readmeState.uploadedFileUrl})\n\n`
    }
    readmeState.sections.forEach(section => {
      content += `## ${section.title}\n\n${section.content}\n\n`
    })
    return content
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
                <div>
                  <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                    Upload File (Image, GIF, etc.)
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.gif"
                  />
                  <Button onClick={triggerFileUpload} className="mt-2">
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                  </Button>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      Uploaded: {uploadedFile.name}
                    </p>
                  )}
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
              <div className="flex justify-end space-x-2 mb-4">
                <Button onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button onClick={downloadReadme}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
              <h1>{readmeState.projectName}</h1>
              <p>{readmeState.description}</p>
              {readmeState.uploadedFileUrl && (
                <img
                  src={readmeState.uploadedFileUrl}
                  alt={readmeState.uploadedFileName || "Uploaded file"}
                  className="max-w-full h-auto"
                />
              )}
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