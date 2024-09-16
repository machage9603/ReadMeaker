"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReadme } from "./ReadmeContext";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Textarea } from "@/app/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import {
  PlusCircle,
  Trash2,
  Upload,
  Copy,
  Download,
  Globe,
  RotateCcw,
  Coffee,
  X,
  FileText,
} from "lucide-react";
import { useToast } from "@/app/ui/use-toast";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

const DynamicMotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);
const DynamicMotionButton = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.button),
  { ssr: false }
);

// Initialize the Google Generative AI client
let genAI: any = null;
let aiModelPromise: Promise<any> = Promise.resolve(null);

if (typeof window !== "undefined") {
  aiModelPromise = import("@google/generative-ai").then(
    (GoogleGenerativeAI) => {
      genAI = new GoogleGenerativeAI.GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
      );
      return genAI; // Return the initialized genAI object
    }
  );
}

const templateSections = {
  Features: `## Features

- Easy to use
- Customizable
- Cross-platform compatibility
- Regular updates`,
  Installation: `## Installation

\`\`\`bash
npm install my-project
cd my-project
npm start
\`\`\``,
  Contributing: `## Contributing

Contributions are always welcome!

Please adhere to this project's \`code of conduct\`.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request`,
  Acknowledgements: `## Acknowledgements

- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)`,
  Authors: `## Authors

- [@yourusername](https://www.github.com/yourusername)

## 🚀 About Me
I'm a full stack developer...`,
};

export default function ReadmeGenerator() {
  const {
    readmeState,
    updateReadmeState,
    updateSection,
    addSection,
    removeSection,
    resetReadme,
  } = useReadme();
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddSection = (title: string) => {
    if (title) {
      addSection(title);
      setNewSectionTitle("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      updateReadmeState({
        uploadedFileName: file.name,
        uploadedFileUrl: URL.createObjectURL(file),
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetUploadedImage = () => {
    setUploadedFile(null);
    updateReadmeState({
      uploadedFileName: "",
      uploadedFileUrl: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = () => {
    const content = generateReadmeContent();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        toast({
          title: "Copied!",
          description: "README content copied to clipboard.",
        });
      });
    }
  };

  const downloadReadme = () => {
    const content = generateReadmeContent();
    if (typeof window !== "undefined") {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const generateReadmeContent = () => {
    let content = `# ${readmeState.projectName}\n\n${readmeState.description}\n\n`;
    if (readmeState.uploadedFileName) {
      content += `![${readmeState.uploadedFileName}](${readmeState.uploadedFileUrl})\n\n`;
    }
    readmeState.sections.forEach((section) => {
      content += `${section.content}\n\n`;
    });
    return content;
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const genAI = await aiModelPromise;
      if (!genAI) {
        throw new Error("AI model not initialized");
      }
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a README description for a project with the following details: ${aiPrompt}. The description should be concise, informative, and follow best practices for README files.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        updateReadmeState({ description: text });
        toast({
          title: "Success",
          description:
            "AI-generated content has been added to the description.",
        });
      } else {
        throw new Error("No content generated");
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "ai") {
      resetReadme();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen font-mono text-green-400 bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-green-600">READMEaker</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto w-4/5">
          <h1 className="text-3xl font-bold mb-6 text-center">
            README Generator
          </h1>
          <div className="flex justify-center mb-4 space-x-4">
            <Button
              onClick={() => handleTabChange("edit")}
              className={`${
                activeTab === "edit" ? "bg-green-500 text-black" : "bg-gray-700"
              } hover:bg-green-400`}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleTabChange("ai")}
              className={`${
                activeTab === "ai" ? "bg-purple-500 text-black" : "bg-gray-700"
              } hover:bg-purple-400`}
            >
              AI
            </Button>
            <Button
              onClick={() => handleTabChange("preview")}
              className={`${
                activeTab === "preview"
                  ? "bg-blue-500 text-black"
                  : "bg-gray-700"
              } hover:bg-blue-400`}
            >
              Preview
            </Button>
            <Button variant="outline" onClick={resetReadme}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {activeTab === "edit" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      Template Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.keys(templateSections).map((section) => (
                        <Button
                          key={section}
                          onClick={() => handleAddSection(section)}
                          className="w-full bg-gray-700 text-green-400 hover:bg-gray-600"
                        >
                          {section}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-1">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="projectName"
                          className="block text-sm font-medium text-green-400"
                        >
                          Project Name
                        </label>
                        <Input
                          id="projectName"
                          value={readmeState.projectName}
                          onChange={(e) =>
                            updateReadmeState({ projectName: e.target.value })
                          }
                          placeholder="Enter project name"
                          className="bg-gray-700 text-green-400 border-gray-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-green-400"
                        >
                          Description
                        </label>
                        <Textarea
                          id="description"
                          value={readmeState.description}
                          onChange={(e) =>
                            updateReadmeState({ description: e.target.value })
                          }
                          placeholder="Enter project description"
                          rows={3}
                          className="bg-gray-700 text-green-400 border-gray-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="fileUpload"
                          className="block text-sm font-medium text-green-400"
                        >
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
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={triggerFileUpload}
                            className="mt-2 bg-green-500 text-black hover:bg-green-400"
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload File
                          </Button>
                          {uploadedFile && (
                            <Button
                              onClick={resetUploadedImage}
                              className="mt-2 bg-red-500 text-black hover:bg-red-400"
                            >
                              <X className="mr-2 h-4 w-4" /> Reset Image
                            </Button>
                          )}
                        </div>
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
                  <Card
                    key={section.id}
                    className="mt-4 bg-gray-800 border-gray-700"
                  >
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
                        onChange={(e) =>
                          updateSection(section.id, e.target.value)
                        }
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
                  <Button
                    onClick={() => handleAddSection(newSectionTitle)}
                    className="bg-green-500 text-black hover:bg-green-400"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </div>
              </div>
              <div className="col-span-1">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      Real-time Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {generateReadmeContent()}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    AI-Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="aiPrompt"
                        className="block text-sm font-medium text-green-400"
                      >
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
                      className="bg-purple-500 text-black hover:bg-purple-400"
                    >
                      {isGenerating ? "Generating..." : "Generate AI Content"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Real-time Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {generateReadmeContent()}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "preview" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="mt-6">
                <div className="flex justify-end space-x-2 mb-4">
                  <Button
                    onClick={copyToClipboard}
                    className="bg-green-500 text-black hover:bg-green-400"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button
                    onClick={downloadReadme}
                    className="bg-blue-500 text-black hover:bg-blue-400"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
                <pre className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                  <code className="text-green-400 whitespace-pre-wrap">
                    {generateReadmeContent()}
                  </code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="w-full py-6 bg-gray-800">
        <div className="container px-4 md:px-6 flex justify-between items-center">
          <p className="text-center text-sm text-green-400">
            © 2024 READMEaker. All rights reserved.
          </p>
          <a
            href="https://www.buymeacoffee.com/machage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
          >
            <Coffee className="h-5 w-5" />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
