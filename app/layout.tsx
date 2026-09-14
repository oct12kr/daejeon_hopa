import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { siteUrl } from "@/lib/constants";

const defaultTitle = "대전호빠 | 대전톰바 010-5955-6174 유진실장";
const description =
  "대전호빠를 찾는다면 대전톰바 010-5955-6174 유진실장입니다. 프라이빗 VIP룸과 품격 있는 서비스로 특별한 시간을 완성하며, 유진실장이 예약부터 마무리까지 직접 안내합니다.";

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
        url: "/images/tomba%20(1).webp",
        width: 1672,
        height: 941,
        alt: "대전톰바 예약 상담"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: ["/images/tomba%20(1).webp"]
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
