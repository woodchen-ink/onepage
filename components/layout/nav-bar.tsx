"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { tools } from "@/lib/tools";

export function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                工具箱
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tools.map((section) => (
                <div key={section.name} className="relative group">
                  <button className="h-16 inline-flex items-center px-1 pt-1 text-sm font-medium">
                    {section.name}
                  </button>
                  <div className="absolute left-0 hidden group-hover:block pt-1 w-48 z-50">
                    <div className="bg-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block px-4 py-2 text-sm hover:bg-accent",
                              pathname === item.href ? "bg-accent" : ""
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {tools.map((section) => (
              <div key={section.name}>
                <div className="px-4 py-2 font-medium text-muted-foreground">
                  {section.name}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm hover:bg-accent",
                        pathname === item.href ? "bg-accent" : ""
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 