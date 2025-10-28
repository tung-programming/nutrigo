"use client"

import Link from "next/link"
import { Mail, Linkedin, Twitter, Github, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-black text-xl">N</span>
                </div>
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                NutriGo
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Decode Your Food, Redefine Your Health. AI-powered nutrition insights for smarter, healthier choices.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, href: "#", color: "hover:text-cyan-400" },
                { Icon: Linkedin, href: "#", color: "hover:text-emerald-400" },
                { Icon: Github, href: "#", color: "hover:text-teal-400" },
                { Icon: Mail, href: "#", color: "hover:text-emerald-400" },
              ].map(({ Icon, href, color }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className={`w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/20 flex items-center justify-center text-slate-400 ${color} hover:border-emerald-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20`}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Security", "Integrations", "API"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Contact", "Support", "Refunds"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 flex items-center gap-2">
            © 2025 NutriGo. Made with <Heart size={14} className="text-emerald-400 fill-emerald-400 animate-pulse" />{" "}
            in India
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
