import Link from "next/link";

const footerLinks = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
];

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="font-heading text-3xl font-bold tracking-tight"
                        >
                            Kreaten<span className="text-accent">Vibe</span>
                        </Link>

                        <p className="mt-5 font-sans text-sm leading-6 text-white/60">
                            KreatenVibe builds custom business software, websites, CRM
                            systems, and automation for growing businesses.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="shrink-0">
                        <Link
                            href="#contact"
                            className="inline-flex rounded-full bg-accent px-6 py-3 font-sans text-sm font-semibold text-white"
                        >
                            Start Your Project
                        </Link>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-3 font-sans text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} KreatenVibe. All rights reserved.</p>

                    <p>Custom software for growing businesses.</p>
                </div>
            </div>
        </footer>
    );
}