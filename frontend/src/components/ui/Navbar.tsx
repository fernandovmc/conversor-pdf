"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-red-900 p-4 z-50 flex items-center justify-between">
            
            <Link href="/"><h1 className="text-white text-2xl font-bold">Conversor PDF</h1></Link>
            <div className="ml-auto">
                <Button variant="default" asChild className="bg-black">
                    <Link href="/docx">
                        DOCX para PDF
                    </Link>
                </Button>
            </div>
        </nav>
    );
};
