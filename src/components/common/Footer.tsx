"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
  const linkStyles = "text-sm transition duration-150 ease hover:text-white";
  const liStyles = "text-[#A1A1A1] my-1.5";

  return (
    <footer className="px-6 py-24 border-t border-solid pointer-events-auto bg-[#0A0A0A] border-[#242424]">
      <nav className="flex flex-wrap justify-around gap-5 mx-auto max-w-screen-2xl">
        <div className="flex flex-col items-center justify-center w-full max-w-xs gap-5">
          <div className="flex flex-col items-center gap-3">
            <div className="text-2xl font-bold text-white">VACHETTA</div>
            <span className="text-sm text-[#A1A1A1]">
              Artisanal Leather Goods
            </span>
            <span className="flex items-center text-sm text-[#A1A1A1]">
              © 2024 Vachetta. All rights reserved.
            </span>
          </div>
          <div className="flex gap-3.5">
            <Link
              href="/instagram"
              target="_blank"
              title="Follow us on Instagram"
              className="text-[#A1A1A1] hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Link>
            <Link
              href="/facebook"
              target="_blank"
              title="Follow us on Facebook"
              className="text-[#A1A1A1] hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            <Link
              href="/pinterest"
              target="_blank"
              title="Follow us on Pinterest"
              className="text-[#A1A1A1] hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .359.159.359.438 0 .219-.139.578-.219.937-.199.797.399 1.437 1.187 1.437 1.406 0 2.593-1.437 2.593-3.557 0-1.854-1.348-3.192-3.236-3.192-2.273 0-3.659 1.677-3.659 3.511 0 .697.259 1.437.599 1.836.06.078.06.139.04.219-.04.179-.139.578-.179.737-.04.099-.139.139-.239.099-1.307-.598-2.093-2.513-2.093-4.047 0-2.473 1.786-4.725 5.162-4.725 2.713 0 4.82 1.916 4.82 4.486 0 2.672-1.687 4.825-4.02 4.825-.797 0-1.547-.418-1.806-.918 0 0-.399 1.518-.498 1.898-.179.698-.658 1.577-1.008 2.114.757.219 1.554.359 2.393.359 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638.001 12.017.001z"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">Products</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/bags`}
                className={linkStyles}
              >
                Bags
              </Link>
            </li>
            <li className={liStyles}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/wallets`}
                className={linkStyles}
              >
                Wallets
              </Link>
            </li>
            <li className={liStyles}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/belts`}
                className={linkStyles}
              >
                Belts
              </Link>
            </li>
            <li className={liStyles}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/accessories`}
                className={linkStyles}
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">Customer Service</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link href="/size-guide" className={linkStyles}>
                Size guide
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/delivery" className={linkStyles}>
                Delivery
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/returns" className={linkStyles}>
                Returns & refunds
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/care-guide" className={linkStyles}>
                Leather care
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">About Vachetta</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link href="/about" className={linkStyles}>
                Our story
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/craftsmanship" className={linkStyles}>
                Craftsmanship
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/sustainability" className={linkStyles}>
                Sustainability
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/contact" className={linkStyles}>
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </footer>
  );
};
