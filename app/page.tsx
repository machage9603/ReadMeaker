'use client'
// Indicates the use of client-side rendering in this Next.js component.

import { useEffect, useState } from 'react'
// Import React hooks for managing side effects (useEffect) and component state (useState).

import Image from 'next/image'
// Import Next.js's optimized image component for rendering images.

import Link from 'next/link'
// Import Next.js's component for client-side navigation between pages.

import { motion, useAnimation } from 'framer-motion'
// Import the 'motion' component and animation controls from Framer Motion for animations.

import { useInView } from 'react-intersection-observer'
// Import a hook to detect if an element is in the viewport.

import { Button } from '@/app/ui/button'
// Import a custom button component.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card'
// Import custom card components for organizing content.

import { Github, Linkedin, Twitter, ChevronLeft, ChevronRight, Globe } from 'lucide-react'
// Import icon components from the Lucide React library for use in the UI.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu"
// Import dropdown menu components for a language selection dropdown.

const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const controls = useAnimation()
  // Set up animation controls from Framer Motion.

  const [ref, inView] = useInView()
  // Set up a reference to observe the element and track its visibility using Intersection Observer.

  useEffect(() => {
    if (inView) {
      controls.start('visible')
      // Start the animation when the element comes into view.
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      // The element starts as hidden before animating into view.
      transition={{ duration: 0.4 }}
      // Animation transition set to last for 0.4 seconds.
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.95 }
        // Define animation states: visible and hidden with different opacity and scale values.
      }}
    >
      {children}
      // Render the children components within this animated container.
    </motion.div>
  )
}

const FeatureCarousel = ({ features }: { features: { title: string; image: string; description: string }[] }) => {
  const [currentFeature, setCurrentFeature] = useState(0)
  // State to track the current feature being displayed.

  const [isHovering, setIsHovering] = useState(false)
  // State to track whether the user is hovering over the carousel.

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    if (isHovering) {
      interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        // Change the current feature every 2 seconds while hovering.
      }, 2000)
    }
    return () => clearInterval(interval)
    // Clear the interval when the user stops hovering or the component unmounts.
  }, [isHovering, features.length])

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      // Wrapper for the feature carousel with a max width and centered alignment.
      onMouseEnter={() => setIsHovering(true)}
      // Start the feature rotation when the user hovers over the carousel.
      onMouseLeave={() => setIsHovering(false)}
      // Stop the feature rotation when the user stops hovering.
    >
      <div className="overflow-hidden">
        // A container that hides the overflow content to ensure only one feature is visible at a time.
        <motion.div
          className="flex"
          // A flex container for displaying the features horizontally.
          animate={{ x: `${-currentFeature * 100}%` }}
          // Animate the carousel by shifting the current feature into view based on its index.
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          // Use a spring animation for smooth transitions between features.
        >
          {features.map((feature, index) => (
            <Card key={index} className="w-full flex-shrink-0 bg-gray-800 border-gray-700">
              // Render each feature as a card component.
              <CardHeader>
                <CardTitle className="text-green-400">{feature.title}</CardTitle>
                // Display the title of the feature.
              </CardHeader>
              <CardContent>
                <Image
                  src={feature.image}
                  alt={`${feature.title} screenshot`}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4 mx-auto"
                  // Display the feature image with specified dimensions and styling.
                />
                <CardDescription className="text-green-300">{feature.description}</CardDescription>
                // Display the description of the feature.
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-green-400 hover:text-green-300"
        onClick={() => setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)}
        // Button to navigate to the previous feature in the carousel.
      >
        <ChevronLeft className="h-6 w-6" />
        // Left arrow icon for navigation.
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-green-400 hover:text-green-300"
        onClick={() => setCurrentFeature((prev) => (prev + 1) % features.length)}
        // Button to navigate to the next feature in the carousel.
      >
        <ChevronRight className="h-6 w-6" />
        // Right arrow icon for navigation.
      </button>
    </div>
  )
}

export default function LandingPage() {
  const features = [
    {
      title: "Custom adding section feature",
      description: "Add sections to your readme. You can easily add a section with this feature.",
      image: "/AddSection.png?height=200&width=300"
      // Array of feature objects to be displayed in the carousel with title, description, and image.
    },
    {
      title: "Feature 2",
      description: "Description of feature 2. Highlight its unique aspects.",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      title: "Feature 3",
      description: "Description of feature 3. Emphasize its value proposition.",
      image: "/placeholder.svg?height=200&width=300"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen font-mono text-green-400 bg-gray-900">
      // Main layout wrapper with a dark background and green text, using a flex column layout.
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        // Sticky header with a semi-transparent background and border.
        <div className="container flex h-14 items-center justify-between">
          // Flex container for the header content, including the logo, navigation, and language dropdown.
          <Link href="/" className="flex items-center space-x-2">
            // Link to the home page.
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              // Animate the logo when hovered or clicked.
              <Image
                src="/logo.png"
                alt="READMEaker Logo"
                width={32}
                height={32}
                // Logo image.
              />
            </motion.div>
            <span className="font-bold text-xl">READMEaker</span>
            // Text displaying the app name.
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            // Navigation links to different sections of the page.
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link href="#features" className="transition-colors hover:text-green-300">Features</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link href="#about" className="transition-colors hover:text-green-300">About</Link>
            </motion.div>
          </nav>
          <DropdownMenu>
            // Dropdown menu for language selection.
            <DropdownMenuTrigger asChild>
              <motion.button whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-700">
                <Globe className="h-5 w-5" />
                // Globe icon for language selection.
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
              <DropdownMenuItem>中文</DropdownMenuItem>
              <DropdownMenuItem>हिन्दी</DropdownMenuItem>
              // Language options in the dropdown menu.
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-10">
        // Main content area with padding for spacing.
        <FadeInWhenVisible>
          <h1 className="text-5xl font-extrabold text-center leading-tight">Generate Your README in Seconds</h1>
          // Animated heading with bold text, centered on the page.
        </FadeInWhenVisible>
        <p className="text-lg text-center mt-4">A simple tool to create project README files with ease.</p>
        // Subheading describing the purpose of the app.
        <div id="features" className="mt-12">
          <FeatureCarousel features={features} />
          // Feature carousel component displaying the app's features.
        </div>
      </main>
      <footer className="border-t border-gray-700 py-6">
        // Footer section with a top border for separation.
        <div className="container flex justify-between">
          // Flex container for footer content, including social links and copyright.
          <div className="flex space-x-4">
            // Social media icons for GitHub, LinkedIn, and Twitter.
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm">© 2024 READMEaker. All rights reserved.</p>
          // Copyright notice.
        </div>
      </footer>
    </div>
  )
}
