import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Target, Sparkles, BookOpen, Settings } from "lucide-react";
import { HomepageConfig } from "../types";

interface IntroSectionProps {
  config?: HomepageConfig;
}

export default function IntroSection({ config }: IntroSectionProps) {
  const introBadge = config?.introBadge || "ABOUT · 베네피플";
  const introTitle = config?.introTitle || "이름에 담은 약속, Benefit + People";
  const introDesc = config?.introDesc || "베네피플은 '혜택(Benefit)'과 '사람(People)'을 더한 이름입니다.\n좋은 인재와 좋은 일터를 안전하고 투명하게 연결하여, 기업과 근로자 모두에게 윈윈(Win-Win)의 가치를 확실히 제공합니다.";
  
  const pillar1Title = config?.introPillar1Title || "브랜드 의미";
  const pillar1Desc = config?.introPillar1Desc || "라틴어 Bene(좋은 · 이롭게)에서 출발해, 기업의 이익 창출과 사회공헌 활동 모두 중심에 '사람'을 둡니다.";
  
  const pillar2Title = config?.introPillar2Title || "미션 · 비전";
  const pillar2Desc = config?.introPillar2Desc || "베네피플은 누구도 일에서 소외되지 않는 사회를 만들고, 장애인 고용을 단순 비용 지출이 아닌 경영 성과로 바꾸어 기업과 사회가 함께 성장할 수 있도록 지원합니다.";

  const pillar3Title = config?.introPillar3Title || "핵심 기술 · 가치";
  const pillar3Desc = config?.introPillar3Desc || "자체 개발한 AI 기반의 매칭 시스템 및 모니터링 솔루션으로 완벽한 근태 및 사후관리 서비스를 제공합니다.";

  return (
    <section id="about" className="py-24 bg-transparent text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EBB63F]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border-l-4 border-[#EBB63F] pl-4 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent font-bold">
            {introBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white font-sans">
            {introTitle.includes("Benefit + People") ? (
              <>
                {introTitle.split("Benefit + People")[0]}
                <span className="text-brand-accent">Benefit + People</span>
                {introTitle.split("Benefit + People")[1]}
              </>
            ) : (
              introTitle
            )}
          </h2>
        </div>

        <p className="text-gray-300 max-w-4xl text-sm sm:text-base leading-relaxed mb-16 whitespace-pre-line">
          {introDesc}
        </p>

        {/* Three core brand pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {pillar1Desc}
            </p>
          </div>

          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {pillar2Desc}
            </p>
          </div>

          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {pillar3Desc}
            </p>
          </div>
        </div>

        {/* Infrastructure & Knowhow Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: 21+ Years Outsourcing Knowhow Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-lg h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white font-sans">21년 직무 교육 노하우</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">사전 검증 완료된 맞춤형 교육 과정</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                풍부한 직무 맞춤형 체계적 매뉴얼 교육 과정이 사전에 완비되어 현장 투입 시 발생할 수 있는 시행착오를 제로화합니다.
              </p>
            </div>

            {/* Small stylized grid table representing training parameters */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-white/5 text-[10px] font-sans">
              <div className="grid grid-cols-3 gap-2 text-slate-300 font-bold border-b border-white/10 pb-1.5 text-center">
                <span>교육 내용</span>
                <span>교육 방법</span>
                <span>교육 주기</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">업무 실무 교육</span>
                <span className="bg-white/5 py-1 rounded">Manual</span>
                <span className="bg-white/5 py-1 rounded">신입 교육</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">직무 적응 교육</span>
                <span className="bg-white/5 py-1 rounded">실습 훈련</span>
                <span className="bg-white/5 py-1 rounded">정기 교육</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">인성 및 직장예절</span>
                <span className="bg-white/5 py-1 rounded">동영상 강좌</span>
                <span className="bg-white/5 py-1 rounded">Ad hoc</span>
              </div>
            </div>
          </div>

          {/* Card 2: Standard Operational Circular Diagram */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-lg h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white font-sans">표준 운영 시스템</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">선순환하는 고도화 관리 아키텍처</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                자체 특화 모바일 APP과 스마트 전용 웹 플랫폼에 기반한 순환식 표준 관리 체계를 상시 가동합니다.
              </p>
            </div>

            {/* Circular diagram */}
            <div className="relative h-44 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-center p-2">
              <div className="relative w-32 h-32 rounded-full border border-dashed border-white/15 flex items-center justify-center animate-[spin_40s_linear_infinite]">
                {/* Dots around circle */}
                <div className="absolute top-0 bg-brand-accent text-brand-green px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">Deployment</div>
                <div className="absolute right-0 bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold font-mono translate-x-3">Training</div>
                <div className="absolute bottom-0 bg-brand-accent text-brand-green px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">Activity</div>
                <div className="absolute left-0 bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold font-mono -translate-x-3">Evaluation</div>
              </div>
              <div className="absolute bg-[#073B31] text-center p-2.5 rounded-full border border-white/15 w-24 h-24 flex flex-col items-center justify-center shadow-md">
                <span className="text-[9px] text-[#EBB63F] font-bold">Systemized</span>
                <span className="text-[10px] font-extrabold text-white mt-0.5">Operation</span>
                <span className="text-[8px] text-gray-400 mt-0.5">thru Manual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner slogan line */}
        <div className="mt-16 bg-[#EBB63F] text-brand-green p-4 sm:p-5 rounded-2xl shadow-xl font-bold text-center text-xs sm:text-sm tracking-tight">
          기업의 장애인 고용을 신속하고, 합법적으로, 효율적인 시스템을 통해 <span className="underline decoration-2 font-black">'BenePeople'</span>이 모든 최상의 솔루션을 제공해 드립니다.
        </div>
      </div>
    </section>
  );
}
