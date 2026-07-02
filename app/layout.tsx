import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionButtons from "@/components/FloatingActionButtons";

const siteUrl = "https://daejeonhopa.com";
const defaultTitle = "대전호빠 대전톰바 | 당신만을 위한 특별한 밤";
const description =
  "대전호빠 대전톰바. 프라이빗한 공간, 완벽한 서비스. 베테랑 유진실장이 잊지 못할 최고의 순간을 만들어 드립니다. 지금 바로 예약하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | 대전호빠"
  },
  description,
  keywords: [
    "대전호빠",
    "대전톰바",
    "대전호빠 예약",
    "대전톰바 예약",
    "대전 라운지",
    "유성구 호빠",
    "대전 하이엔드 라운지",
    "대전호빠 예약문의",
    "대전톰바 예약문의",
    "대전톰바 오시는길"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "대전톰바",
    title: defaultTitle,
    description,
    images: [
      {
        url: "/images/seven%20(1).png",
        width: 2400,
        height: 1000,
        alt: "대전톰바 예약 상담"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: ["/images/seven%20(1).png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  category: "nightlife"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <FloatingActionButtons />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
