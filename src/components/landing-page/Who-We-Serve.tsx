"use client"

import { Button } from "@/components/ui/button"
import { SignUpButton } from "@clerk/nextjs"
import { 
  Microscope, 
  Brain, 
  GraduationCap, 
  LandPlot, 
  Rocket, 
  TrendingUp
 } from "lucide-react"

const audienceGroups = [
  { title: "Researchers", icon: Microscope },
  { title: "Data Scientists", icon: Brain },
  { title: "Educators", icon: GraduationCap },
  { title: "Policy Makers", icon: LandPlot },
  { title: "Entrepreneurs", icon: Rocket },
  { title: "Analysts", icon: TrendingUp },
]

export default function WhoWeServe() {

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Who We Serve</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {audienceGroups.map((group, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <group.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{group.title}</h3>
            </div>
          ))}
        </div>
        <div className="text-center">
          <SignUpButton >
            <Button className="text-white">
              Join Us
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  )
}

