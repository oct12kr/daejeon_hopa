import React from "react";
import Link from "next/link";
import { phoneDisplay, phoneHref, kakaoOpenChatHref } from "@/lib/constants";
import { PhoneIcon, ChatIcon, MenuIcon } from "./Icons";

const floatingActionBaseClass =
  "group flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_12px_28px_rgba(0,0,0,0.38)] backdrop-blur transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#f7d680] focus:ring-offset-2 focus:ring-offset-[#08080a] md:h-16 md:w-16";

export default function FloatingActionButtons() {
  return (
    <aside
      aria-label="빠른 상담 버튼"
      className="fixed bottom-6 right-4 z-[80] flex flex-col gap-3 md:bottom-10 md:right-8"
    >
      <a
        href={phoneHref}
        aria-label="전화 상담 010-5955-6174"
        title="전화 상담 010-5955-6174"
        className={`${floatingActionBaseClass} border-[#a78bfa]/50 bg-[#7c3aed] text-white hover:border-white/70 hover:bg-[#8b5cf6]`}
      >
        <PhoneIcon />
        <span className="sr-only">전화 상담</span>
      </a>
      <a
        href={kakaoOpenChatHref}
        aria-label="카카오톡 오픈채팅 상담"
        title="카카오톡 오픈채팅 상담"
        target="_blank"
        rel="noreferrer"
        className={`${floatingActionBaseClass} border-[#f7d680]/70 bg-[#fee500] text-[#2a2115] hover:border-white/80 hover:bg-[#f7d680]`}
      >
        <ChatIcon />
        <span className="sr-only">카카오톡 오픈채팅 상담</span>
      </a>
      <Link
        href="/#menu-price"
        aria-label="메뉴판 가격 안내"
        title="메뉴판 가격 안내"
        className={`${floatingActionBaseClass} border-[#f7d680]/55 bg-[#111015]/92 text-[#f7d680] hover:border-[#ff5f7a] hover:bg-[#19131a] hover:text-[#ff5f7a]`}
      >
        <MenuIcon />
        <span className="sr-only">메뉴판 가격 안내</span>
      </Link>
    </aside>
  );
}
