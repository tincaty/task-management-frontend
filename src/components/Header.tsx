import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logo } from "@/assets/images";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Facilities", to: "/gallery" },
  { label: "Admission", to: "/admission" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Professional header styling for education platform
  const headerBg =
    scrolled || !isHome
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      : "bg-white/90 backdrop-blur-sm";

  const textColor = "text-gray-700";
  const logoTextColor = "text-gray-900";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Tumaini Jipya Admission System Logo"
            className="h-10 w-auto md:h-12 object-contain"
          />
          <div className="flex flex-col items-start">
            <span
              className={`text-base md:text-lg font-bold transition-colors ${logoTextColor} leading-tight`}
            >
              Tumaini Jipya
            </span>
            <span className="text-blue-600 text-xs font-medium hidden sm:block">
              Admission System
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === link.to ? "text-blue-600" : textColor
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+255740623188"
            className={`flex items-center gap-1 text-sm ${textColor} hover:text-blue-600 transition-colors`}
          >
            <Phone className="h-4 w-4" />
            +255740623188
          </a>
          <Link to="/admission">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-md transition-colors">
              Apply Now
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm px-5 py-2 rounded-md transition-colors"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden p-2 ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in shadow-lg">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium py-2 transition-colors hover:text-blue-600 ${
                  location.pathname === link.to
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/admission">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Apply Now
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full"
                >
                  Login
                </Button>
              </Link>
              <a
                href="tel:+255740623188"
                className="flex items-center justify-center gap-2 text-gray-600 py-2"
              >
                <Phone className="h-4 w-4" />
                +255740623188
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
