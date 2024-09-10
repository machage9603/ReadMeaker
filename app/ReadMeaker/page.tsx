'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useReadme } from '@/app/ReadMeaker/ReadmeContext'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Textarea } from '@/app/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/ui/tabs'
import { PlusCircle, Trash2, Upload, Copy, Download, Globe, RotateCcw } from 'lucide-react'
import { useToast } from "@/app/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu"
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function ReadmeGenerator() {
  const { readmeState, updateReadmeState, updateSection, addSection, removeSection, resetReadme } = useReadme()
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
    <div className="flex flex-col min-h-screen font-mono text-green-400 bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src="/logo.png"
                alt="READMEaker Logo"
                width={32}
                height={32}
              />
            </motion.div>
            <span className="font-bold text-xl">READMEaker</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700"
              >
                <Globe className="h-5 w-5" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
              <DropdownMenuItem>中文</DropdownMenuItem>
              <DropdownMenuItem>हिन्दी</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto w-4/5">
          <h1 className="text-3xl font-bold mb-6 text-center">README Generator</h1>
          <Tabs defaultValue="edit">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <Button variant="outline" className="ml-2" onClick={resetReadme}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            <TabsContent value="edit">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium text-green-400">
                        Project Name
                      </label>
                      <Input
                        id="projectName"
                        value={readmeState.projectName}
                        onChange={(e) => updateReadmeState({ projectName: e.target.value })}
                        placeholder="Enter project name"
                        className="bg-gray-700 text-green-400 border-gray-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-green-400">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={readmeState.description}
                        onChange={(e) => updateReadmeState({ description: e.target.value })}
                        placeholder="Enter project description"
                        rows={3}
                        className="bg-gray-700 text-green-400 border-gray-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="fileUpload" className="block text-sm font-medium text-green-400">
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
                      <Button onClick={triggerFileUpload} className="mt-2 bg-green-500 text-black hover:bg-green-400">
                        <Upload className="mr-2 h-4 w-4" /> Upload File
                      </Button>
                      {uploadedFile && (
                        <p className="mt-2 text-sm text-green-400">
                          Uploaded: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {readmeState.sections.map((section) => (
                <Card key={section.id} className="mt-4 bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-green-400">
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
                      className="bg-gray-700 text-green-400 border-gray-600"
                    />
                  </CardContent>
                </Card>
              ))}

              <div className="mt-4 flex items-center space-x-2">
                <Input
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="New section title"
                  className="bg-gray-700 text-green-400 border-gray-600"
                />
                <Button onClick={handleAddSection} className="bg-green-500 text-black hover:bg-green-400">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="prose prose-invert max-w-none mt-6 text-green-400">
                  <div className="flex justify-end space-x-2 mb-4">
                    <Button onClick={copyToClipboard} className="bg-green-500 text-black hover:bg-green-400">
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button onClick={downloadReadme} className="bg-green-500 text-black hover:bg-green-400">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  <ReactMarkdown>{generateReadmeContent()}</ReactMarkdown>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="w-full py-6 bg-gray-800">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-green-400">
            © 2024 READMEaker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}