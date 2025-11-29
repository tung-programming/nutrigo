"use client"


import Link from "next/link"
import { Mail, Linkedin, Twitter, Github, Heart } from "lucide-react"
import Image from "next/image"


export default function Footer() {
  return (
    <footer className="relative bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/logo.png"
                  alt="NutriGo Logo"
                  width={180}
                  height={180}
                  className="relative transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-base">
              Decode Your Packaged Foods, Redefine Your Health. AI-powered nutrition insights for smarter, healthier choices.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, href: "#", color: "hover:text-cyan-400", bgColor: "hover:bg-cyan-500/10" },
                { Icon: Linkedin, href: "#", color: "hover:text-emerald-400", bgColor: "hover:bg-emerald-500/10" },
                { Icon: Github, href: "#", color: "hover:text-teal-400", bgColor: "hover:bg-teal-500/10" },
                { Icon: Mail, href: "#", color: "hover:text-emerald-400", bgColor: "hover:bg-emerald-500/10" },
              ].map(({ Icon, href, color, bgColor }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className={`w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center text-slate-400 ${color} ${bgColor} hover:border-emerald-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/20`}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>


          {/* Product */}
          <div className="space-y-5">
            <h4 className="font-black text-white text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Product
            </h4>
            <ul className="space-y-4">
              {["Features", "Pricing", "Security", "Integrations", "API"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Company */}
          <div className="space-y-5">
            <h4 className="font-black text-white text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="space-y-4">
              {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Legal */}
          <div className="space-y-5">
            <h4 className="font-black text-white text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Legal
            </h4>
            <ul className="space-y-4">
              {["Privacy", "Terms", "Contact", "Support", "Refunds"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-10 border-t border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-base text-slate-400 flex items-center gap-2">
            © 2025 NutriGo. Made with <Heart size={16} className="text-emerald-400 fill-emerald-400 animate-pulse" />{" "}
            in India
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
