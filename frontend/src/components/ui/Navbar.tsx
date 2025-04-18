"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="fixed top-0 w-full bg-red-900 p-4 z-50 flex items-center justify-between">
            <Link href="/">
                <h1 className="text-white text-2xl font-bold">Conversor PDF</h1>
            </Link>
            <div className="ml-auto flex items-center">
                {/* Mobile Menu Icon */}
                <button
                    onClick={toggleMenu}
                    className="text-white text-2xl md:hidden focus:outline-none"
                >
                    <div
                        className={`transition-transform transform duration-300 ${
                            menuOpen ? "rotate-90" : "rotate-0"
                        }`}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </div>
                </button>

                {/* Desktop Button */}
                <div className="hidden md:block">
                    <Button variant="default" asChild className="w-full bg-red-800 items-center justify-start hover:bg-red-700">
                        <Link href="/docx">DOCX para PDF</Link>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Popover */}
            <div
                className={`absolute top-full left-0 w-full bg-red-900 p-4 flex flex-col items-start md:hidden transition-all duration-300 transform ${
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
            >
                <Button variant="default" asChild className="w-full bg-red-800 items-center justify-start hover:bg-red-700">
                    <Link href="/docx">DOCX para PDF</Link>
                </Button>
            </div>
        </nav>
    );
}