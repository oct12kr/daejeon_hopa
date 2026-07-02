"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { phoneHref } from "@/lib/constants";

export const navItems = [
  { href: "/#hero", label: "톰바소개" },
  { href: "/#system", label: "시스템" },
  { href: "/#room", label: "VIP룸" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#guide", label: "이용가이드" },
  { href: "/#location", label: "오시는길" },
  { href: "/#contact", label: "예약문의" },
  { href: "/blog", label: "블로그" }
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {/* 상단 선: open 시 X 왼쪽 대각선으로 회전 */}
      <line
        x1="4" y1="6" x2="20" y2="6"
        className="origin-center transition-all duration-300"
        style={
          open
            ? { transform: "translateY(6px) rotate(45deg)" }
            : { transform: "translateY(0) rotate(0)" }
        }
      />
      {/* 중간 선: open 시 투명 */}
      <line
        x1="4" y1="12" x2="20" y2="12"
        className="transition-opacity duration-200"
        style={{ opacity: open ? 0 : 1 }}
      />
      {/* 하단 선: open 시 X 오른쪽 대각선으로 회전 */}
      <line
        x1="4" y1="18" x2="20" y2="18"
        className="origin-center transition-all duration-300"
        style={
          open
            ? { transform: "translateY(-6px) rotate(-45deg)" }
            : { transform: "translateY(0) rotate(0)" }
        }
      />
    </svg>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 메뉴 열림 시 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-transparent pb-4">
      <nav
        aria-label="대전톰바 주요 메뉴"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"
      >
        {/* 로고 (디자인 참고 텍스트 형태) */}
        <Link href="/" className="flex items-center gap-3">
          {/* 심볼: 왕관 + T */}
          <div className="flex flex-col items-center">
            {/* 왕관 아이콘 */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 mb-[-6px]">
              <path d="M5 16L3 5l5.5 5L12 3l3.5 7L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
            {/* 큰 T 자 */}
            <span 
              className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#fdfbfb] via-[#d4af37] to-[#b38b22]"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.8))" }}
            >
              T
            </span>
          </div>
          {/* 우측 텍스트 */}
          <div className="flex flex-col justify-center">
            <span 
              className="text-2xl md:text-3xl font-black tracking-[0.25em] mr-[-0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#fdfbfb] via-[#d4af37] to-[#b38b22] leading-none block text-center"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.8))" }}
            >
              TOMBA
            </span>
            <div className="w-full flex justify-between text-[#d4af37]/90 mt-[0.35rem] uppercase text-[0.5rem] md:text-[0.6rem] font-semibold">
              {"PREMIUM HOSTBAR".split("").map((char, i) => (
                <span key={i}>{char === " " ? "\u00A0\u00A0" : char}</span>
              ))}
            </div>
          </div>
        </Link>

        {/* PC 가로 메뉴 (md 이상) */}
        <div className="hidden items-center gap-8 lg:gap-12 text-sm font-light text-white/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#d4af37] transition">
              {item.label}
            </Link>
          ))}
        </div>

        {/* 우측: 전화예약 버튼 + 모바일 햄버거 */}
        <div className="flex items-center gap-3">
          <a
            href="tel:01095996174"
            className="rounded-full bg-gradient-to-r from-[#94762c] to-[#b89436] px-6 py-2.5 text-[13px] font-bold tracking-widest text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:from-[#a88632] hover:to-[#cca43d] transition border border-white/20 flex items-center gap-1"
          >
            010-9599-6174 <span className="opacity-70">&rarr;</span>
          </a>

          {/* 햄버거 버튼 (md 미만에서만 표시) */}
          <button
            type="button"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-md border border-white/15 bg-white/[0.06] p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <HamburgerIcon open={isOpen} />
          </button>
        </div>
      </nav>

      {/* ───── 모바일 드롭다운 메뉴 (md 미만) ───── */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 bg-[#0a0a0e]/95 backdrop-blur-xl px-5 pb-6 pt-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item, idx) => (
              <li
                key={item.href}
                className="transition-all duration-300"
                style={{
                  transitionDelay: isOpen ? `${idx * 40}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(-8px)"
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-lg px-4 py-3 text-base font-bold text-white/80 transition-colors hover:bg-white/[0.06] hover:text-[#ff5f7a] active:bg-white/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 모바일 메뉴 하단 전화 예약 */}
          <a
            href={phoneHref}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff5f7a] px-6 py-3.5 text-base font-black text-white shadow-[0_0_24px_rgba(255,95,122,0.35)] transition hover:bg-[#e44b65]"
          >
            📞 전화 예약하기
          </a>
        </div>
      </div>
    </header>
  );
}
