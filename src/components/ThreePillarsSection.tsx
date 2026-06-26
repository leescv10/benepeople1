import { motion } from "motion/react";
import { DollarSign, ShieldAlert, Sparkles, Check, Laptop, Clock } from "lucide-react";

export default function ThreePillarsSection() {
  return (
    <section id="three-pillars" className="py-24 bg-[#073B31] text-white relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-white/10 rounded-full font-bold">
            OUR THREE PILLARS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4 text-white font-sans">
            기업을 위한 <span className="text-brand-accent underline decoration-4 decoration-brand-accent">Bene People 3대 솔루션</span>
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
            비용, 법적 Risk, 사후 관리에 대해 기업별 맞춤형 솔루션을 완벽 제공합니다.
          </p>
        </div>

        {/* 3 High-Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Pillar 1: Cost */}
          <div className="bg-[#0D5C4E]/45 border-2 border-brand-accent/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-brand-accent transition duration-300">
            <div className="absolute top-0 right-0 bg-brand-accent text-brand-green font-mono text-xs font-black px-3 py-1 rounded-bl-xl">
              01
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">극적인 비용 절감 효과</h3>
              <p className="text-xs text-slate-350 font-medium">300명 기업 기준 연간 부담금 약 2.33억원 대비</p>
            </div>

            {/* Main Visual Callout */}
            <div className="mt-8 bg-brand-accent text-brand-green p-5 rounded-xl text-center shadow-lg group-hover:scale-[1.02] transition duration-300">
              <span className="text-[10px] uppercase font-mono tracking-widest block opacity-75">연간 절감액</span>
              <p className="text-xl sm:text-2xl font-black mt-1">약 1.61억원 SAVE</p>
              <span className="text-xs font-bold block bg-brand-green/10 py-1 rounded-md mt-2">69% 극적 절감 효과</span>
            </div>
          </div>

          {/* Pillar 2: Risk */}
          <div className="bg-[#0D5C4E]/45 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-brand-accent/50 transition duration-300">
            <div className="absolute top-0 right-0 bg-white/10 text-gray-300 font-mono text-xs font-black px-3 py-1 rounded-bl-xl">
              02
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">법무/노무 리스크 완전 배제</h3>
              <p className="text-xs text-slate-350 font-medium">노무사를 통한 철저하고 합법적인 계약 및 행정 관리</p>
            </div>

            {/* Main Visual Callout */}
            <div className="mt-8 bg-[#073B31]/90 border border-emerald-500/20 p-5 rounded-xl text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-2">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-white">전문 공인노무사 합법 보증</p>
              <span className="text-[10px] text-gray-400 mt-1">의무고용 100% 정상 법적 승인</span>
            </div>
          </div>

          {/* Pillar 3: System */}
          <div className="bg-[#0D5C4E]/45 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-brand-accent/50 transition duration-300">
            <div className="absolute top-0 right-0 bg-white/10 text-gray-300 font-mono text-xs font-black px-3 py-1 rounded-bl-xl">
              03
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">원스톱 스마트 운영 시스템</h3>
              <p className="text-xs text-slate-350 font-medium">기업 커스텀 고도화 웹&앱 모니터링 ERP 무상 지원</p>
            </div>

            {/* Main Visual Callout */}
            <div className="mt-8 bg-[#073B31]/90 border border-blue-500/20 p-5 rounded-xl text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-2">
                <Laptop className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-white">전용 근태 & 업무 ERP 무상 제공</p>
              <span className="text-[10px] text-gray-400 mt-1">안면인식 · 고유 IP · GPS 연동</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
