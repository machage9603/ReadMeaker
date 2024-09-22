"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/app/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  FileText,
  Sparkles,
  Download,
} from "lucide-react";

const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

const ParallaxText = ({ children }: { children: React.ReactNode }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return <motion.div style={{ y }}>{children}</motion.div>;
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-mono text-green-900 bg-gray-900">
      <motion.header
        className="sticky top-0 z-50 w-full border-b border-green-200 bg-green-50/80 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#features"
                className="text-green-700 hover:text-green-500 transition-colors"
              >
                Features
              </Link>
            </motion.div>
          </nav>
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-green-600">READMEaker</span>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="https://github.com/sponsors/machage9603"
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              Sponsor on GitHub
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1">
        <section className="bg-gradient-to-r from-green-400 to-green-600 text-white py-32">
          <div className="container mx-auto px-4 text-center">
            <ParallaxText>
              <motion.h1
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                We save You Time
              </motion.h1>
            </ParallaxText>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              READMEaker helps you create professional READMEs with speed, ease
              and efficiency.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-green-100 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/ReadMeaker">Get Started</Link>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-32 bg-green-100">
          <div className="container mx-auto px-4">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold text-center mb-16 text-green-800">
                Experience Documentation Excellence
              </h2>
            </FadeInWhenVisible>
            <div className="grid md:grid-cols-3 gap-12">
              <FadeInWhenVisible>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Sparkles className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">
                    AI-Powered Content
                  </h3>
                  <p className="text-green-600">
                    Generate README content using advanced AI technology
                  </p>
                </motion.div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FileText className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">
                    Customizable Sections
                  </h3>
                  <p className="text-green-600">
                    Add, remove, and reorder sections to fit your project needs
                  </p>
                </motion.div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Download className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">
                    Easy Export
                  </h3>
                  <p className="text-green-600">
                    Download your README as a markdown file with one click
                  </p>
                </motion.div>
              </FadeInWhenVisible>
            </div>
            <div className="text-center mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://github.com/machage9603/readmeaker"
                  className="text-green-600 hover:text-green-800 transition-colors text-lg font-semibold"
                >
                  View on GitHub
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-700 mb-4">
            © 2024 READMEaker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
