import { Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#073B31] text-gray-300 border-t border-white/5 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/5">
          {/* Logo & Slogan Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBB63F] flex items-center justify-center font-black text-brand-green text-xl shadow-md">
                B
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  Bene People
                </span>
                <span className="text-[9px] text-brand-accent font-semibold block tracking-wide">
                  (주)베네피플
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              장애인 인재 채용부터 고용부담금 처리, 전용 ERP 시스템 무상 제공까지 — <strong>베네피플</strong>이 채용 · 운영의 전 과정을 완벽히 책임지고 동행합니다.
            </p>
          </div>

          {/* Company Information Column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-extrabold text-[#EBB63F] uppercase tracking-wider">
              (주)베네피플 본사 정보
            </h4>
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed font-sans">
              <p>
                <strong className="text-white">상호명:</strong> (주)베네피플 | <strong className="text-white">대표이사:</strong> 박성진
              </p>
              <p>
                <strong className="text-white">대표전화:</strong> 02-1234-5678 | <strong className="text-white">팩스:</strong> 02-1234-5679 | <strong className="text-white">이메일:</strong> info@benepeople.com
              </p>
              <p>
                <strong className="text-white">주소:</strong> 경기도 고양시 행신동 948-1 엘지프라자 7층 (본사 · 전국 25개 거점 운영)
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
          <p>© 2026 (주)베네피플 (Bene People Inc.) All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#EBB63F] transition">
              이용약관
            </a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-[#EBB63F] transition font-bold">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
