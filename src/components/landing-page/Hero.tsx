"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setGradientPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const gradientStyle = {
    backgroundImage: `radial-gradient(circle at ${gradientPosition.x * 100}% ${gradientPosition.y * 100}%, #4338ca, #3730a3, #312e81)`,
  }

  return (
    <section
      className="relative min-h-screen py-20 flex items-center justify-center overflow-hidden text-white"
      style={gradientStyle}
    >
      <div className="absolute inset-0 bg-[url('/data-viz-bg.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empowering Data-Driven Insights for Ghana and Beyond
            </h1>
            <h2 className="text-xl md:text-2xl mb-8 text-gray-300">
              Explore datasets, analytics tools, and AI-powered solutions tailored for research, education, and
              innovation. Unlock the potential of data to transform industries and lives.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
              <Button asChild size="lg" className="text-lg text-white">
                <Link href="/datasets">Explore Datasets</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <Image
              src="/images/datasets.png"
              alt="Screenshot"
              width={800}
              height={600}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

