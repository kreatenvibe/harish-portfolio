import React from "react";
import Link, { LinkProps } from "next/link";

interface HoverLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function HoverLink({
  children,
  className = "",
  external = false,
  href,
  ...props
}: HoverLinkProps) {
  const baseClasses =
    "relative inline-flex items-center gap-1.5 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  const underlineClasses =
    "after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 group-hover:text-white";

  if (external) {
    return (
      <a
        href={href.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${underlineClasses} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${underlineClasses} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
