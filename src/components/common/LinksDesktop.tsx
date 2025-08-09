"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { cn } from "@/libs/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function LinksDesktop() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Show admin navigation if user is admin */}
        {isAdmin ? (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-blue-400 hover:text-blue-300">
              Admin Panel
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="col-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-br from-blue-600 to-blue-800 text-white focus:shadow-md"
                      href="/admin"
                    >
                      <div className="mt-4 mb-1 text-sm font-medium">
                        ADMIN DASHBOARD
                      </div>
                      <p className="text-sm leading-tight text-blue-100">
                        Manage your Vachetta platform with comprehensive admin tools.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/admin/products" title="PRODUCTS">
                  Manage leather product catalog, inventory, and pricing.
                </ListItem>
                <ListItem href="/admin/orders" title="ORDERS">
                  Track and manage customer orders and fulfillment.
                </ListItem>
                <ListItem href="/admin/customers" title="CUSTOMERS">
                  View and manage customer accounts and profiles.
                </ListItem>
                <ListItem href="/admin/suppliers" title="SUPPLIERS">
                  Manage supplier relationships and procurement.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          /* Regular customer navigation */
          <>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none from-muted/50 to-muted focus:shadow-md bg-center bg-[url('/main-image.webp')]"
                        href="/"
                      >
                        <div className="mt-4 mb-1 text-sm font-medium">
                          VIEW ALL
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover wardrobe staples for every occasion.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/bags" title="BAGS">
                    Premium leather bags crafted with attention to detail.
                    From briefcases to casual totes, find your perfect carry.
                  </ListItem>
                  <ListItem href="/wallets" title="WALLETS">
                    Explore essential wallets in various styles and leather finishes.
                    Classic bi-folds to modern minimalist designs.
                  </ListItem>
                  <ListItem href="/accessories" title="ACCESSORIES">
                    Complete your look with our premium leather accessories
                    and belts.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:bg-[#1F1F1F]",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-[]">
            {title}
          </div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground text-[#A1A1A1]">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
