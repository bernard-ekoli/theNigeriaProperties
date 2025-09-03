"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col space-y-6 mt-6">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-800">Shepherd Realty</h2>
              <p className="text-xs text-slate-600">Guiding You Home</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link
              href="#"
              className="text-slate-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              Buy
            </Link>
            <Link
              href="#"
              className="text-slate-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              Sell
            </Link>
            <Link
              href="#"
              className="text-slate-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="#testimonials"
              className="text-slate-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="text-slate-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </nav>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm">(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm">pastor@shepherdrealty.com</span>
            </div>
          </div>

          <Link href="/auth" onClick={() => setOpen(false)}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
