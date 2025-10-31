"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { tools } from "@/lib/tools";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              工具箱
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden sm:flex sm:gap-1">
              {tools.map((section) => (
                <NavigationMenu key={section.name}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>{section.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-1 p-2">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                      pathname === item.href && "bg-accent"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        {item.name}
                                      </span>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* 桌面端反馈按钮 */}
            <div className="hidden sm:block">
              <Link
                href="https://www.sunai.net/t/topic/364"
                target="_blank"
              >
                <Button variant="default" size="sm" className="font-medium">
                  留言反馈
                </Button>
              </Link>
            </div>

            {/* 移动端菜单 */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>工具箱</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {tools.map((section) => (
                    <div key={section.name}>
                      <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
                        {section.name}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent",
                                pathname === item.href && "bg-accent"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <Link
                      href="https://www.sunai.net/t/topic/364"
                      target="_blank"
                      onClick={() => setOpen(false)}
                    >
                      <Button variant="default" className="w-full font-medium">
                        留言反馈
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
} 