import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Target, Sparkles, MapPin, BookOpen, Settings, ChevronRight, Building } from "lucide-react";
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

  const regionsList = [
    {
      id: "seoul-gyeonggi",
      name: "수도권 (서울/경기/인천)",
      engName: "Metropolitan Area",
      hq: "서울 본사 (대표 직할)",
      branchesCount: 12,
      cities: ["서울 HQ", "인천 지사", "수원 지사", "고양 지사", "성남 지사", "부천", "용인", "안산", "평택", "안양"],
      desc: "장애인 고용 전주기를 밀착 관할하며 본사 상시 안면인식 및 근태 모니터링 실시간 관제 센터를 운영합니다.",
      path: "M 40,80 C 45,78 65,78 78,80 C 82,88 78,98 81,105 C 71,106 60,108 48,110 C 40,110 38,100 39,94 C 41,88 38,84 40,80 Z",
      color: "fill-[#EBB63F]/15 stroke-[#EBB63F] hover:fill-[#EBB63F]/30",
      activeColor: "fill-[#EBB63F]/35 stroke-[#EBB63F] stroke-[2.5]"
    },
    {
      id: "gangwon",
      name: "강원권",
      engName: "Gangwon Province",
      hq: "원주 지사",
      branchesCount: 1,
      cities: ["원주 지사", "춘천 지사", "강릉 지소"],
      desc: "강원 전역 원격 근로자의 근무지 실태 대조 및 주기적인 현지 직무 면담 관리를 완벽히 대행합니다.",
      path: "M 78,80 C 90,76 105,73 118,70 C 122,82 126,95 132,112 C 122,111 110,110 100,112 C 95,109 88,107 81,105 C 78,98 82,88 78,80 Z",
      color: "fill-emerald-400/15 stroke-emerald-400 hover:fill-emerald-400/30",
      activeColor: "fill-emerald-400/35 stroke-emerald-400 stroke-[2.5]"
    },
    {
      id: "chungcheong",
      name: "충청권 (대전/세종/충남/충북)",
      engName: "Chungcheong Region",
      hq: "대전 광역 지사",
      branchesCount: 4,
      cities: ["대전 지사", "세종 지소", "천안 지사", "청주 지사"],
      desc: "대전 광역권을 필두로 세종 행정타운 및 연구단지 인근 하이브리드 고용 실태를 밀착 수호합니다.",
      path: "M 48,110 C 60,108 71,106 81,105 C 88,107 95,109 100,112 C 96,122 93,132 88,140 C 73,139 58,138 45,138 C 36,134 32,126 32,120 C 32,114 42,112 48,110 Z",
      color: "fill-blue-400/15 stroke-blue-400 hover:fill-blue-400/30",
      activeColor: "fill-blue-400/35 stroke-blue-400 stroke-[2.5]"
    },
    {
      id: "jeolla",
      name: "호남권 (광주/전남/전북)",
      engName: "Jeolla Region",
      hq: "광주 통합 지사",
      branchesCount: 3,
      cities: ["광주 지사", "전주 지사", "순천 지소", "목포", "여수"],
      desc: "서남해안 권역 거점 관리망을 기반으로 현지 복지 연계 시스템을 완비하여 사후 안정을 보증합니다.",
      path: "M 45,138 C 58,138 73,139 88,140 C 86,155 83,170 78,185 C 70,188 62,194 50,195 C 38,196 28,192 24,184 C 20,172 26,155 45,138 Z",
      color: "fill-purple-400/15 stroke-purple-400 hover:fill-purple-400/30",
      activeColor: "fill-purple-400/35 stroke-purple-400 stroke-[2.5]"
    },
    {
      id: "gyeongsang",
      name: "영남권 (부산/대구/울산/경남/경북)",
      engName: "Gyeongsang Region",
      hq: "부산 영남 본부",
      branchesCount: 5,
      cities: ["부산 본사", "대구 지사", "울산 지사", "창원 지사", "구미", "포항"],
      desc: "영남 산업 벨트의 대기업 위탁 수요에 맞춘 대규모 원격 근무 인력풀 및 정기 직무 감사를 실행합니다.",
      path: "M 100,112 C 110,110 122,111 132,112 C 136,122 142,128 142,134 C 142,140 135,152 134,162 C 124,170 110,182 100,184 C 90,185 84,186 78,185 C 83,170 86,155 88,140 C 93,132 96,122 100,112 Z",
      color: "fill-cyan-400/15 stroke-cyan-400 hover:fill-cyan-400/30",
      activeColor: "fill-cyan-400/35 stroke-cyan-400 stroke-[2.5]"
    },
    {
      id: "jeju",
      name: "제주권",
      engName: "Jeju Province",
      hq: "제주 특화 센터",
      branchesCount: 1,
      cities: ["제주 지사"],
      desc: "도서 지역 특수 근무환경을 세밀하게 감안한 전담 맞춤형 재택 헬프데스크를 기동하여 지원합니다.",
      path: "M 45,212 C 53,210 61,211 67,213 C 69,216 66,221 59,222 C 49,222 43,218 45,212 Z",
      color: "fill-pink-400/15 stroke-pink-400 hover:fill-pink-400/30",
      activeColor: "fill-pink-400/35 stroke-pink-400 stroke-[2.5]"
    }
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Interactive South Korea Map (Bento span-2) */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white font-sans">전국 밀착형 인프라 네트워크</h4>
                    <p className="text-xs text-gray-400 mt-0.5">전국 주요 25개 지사 거점을 통한 신속하고 안정적인 고용 위탁</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                  <span className="text-gray-300">실시간 전국 매칭 가동 중</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {regionsList.map((region) => (
                <div 
                  key={region.id} 
                  className="bg-slate-950/35 border border-white/5 hover:border-brand-accent/30 hover:bg-slate-950/50 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 mb-3">
                      <div>
                        <span className="text-[9px] font-mono tracking-wider text-[#EBB63F] uppercase font-bold block">
                          {region.engName}
                        </span>
                        <h5 className="font-bold text-sm sm:text-base text-white mt-0.5 group-hover:text-brand-accent transition-colors duration-200">
                          {region.name}
                        </h5>
                      </div>
                      <span className="text-[10px] bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                        {region.branchesCount}개 거점
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-brand-accent">
                          <Building className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-[9px] block">관할 헤드쿼터</span>
                          <span className="text-gray-200 font-bold text-[11px]">{region.hq}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[9px] mb-1.5 uppercase tracking-wide">관할 거점</span>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <span key={city} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-gray-300 font-sans">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 mt-4">
                    <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                      {region.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Stack (Other 2 cards stacked vertically) */}
          <div className="lg:col-span-1 flex flex-col gap-8 justify-between">
            {/* Card 2: 21+ Years Outsourcing Knowhow Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full">
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
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
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

            {/* Card 3: Standard Operational Circular Diagram */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full">
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
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
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
        </div>

        {/* Bottom Banner slogan line */}
        <div className="mt-16 bg-[#EBB63F] text-brand-green p-4 sm:p-5 rounded-2xl shadow-xl font-bold text-center text-xs sm:text-sm tracking-tight">
          기업의 장애인 고용을 신속하고, 합법적으로, 효율적인 시스템을 통해 <span className="underline decoration-2 font-black">'Bene People'</span>이 모든 최상의 솔루션을 제공해 드립니다.
        </div>
      </div>
    </section>
  );
}
