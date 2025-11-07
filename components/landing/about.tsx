"use client"

import { Sparkles, Target, Heart, Zap, Users, Award } from "lucide-react"
import Image from "next/image"

const values = [
  {
    icon: Sparkles,
    title: "Transparency First",
    description: "Clear, honest insights that empower smarter food choices without confusing jargon.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Heart,
    title: "Health Empowerment",
    description: "Helping every Indian take control of their nutrition journey, one scan at a time.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Zap,
    title: "AI Innovation",
    description: "Continuously enhancing our technology to deliver accurate, personalized nutrition insights.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Award,
    title: "Accessibility",
    description: "Making nutrition knowledge available to everyone, regardless of their background.",
    color: "from-purple-400 to-violet-500",
  },
]

const team = [
  {
    name: "ARJUN BHAT",
    role: "Frontend Developer",
    skills: "React & TailwindCSS",
    image: "/team/AR.png",
    color: "from-blue-400 to-cyan-500",
  },
  {
    name: "PRANAV RAO K",
    role: "Frontend Developer",
    skills: "React & Next.js",
    image: "/team/PR.png",
    color: "from-purple-400 to-violet-500",
    
  },
  {
    name: "TUSHAR P",
    role: "Backend Developer",
    skills: "API & Database Management",
    image: "/team/TU.png",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "AMOGHA K A",
    role: "Backend Developer",
    skills: "Node.js & Authentication",
    image: "/team/AM.jpg",
    color: "from-emerald-400 to-teal-500",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section - Added scroll-mt-24 and id="about" */}
      <section id="about" className="scroll-mt-24 relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-xl">
              <Sparkles size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">About NutriGo</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black">
              <span className="text-white">Transforming </span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Food Transparency
              </span>
              <span className="text-white">in India</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              In a world where food labels confuse more than they clarify, NutriGo brings clarity. We're India's AI-powered nutrition companion, making every food choice an informed one.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full">
                <Target size={14} className="text-teal-400" />
                <span className="text-xs font-semibold text-teal-400">Our Story</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Why We're Building NutriGo
              </h2>

              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  We started NutriGo with a simple observation: <span className="text-emerald-400 font-semibold">navigating food labels in India is unnecessarily complicated</span>. Hidden sugars, confusing additives, and misleading claims make it nearly impossible for the average person to understand what they're really eating.
                </p>
                <p>
                  With <span className="text-white font-semibold">101 million Indians living with diabetes</span> and childhood obesity rates rising, we knew something had to change. Technology has transformed how we shop, travel, and communicate — why not how we understand food?
                </p>
                <p>
                  NutriGo was born from the belief that <span className="text-emerald-400 font-semibold">everyone deserves to know what's in their food</span>, without needing a nutrition degree to figure it out.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-3xl blur-3xl"></div>
              <div className="relative p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        To democratize nutrition knowledge through AI-powered technology, empowering every Indian to make informed food choices that improve their health and well-being.
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        A future where food transparency is the norm, not the exception. Where every Indian has instant access to clear, reliable nutrition information that helps them live healthier lives.
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Our Impact</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Join 72,000+ users already making smarter food choices. Together, we're building a healthier India, one scan at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-black">
              <span className="text-white">Our </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we build and every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
              <Users size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">The Dream Team</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black">
              <span className="text-white">Meet Our </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Development Team
              </span>
            </h2>

            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              A dedicated team of innovators building the future of food transparency in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}
                ></div>

                {/* Card */}
                <div className="relative h-full rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20`}></div>
                    {/* Replace with actual Image component when you have images */}
                    <div className={`w-full h-full bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                      <span className="text-6xl">👤</span>
                    </div>
                    
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6 text-center space-y-3">
                    <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-300 font-semibold">
                      {member.role}
                    </p>
                    <div className={`inline-flex px-3 py-1.5 rounded-full bg-gradient-to-r ${member.color} bg-opacity-20 border border-emerald-500/20`}>
                      <span className="text-xs font-semibold text-white">
                        {member.skills}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
