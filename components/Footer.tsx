import React from "react";
import { businessName, area, detailAddress, phoneDisplay } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 py-8 text-sm leading-7 text-white/60">
      <div className="mx-auto max-w-7xl">
        <p className="font-black text-white">
          {businessName} | 예약 및 이용 안내
        </p>
        <p>
          사업자 정보: 입력 예정 · 주소: {area} {detailAddress} · 전화: {phoneDisplay}
        </p>
        <p>
          대전호빠를 찾는 분들을 위한 예약 안내, 이용 방법, 방문 가이드를 대전톰바가 제공합니다.
          유성구 봉명동 프리미엄 라운지에서 고객 상담부터 예약 문의까지 안내해 드립니다.
        </p>
      </div>
    </footer>
  );
}
