import Image from "next/image";
import {
  businessName,
  area,
  detailAddress,
  phoneDisplay,
  phoneHref,
  kakaoOpenChatHref,
  siteUrl,
  fullAddress,
  mapEmbedSrc,
  mapDirectionsHref
} from "@/lib/constants";
import { PhoneIcon } from "@/components/Icons";

const promises = [
  {
    id: "01",
    icon: "🏷️",
    title: "정직한 가격 안내",
    text: "이용 전 가격과 구성, 시간, 주종 등을 명확하게 안내해드립니다.\n추가 비용 없이 안심하고 이용하실 수 있도록 투명하게 운영합니다."
  },
  {
    id: "02",
    icon: "📅",
    title: "편리한 예약 시스템",
    text: "전화 한 통으로 간편하게 예약 가능합니다.\n원하시는 시간과 인원에 맞춰 최적의 자리를 준비해드립니다."
  },
  {
    id: "03",
    icon: "👑",
    title: "재방문 고객 케어",
    text: "방문 기록과 취향을 바탕으로 더 나은 서비스와 혜택을 제공합니다.\n언제 방문하셔도 기억되는 특별한 경험을 선사합니다."
  }
];

const galleryCaptions = [
  "최고급 가죽 소파와 프라이빗 VIP 룸 세팅",
  "특별한 날을 완성하는 프리미엄 샴페인 라인업",
  "트렌디한 음악과 분위기를 압도하는 감각적인 조명",
  "비즈니스 모임과 단체 회식을 위한 대형 VIP 룸 완비"
];

const timeTips = [
  {
    label: "평일 저녁",
    value: "프라이빗 맞춤 상담",
    text: "조용한 분위기에서 세심한 케어를 원하시는 첫 방문 고객님께 추천합니다."
  },
  {
    label: "금요일 22시 전",
    value: "톰바 골든 타임",
    text: "대기 없이 가장 다채로운 초이스와 쾌적한 룸 선택이 가능한 시간대입니다."
  },
  {
    label: "주말 피크타임",
    value: "유진실장 직통 예약",
    text: "인원수와 원하시는 분위기를 미리 말씀해 주시면 완벽한 세팅을 준비해 드립니다."
  }
];

const faqs = [
  {
    q: "대전호빠 톰바 룸 예약 및 초이스 진행은 어떻게 되나요?",
    a: "담당 유진실장에게 직통 번호로 연락 주시면, 실시간 룸 현황 파악 후 신속하게 최상급 세팅을 준비해 드립니다."
  },
  {
    q: "호빠 방문이 처음인데 시스템 안내가 가능한가요?",
    a: "첫 방문 고객님을 위해 맞춤형 브리핑과 투명한 주류 가격을 사전에 안내해 드리며, 어색함 없이 즐기실 수 있도록 전담 케어해 드립니다."
  },
  {
    q: "1인 혼술이나 단체 회식 방문도 가능한가요?",
    a: "1인 방문을 위한 프라이빗 세팅부터, 대규모 생일파티 및 회식을 완벽히 소화할 수 있는 대형 VIP 룸까지 모두 완비되어 있습니다."
  },
  {
    q: "입장 시 드레스코드 제한이 있나요?",
    a: "엄격한 제한은 없으나, 대전톰바 VIP 라운지의 분위기에 맞는 모던하고 깔끔한 댄디룩을 권장해 드리고 있습니다."
  },
  {
    q: "늦은 시간 당일 방문도 바로 가능한가요?",
    a: "평일 및 주말 모두 당일 방문이 가능합니다. 단, 주말 피크 타임에는 룸이 만실일 수 있으니 출발 전 미리 연락해 주시면 쾌적하게 안내해 드립니다."
  },
  {
    q: "차량 방문 시 주차 및 발렛 서비스가 되나요?",
    a: "도착 전 미리 말씀해 주시면, 봉명동 인근의 안전한 주차 공간 안내 및 발렛 서비스를 신속하게 도와드립니다."
  }
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: businessName,
  alternateName: ["대전톰바", "대전호빠", "유성구호빠", "대전라운지"],
  description:
    "대전광역시 유성구 봉명동 445-13 대전톰바 대전호빠 예약 상담. 가격 안내, 방문 케어, 재방문 고객 관리, 시크릿 가이드 서비스.",
  url: siteUrl,
  image: [
    `${siteUrl}/images/seven%20(1).png`,
    `${siteUrl}/images/seven%20(2).png`,
    `${siteUrl}/images/seven%20(3).png`
  ],
  telephone: phoneDisplay,
  priceRange: "상담 후 안내",
  areaServed: ["대전광역시", "유성구", "봉명동"],
  address: {
    "@type": "PostalAddress",
    streetAddress: detailAddress,
    addressLocality: "유성구 봉명동",
    addressRegion: "대전광역시",
    addressCountry: "KR"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: phoneDisplay,
    contactType: "reservations",
    availableLanguage: ["ko-KR", "Korean"]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a
    }
  }))
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-transparent text-[#fffaf7]">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      <section
        id="hero"
        aria-labelledby="hero-title"
        className="relative isolate min-h-screen pt-20 border-b border-white/5 flex items-center justify-center"
      >
        <Image
          src="/images/tomba (1).png"
          alt="대전 톰바 메인"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        {/* 전체적으로 고급스럽게 어둡게 눌러주는 오버레이 */}
        <div className="absolute inset-0 bg-black/40" />
        {/* 중앙으로 시선을 모으는 비네팅 효과 (Apple 스타일) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,7,0.85)_100%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center flex flex-col items-center">
          
          {/* 상단 작은 Gold Typography */}
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] text-[#d4af37] mb-6">
            Daejeon Premium Host Bar
          </p>
          
          {/* 메인 타이틀 */}
          <h1
            id="hero-title"
            className="text-6xl md:text-[80px] lg:text-[90px] font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl"
          >
            대전 톰바
          </h1>
          
          {/* 서브 타이틀 (Gold) */}
          <p className="mt-8 text-xl md:text-3xl font-light text-[#d4af37] tracking-widest leading-relaxed">
            당신을 위한
            <br />
            프라이빗 프리미엄 공간
          </p>

          {/* 설명 */}
          <p className="mt-6 text-sm md:text-base text-white/60 font-light tracking-wide leading-loose">
            프라이빗한 분위기,
            <br />
            세련된 공간,
            <br />
            그리고 특별한 순간을 경험하세요.
          </p>

          {/* Gold Divider */}
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4af37]/0 via-[#d4af37]/60 to-[#d4af37]/0 my-10" />

          {/* Premium CTA Button & Phone */}
          <a 
            href={phoneHref}
            className="group relative inline-flex flex-col items-center justify-center px-12 py-5 overflow-hidden rounded-full bg-white/5 border border-[#d4af37]/40 backdrop-blur-md transition-all duration-[500ms] hover:bg-[#d4af37]/10 hover:border-[#d4af37] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)]"
          >
            <span className="relative text-xs font-semibold tracking-[0.3em] text-[#d4af37]/80 group-hover:text-white/80 transition-colors duration-[500ms] mb-2">
              유진실장 다이렉트 예약
            </span>
            <span className="relative text-3xl md:text-4xl font-black tracking-wider text-[#d4af37] group-hover:text-white transition-colors duration-[500ms]">
              010.9599.6174
            </span>
          </a>

          {/* 하단 중앙 3 Premium Badges */}
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 opacity-80">
            {[
              "Premium Room",
              "Luxury Service",
              "Private Lounge"
            ].map((badge) => (
              <span key={badge} className="text-[10px] md:text-xs font-light uppercase tracking-[0.3em] text-white/70">
                {badge}
              </span>
            ))}
          </div>

        </div>
      </section>

      <section id="system" className="relative bg-[#050507] py-32 overflow-hidden border-b border-white/5">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            {/* 좌측: 타이틀 영역 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-[#d4af37] to-transparent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
                  Premium Process
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fdfbfb] to-[#a0842a]">Perfect</span><br />
                Experience
              </h2>
              <p className="mt-8 text-base md:text-lg leading-relaxed text-white/50 font-light max-w-md break-keep">
                예약부터 마무리까지, 당신만을 위한 가장 프라이빗하고 섬세한 여정을 선사합니다.
              </p>
            </div>

            {/* 우측: 2x2 카드 그리드 */}
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  step: "01",
                  title: "예약문의",
                  items: ["24시간 문의", "전화 또는 카카오톡 상담", "실시간 예약 가능"],
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                },
                {
                  step: "02",
                  title: "맞춤 안내",
                  items: ["인원 및 방문시간 안내", "예산에 맞는 시스템 설명", "VIP룸 선택 가능"],
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  step: "03",
                  title: "프라이빗 입장",
                  items: ["프라이빗 룸 안내", "전담 실장 응대", "편안한 분위기 제공"],
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  )
                },
                {
                  step: "04",
                  title: "만족스러운 시간",
                  items: ["편안한 서비스", "쾌적한 공간", "마무리까지 친절한 안내"],
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )
                }
              ].map((card, i) => (
                <div 
                  key={card.step}
                  className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-[#d4af37]/30 hover:shadow-[0_16px_48px_rgba(212,175,55,0.08)] flex flex-col justify-between min-h-[280px]"
                >
                  {/* Subtle hover gradient inside card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-[#d4af37] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                      {card.icon}
                    </span>
                    <span className="text-5xl font-black italic text-white/[0.03] group-hover:text-[#d4af37]/10 transition-colors duration-500">
                      {card.step}
                    </span>
                  </div>

                  <div className="relative z-10 mt-8">
                    <h3 className="text-xl font-medium text-white group-hover:text-[#d4af37] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {card.items.map((desc, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-light text-white/50 group-hover:text-white/70 transition-colors duration-300 break-keep">
                          <span className="h-px w-3 bg-[#d4af37]/30 group-hover:w-4 group-hover:bg-[#d4af37] transition-all duration-300" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="room"
        className="relative isolate border-b border-white/5 py-24 min-h-[600px] flex items-center bg-[#050507] overflow-hidden"
      >
        <Image
          src="/images/tomba (3).png"
          alt="대전호빠 대전톰바 VIP 룸"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        {/* 전체적으로 텍스트 가독성을 높여주는 고급스러운 오버레이 */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto w-full max-w-7xl px-5 grid lg:grid-cols-[0.3fr_0.7fr] gap-20 lg:gap-12 items-center">
          
          {/* 좌측 (30%) */}
          <div className="flex flex-col items-start">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
              Premium Lounge
            </p>
            
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#d4af37]/80 to-transparent my-8" />
            
            <p className="text-base md:text-lg text-white/80 font-light tracking-wide leading-loose">
              대전 톰바는
              <br />
              프라이빗한 공간과
              <br />
              품격 있는 서비스를 제공합니다.
            </p>
          </div>

          {/* 우측 (70%) */}
          <div className="flex flex-col lg:items-end lg:text-right mt-10 lg:mt-0">
            <h2 className="text-[70px] md:text-[100px] lg:text-[130px] font-black text-white/95 tracking-tighter leading-none drop-shadow-2xl">
              VIP ROOM
            </h2>
            
            <h3 className="mt-4 md:mt-6 text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.3]">
              완벽한 공간,
              <br />
              특별한 경험
            </h3>
            
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#d4af37]/60 to-transparent lg:from-transparent lg:via-[#d4af37]/60 lg:to-[#d4af37]/60 my-10" />
            
            <p className="text-base md:text-lg text-white/80 font-light tracking-wide leading-loose">
              프라이빗한 룸과
              <br />
              세련된 분위기에서
              <br />
              품격 있는 시간을 경험하세요.
            </p>
          </div>

        </div>
      </section>

      <section id="gallery" className="border-b border-white/5 bg-[#050507] py-32 relative">
        <div className="mx-auto max-w-7xl px-5 relative z-10">
          <div className="text-center mb-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Premium Gallery
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tighter">
              High-End Space
            </h2>
            <p className="mt-6 text-base text-white/50 font-light max-w-2xl mx-auto break-keep">
              대전톰바는 고객님의 완벽한 밤을 위해 최고급 명품 인테리어와 디테일한 조명 세팅을 완성했습니다.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "ENTRANCE", desc: "고급스러운 입구", img: "/images/tomba (4-1).png" },
              { title: "VIP ROOM", desc: "프라이빗 룸", img: "/images/tomba (4-2).png" },
              { title: "PREMIUM BAR", desc: "프리미엄 바", img: "/images/tomba (4-3).png" },
              { title: "PREMIUM LOUNGE", desc: "럭셔리 라운지", img: "/images/tomba (4-4).png" },
              { title: "SPECIAL MOMENT", desc: "즐거운 분위기", img: "/images/tomba (4-5).png" },
              { title: "INTERIOR", desc: "세련된 인테리어", img: "/images/tomba (4-6).png" }
            ].map((item, idx) => (
              <div 
                key={item.title}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.02] aspect-[4/3] transition-all duration-[400ms] hover:border-[#d4af37]/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] cursor-pointer"
              >
                {/* Background Image with Hover Scale */}
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
                />
                
                {/* Overlay Dark 20% on Hover */}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-[400ms] group-hover:bg-black/30" />
                
                {/* Frost Glass Caption */}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-black/40 backdrop-blur-md border-t border-white/10 transition-all duration-[400ms]">
                  <h3 className="text-white font-black tracking-widest text-sm lg:text-base">
                    {item.title}
                  </h3>
                  <p className="text-[#d4af37]/80 text-[11px] lg:text-xs mt-1.5 font-light tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="guide" className="relative isolate border-b border-white/5 py-32 bg-[#050507]">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto w-full max-w-7xl px-5">
          <div className="text-center mb-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Visitor Guide
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fdfbfb] to-[#a0842a]">처음 방문이라면</span><br />
              이것만 확인하세요.
            </h2>
            <p className="mt-6 text-base text-white/50 font-light max-w-lg mx-auto leading-relaxed break-keep">
              예약부터 방문까지, 편안하고 만족스러운 시간을 위한
              <br className="hidden sm:block" />
              간단한 가이드를 준비했습니다.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "예약 문의",
                desc: "전화 또는 카카오톡으로\n편하게 상담 가능합니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )
              },
              {
                title: "방문 시간",
                desc: "평일 저녁과 주말은\n사전 예약을 추천드립니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Dress Code",
                desc: "깔끔하고 세련된 스타일을\n추천드립니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              {
                title: "프라이빗 이용",
                desc: "편안한 분위기에서\n여유로운 시간을 제공합니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )
              },
              {
                title: "맞춤 안내",
                desc: "방문 목적에 맞게\n실장이 직접 안내드립니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "귀가 안내",
                desc: "이용 후에도\n끝까지 친절하게 도와드립니다.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )
              }
            ].map((card, idx) => (
              <div 
                key={card.title}
                className="group relative flex flex-col items-center text-center rounded-[24px] bg-white/[0.02] border border-white/[0.05] p-10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-[400ms] hover:-translate-y-2 hover:bg-white/[0.04] hover:border-[#d4af37]/40 hover:shadow-[0_16px_48px_rgba(212,175,55,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100 rounded-[24px]" />
                <span className="relative text-[#d4af37] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[400ms] mb-6">
                  {card.icon}
                </span>
                <h3 className="relative text-lg font-medium text-white group-hover:text-[#d4af37] transition-colors duration-[300ms]">
                  {card.title}
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed text-white/50 font-light whitespace-pre-line group-hover:text-white/70 transition-colors duration-[300ms]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="border-b border-white/10 bg-[#08080a] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f7d680]/80">
              Location
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[1.3] md:text-5xl">
              대전톰바 오시는길
            </h2>
            <address className="mt-6 not-italic text-lg leading-9 text-white/70">
              <strong className="block text-2xl font-black text-[#f7d680] mb-2">
                {businessName}
              </strong>
              주소: {fullAddress}
              <br />
              전화 예약: <a href={phoneHref} className="hover:text-[#f7d680] transition">{phoneDisplay}</a>
            </address>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#f7d680]/20 bg-[#111015] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <iframe
              title="대전톰바 구글 지도"
              src={mapEmbedSrc}
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 text-white/70">
                {fullAddress}
              </p>
              <a
                href={mapDirectionsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[#f7d680] px-4 py-2 text-sm font-black text-[#f7d680] hover:bg-[#f7d680] hover:text-[#08080a]"
              >
                구글 길찾기
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative bg-[#050507] py-40 overflow-hidden flex items-center justify-center text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

        <div className="relative mx-auto w-full max-w-4xl px-5 z-10 flex flex-col items-center">
          
          <h2 className="text-5xl md:text-7xl lg:text-[90px] font-black text-white tracking-tighter leading-[1.1] break-keep">
            마지막 선택은
            <br />
            유진실장이
            <br />
            완성합니다.
          </h2>
          
          <p className="mt-12 text-base md:text-xl text-white/70 font-light tracking-wide leading-loose">
            오늘의 모임,
            <br />
            소중한 만남,
            <br />
            특별한 하루까지
            <br /><br />
            방문 목적에 맞춰
            <br />
            최적의 공간을 준비해드립니다.
          </p>

          <div className="w-[1px] h-16 bg-gradient-to-b from-[#d4af37]/60 to-transparent my-12" />

          {/* Premium Check List */}
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 text-sm md:text-base text-[#d4af37]/90 font-light tracking-wide mb-16">
            {[
              "실시간 예약",
              "1:1 맞춤 안내",
              "프라이빗 VIP룸",
              "유진실장 직접 관리"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-[#d4af37] text-xs">✔</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a 
              href={phoneHref}
              className="group relative inline-flex flex-col items-center justify-center px-10 py-5 overflow-hidden rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/50 backdrop-blur-md transition-all duration-[500ms] hover:bg-[#d4af37]/20 hover:border-[#d4af37] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-1 w-full sm:w-auto min-w-[280px]"
            >
              <span className="relative text-xs font-semibold tracking-[0.3em] text-[#d4af37]/80 group-hover:text-white/80 transition-colors duration-[500ms] mb-2">
                유진실장 다이렉트 예약
              </span>
              <span className="relative text-2xl md:text-3xl font-black tracking-wider text-[#d4af37] group-hover:text-white transition-colors duration-[500ms]">
                010.9599.6174
              </span>
            </a>

            <a 
              href={kakaoOpenChatHref}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex flex-col items-center justify-center px-10 py-5 overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-[500ms] hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 w-full sm:w-auto min-w-[280px]"
            >
              <span className="relative text-xs font-semibold tracking-[0.3em] text-white/50 group-hover:text-white/80 transition-colors duration-[500ms] mb-2">
                1:1 실시간 상담
              </span>
              <span className="relative text-2xl md:text-3xl font-black tracking-wider text-white/90 group-hover:text-white transition-colors duration-[500ms]">
                카카오톡 예약
              </span>
            </a>
          </div>

        </div>
      </section>

      </main>
  );
}
