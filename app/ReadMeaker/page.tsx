'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useReadme } from './ReadmeContext'
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
import dynamic from 'next/dynamic'

const DynamicMotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false })
const DynamicMotionButton = dynamic(() => import('framer-motion').then((mod) => mod.motion.button), { ssr: false })

// Initialize the Google Generative AI client
let genAI: any = null;

if (typeof window !== 'undefined') {
  import('@google/generative-ai').then((GoogleGenerativeAI) => {
    genAI = new GoogleGenerativeAI.GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
  });
}

export default function ReadmeGenerator() {
  const { readmeState, updateReadmeState, updateSection, addSection, removeSection, resetReadme } = useReadme()
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        toast({
          title: "Copied!",
          description: "README content copied to clipboard.",
        })
      })
    }
  }

  const downloadReadme = () => {
    const content = generateReadmeContent()
    if (typeof window !== 'undefined') {
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

  const generateAIContent = async () => {
    setIsGenerating(true)
    try {
      if (!genAI) {
        throw new Error("AI model not initialized");
      }
      // Generate content using the Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a README description for a project with the following details: ${aiPrompt}. The description should be concise, informative, and follow best practices for README files.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        updateReadmeState({ description: text });
        toast({
          title: "Success",
          description: "AI-generated content has been added to the description.",
        });
      } else {
        throw new Error("No content generated");
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen font-mono text-green-400 bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <DynamicMotionDiv
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src="/logo.png"
                alt="READMEaker Logo"
                width={32}
                height={32}
              />
            </DynamicMotionDiv>
            <span className="font-bold text-xl">READMEaker</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DynamicMotionButton
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700"
              >
                <Globe className="h-5 w-5" />
              </DynamicMotionButton>
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
            <div className="flex justify-center mb-4 space-x-4">
              <TabsList className="grid grid-cols-3 gap-4">
                <TabsTrigger
                  value="edit"
                  className="bg-gray-700 hover:bg-gray-600 text-green-400"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-green-400 hover:via-blue-500 hover:to-purple-600 text-black"
                >
                  AI
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="bg-gray-700 hover:bg-gray-600 text-green-400"
                >
                  Preview
                </TabsTrigger>
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
            <TabsContent value="ai">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">AI-Generated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="aiPrompt" className="block text-sm font-medium text-green-400">
                        Describe your project
                      </label>
                      <Textarea
                        id="aiPrompt"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Enter a description of your project for AI-generated content"
                        rows={3}
                        className="bg-gray-700 text-green-400 border-gray-600"
                      />
                    </div>
                    <Button
                      onClick={generateAIContent}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-green-400 hover:via-blue-500 hover:to-purple-600 text-black"
                    >
                      {isGenerating ? 'Generating...' : 'Generate AI Content'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="mt-6 text-green-400">
                  <div className="flex justify-end space-x-2 mb-4">
                    <Button onClick={copyToClipboard} className="bg-green-500 text-black hover:bg-green-400">
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button onClick={downloadReadme} className="bg-green-500 text-black hover:bg-green-400">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {generateReadmeContent()}
                  </pre>
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