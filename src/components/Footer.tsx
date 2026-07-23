import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  GraduationCap,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="container mx-auto px-4 max-w-7xl py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">
            Tumaini Jipya
            <br />
            <span className="text-blue-400 text-lg font-medium">Admission System</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            A digital solution for modern college admission management. 
            Streamlining applications, tracking progress, and enhancing 
            communication between students and institutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-400">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Programs", to: "/programs" },
              { label: "Gallery", to: "/gallery" },
              { label: "Contact", to: "/contact" },
              { label: "Apply Now", to: "/apply" },
              { label: "Login", to: "/login" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Programs / Resources */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-400">
            Programs
          </h4>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link to="/programs/computer-science" className="hover:text-blue-400 transition-colors">
              Computer Science
            </Link>
            <Link to="/programs/business-administration" className="hover:text-blue-400 transition-colors">
              Business Administration
            </Link>
            <Link to="/programs/engineering" className="hover:text-blue-400 transition-colors">
              Engineering
            </Link>
            <Link to="/programs/design" className="hover:text-blue-400 transition-colors">
              Design & Innovation
            </Link>
            <Link to="/programs/healthcare" className="hover:text-blue-400 transition-colors">
              Healthcare Sciences
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-400">
            Contact Us
          </h4>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <span className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
              Clock Tower, Arusha, Tanzania
            </span>
            <a
              href="tel:+255740623188"
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Phone className="h-4 w-4 text-blue-400" />
              +255 740 623 188
            </a>
            <a
              href="mailto:admissions@tumainijipya.edu"
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Mail className="h-4 w-4 text-blue-400" />
              admissions@tumainijipya.edu
            </a>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.instagram.com/beyond_the_world2025?igsh=MWt6aHBncmV2c2lqbA=="
                aria-label="Instagram"
                className="hover:text-blue-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1CGLCShHjp/tiktok.com/@beyondtheworldsafaris1"
                aria-label="Facebook"
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Support Section */}
      <div className="border-t border-gray-800 mt-12 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Support Hours</p>
              <p className="text-xs text-gray-400">Mon-Fri: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Application Deadlines</p>
              <p className="text-xs text-gray-400">Fall: Aug 31 | Spring: Dec 31</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Student Support</p>
              <p className="text-xs text-gray-400">24/7 Online Help Desk</p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Tumaini Jipya Admission System. All rights reserved.</p>
          <p className="mt-2 text-xs">
            A digital solution for modern college admission management
          </p>
        </div>
        
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <a
              href="https://thomas-robert.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Developed by Tincaty dev
            </a>
          </Button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;