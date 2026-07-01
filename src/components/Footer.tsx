import { useState } from "react";
import { Shield, Sparkles } from "lucide-react";
import logoImg from "../assets/images/bene_brand_logo_1782911879088.jpg";
import { HomepageConfig } from "../types";
import { AnimatePresence } from "motion/react";
import TermsModal from "./TermsModal";

interface FooterProps {
  config?: HomepageConfig;
  onOpenTerms?: (tab: "terms" | "privacy") => void;
}

export default function Footer({ config, onOpenTerms }: FooterProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  const openTermsModal = (tab: "terms" | "privacy") => {
    if (onOpenTerms) {
      onOpenTerms(tab);
    } else {
      setActiveTab(tab);
      setIsTermsOpen(true);
    }
  };

  const isCustomLogo = !!(
    config?.logoUrl &&
    !config.logoUrl.includes("benepeople_logo") &&
    !config.logoUrl.includes("benepeople_new_logo") &&
    !config.logoUrl.includes("bene_brand_logo") &&
    config.logoUrl.trim() !== ""
  );
  const logoSource = isCustomLogo ? config.logoUrl : logoImg;
  const companyNameText = config?.companyName || "BenePeople";
  const companyLogoSubtext = config?.companyLogoText || "(주)베네피플";
  const slogan = config?.footerSlogan || "장애인 인재 채용부터 고용부담금 처리, 전용 근태시스템 무상 제공까지 — 베네피플이 채용 · 운영의 전 과정을 완벽히 책임지고 동행합니다.";
  const owner = config?.companyOwner || "박성진";
  const phone = config?.companyPhone || "02-1234-5678";
  const fax = config?.companyFax || "02-1234-5679";
  const email = config?.companyEmail || "info@benepeople.com";
  const address = config?.companyAddress || "경기도 고양시 행신동 948-1 엘지프라자 7층 (본사 · 전국 25개 거점 운영)";
  const copyright = config?.footerCopyright || "© 2026 (주)베네피플 (BenePeople Inc.) All rights reserved.";

  return (
    <footer className="bg-black/15 backdrop-blur-[2px] text-gray-300 border-t border-white/5 pt-16 pb-8 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/5">
          {/* Logo & Slogan Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={logoSource}
                alt="BenePeople Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  {companyNameText}
                </span>
                <span className="text-[9px] text-brand-accent font-semibold block tracking-wide">
                  {companyLogoSubtext}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {slogan}
            </p>
          </div>

          {/* Company Information Column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-extrabold text-[#EBB63F] uppercase tracking-wider">
              {companyLogoSubtext} 본사 정보
            </h4>
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed font-sans">
              <p>
                <strong className="text-white">상호명:</strong> {companyLogoSubtext} | <strong className="text-white">대표이사:</strong> {owner}
              </p>
              <p>
                <strong className="text-white">대표전화:</strong> {phone} | <strong className="text-white">팩스:</strong> {fax} | <strong className="text-white">이메일:</strong> {email}
              </p>
              <p>
                <strong className="text-white">주소:</strong> {address}
              </p>
            </div>
          </div>

          {/* Global Support Status Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              고객 지원 현황
            </h4>
            <div className="bg-[#0D5C4E]/40 border border-emerald-500/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400">정상 운영 중</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                전국 25개 거점의 채용 · 근태 · 매칭 시스템이 실시간으로 안정적으로 운영되고 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Terms links */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{copyright}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openTermsModal("terms")}
              className="hover:text-[#EBB63F] transition cursor-pointer text-left focus:outline-none"
            >
              이용약관
            </button>
            <span className="text-gray-700">|</span>
            <button
              onClick={() => openTermsModal("privacy")}
              className="hover:text-[#EBB63F] transition font-bold cursor-pointer text-left focus:outline-none"
            >
              개인정보처리방침
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTermsOpen && (
          <TermsModal
            isOpen={isTermsOpen}
            initialTab={activeTab}
            onClose={() => setIsTermsOpen(false)}
          />
        )}
      </AnimatePresence>
    </footer>
  );
}
