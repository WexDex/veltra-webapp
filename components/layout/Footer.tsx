import Link from "next/link";
import VeltraLogo from "@/components/ui/VeltraLogo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <VeltraLogo size={20} />
          <span className="text-gray-400 text-sm font-medium">Veltra</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/catalogue"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/about"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Contact
          </Link>
        </nav>
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Veltra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
