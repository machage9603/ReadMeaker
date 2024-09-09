'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/app/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card'
import { Github, Linkedin, Twitter, ChevronLeft, ChevronRight } from 'lucide-react'

const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.3 }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.95 }
      }}
    >
      {children}
    </motion.div>
  )
}

const FeatureCarousel = ({ features }: { features: { title: string; image: string; description: string }[] }) => {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    if (isHovering) {
      interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length)
      }, 3000) // Change feature every 3 seconds on hover
    }
    return () => clearInterval(interval)
  }, [isHovering, features.length])

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `${-currentFeature * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {features.map((feature, index) => (
            <Card key={index} className="w-full flex-shrink-0">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={feature.image}
                  alt={`${feature.title} screenshot`}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4 mx-auto"
                />
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2"
        onClick={() => setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2"
        onClick={() => setCurrentFeature((prev) => (prev + 1) % features.length)}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

export default function LandingPage() {
  const features = [
    {
      title: "Feature 1",
      description: "Description of feature 1. Explain how it benefits the user.",
      image: "/placeholder.svg?height=200&width=300"
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
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <FadeInWhenVisible>
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden"
                >
                  <Image
                    src="/hero.jpeg?height=100%&width=100%"
                    alt="Project Cover Image"
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                >
                  READMEaker
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                >
                  Generate your professional README files with ease.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button asChild size="lg">
                    <Link href="/ReadMeaker">Get Started</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Key Features
              </h2>
              <FeatureCarousel features={features} />
            </div>
          </section>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <section id="about" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                About the Project
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">Our Inspiration</h3>
                  <p className="text-muted-foreground">
                    This project was born out of a personal experience. [Insert your personal story here]
                    We embarked on this journey as part of our Portfolio Project for Holberton School,
                    but it quickly became much more than an assignment. It became a passion project that
                    we believe can make a real difference.
                  </p>
                  <p className="mt-4">
                    <Link href="https://www.mikemachage.tech" className="text-primary hover:underline">
                      Learn more about Mike
                    </Link>
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">Meet the Mike</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Team Member 1", github: "#", linkedin: "#", twitter: "#" },
                    ].map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center justify-center lg:justify-start space-x-4"
                      >
                        <span className="font-medium">{member.name}</span>
                        <Link href={member.github} className="text-muted-foreground hover:text-foreground">
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                        <Link href={member.linkedin} className="text-muted-foreground hover:text-foreground">
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href={member.twitter} className="text-muted-foreground hover:text-foreground">
                          <Twitter className="h-5 w-5" />
                          <span className="sr-only">Twitter</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Link href="https://github.com/your-username/your-project" className="text-primary hover:underline">
                  View Project on GitHub
                </Link>
              </div>
            </div>
          </section>
        </FadeInWhenVisible>
      </main>

      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 Your Project Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}