import { motion } from "motion/react";
import { Heart, Target, Sparkles, MapPin, BookOpen, Settings } from "lucide-react";

export default function IntroSection() {
  return (
    <section id="about" className="py-24 bg-[#073B31] text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EBB63F]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border-l-4 border-[#EBB63F] pl-4 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent font-bold">
            ABOUT · 베네피플
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white font-sans">
            이름에 담은 약속, <span className="text-brand-accent">Benefit + People</span>
          </h2>
        </div>

        <p className="text-gray-300 max-w-4xl text-sm sm:text-base leading-relaxed mb-16">
          베네피플은 <strong>'혜택(Benefit)'</strong>과 <strong>'사람(People)'</strong>을 더한 이름입니다.  
          좋은 인재와 좋은 일터를 안전하고 투명하게 연결하여, 기업과 근로자 모두에게 <strong>윈윈(Win-Win)의 가치</strong>를 확실히 제공합니다.
        </p>

        {/* Three core brand pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">브랜드 의미</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              라틴어 <strong>Bene(좋은 · 이롭게)</strong>에서 출발해, 기업의 이익 창출과 사회공헌 활동 모두 중심에 <strong className="text-[#EBB63F]">'사람'</strong>을 둡니다.
            </p>
          </div>

          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">미션 · 비전</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              베네피플은 누구도 일에서 소외되지 않는 사회를 만들고, 장애인 고용을 단순 비용 지출이 아닌 <strong className="text-[#EBB63F]">경영 성과</strong>로 바꾸어 기업과 사회가 함께 성장하는 미래를 만듭니다.
            </p>
          </div>

          <div className="bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-2xl p-6 sm:p-8 hover:bg-[#0D5C4E]/60 transition duration-300 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">서비스 가치</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              장애가 있는 우수한 인재와 기업 고객을 정밀 매칭하고, <strong>채용 · 노무 위탁 · 전용 ERP · 사후관리 전 과정</strong>을 합법적으로 일임받아 행정 부담을 덜어드립니다.
            </p>
          </div>
        </div>

        {/* Infrastructure & Knowhow Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Nationwide Infrastructure Map */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#EBB63F]" />
                <h4 className="font-bold text-base text-white">전국 인프라망</h4>
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                전국 주요 25개 직영 거점을 통해 신속하고 안정적인 채용 모집 및 출퇴근 모니터링 관리 체계를 지원합니다.
              </p>
            </div>

            {/* Styled interactive-looking Korea Map Graphic */}
            <div className="h-44 bg-slate-900/40 rounded-xl relative overflow-hidden border border-white/5 p-2 flex items-center justify-center">
              <div className="absolute inset-0 bg-radial-gradient from-[#EBB63F]/5 to-transparent pointer-events-none"></div>
              {/* Simple illustrative SVG representing Korea Outline and dots */}
              <svg viewBox="0 0 120 180" className="h-full text-[#EBB63F]/30 fill-current opacity-80" aria-hidden="true">
                <path d="M45,10 C48,8 52,12 55,14 C58,16 62,15 65,18 C68,21 72,19 75,22 C78,25 76,29 74,32 C72,35 68,36 65,39 C62,42 61,46 59,50 C57,54 59,58 58,62 C57,66 54,70 52,74 C50,78 47,82 46,86 C45,90 48,94 47,98 C46,102 43,106 41,110 C39,114 36,118 35,122 C34,126 36,130 35,134 C34,138 31,142 29,146 C27,150 25,154 26,158 C27,162 25,166 23,170 C21,174 18,176 16,178 C14,180 10,175 8,172 C6,169 5,165 4,161 C3,157 5,153 6,149 C7,145 9,141 11,137 C13,133 12,129 11,125 C10,121 8,117 7,113 C6,109 8,105 10,101 C12,97 15,93 17,89 C19,85 18,81 17,77 C16,73 14,69 13,65 C12,61 14,57 16,53 C18,49 20,45 22,41 C24,37 23,33 22,29 C21,25 22,21 24,17 C26,13 32,15 35,13 C38,11 42,12 45,10 Z" />
                {/* 25 cities coordinate nodes */}
                <circle cx="50" cy="30" r="2.5" className="fill-brand-accent animate-pulse" />
                <circle cx="58" cy="42" r="2" className="fill-brand-accent" />
                <circle cx="45" cy="55" r="2" className="fill-brand-accent animate-ping" />
                <circle cx="62" cy="65" r="2" className="fill-brand-accent" />
                <circle cx="48" cy="80" r="2.5" className="fill-brand-accent animate-pulse" />
                <circle cx="54" cy="98" r="2" className="fill-brand-accent" />
                <circle cx="38" cy="115" r="2" className="fill-brand-accent" />
                <circle cx="46" cy="130" r="2" className="fill-brand-accent" />
                <circle cx="32" cy="148" r="2.5" className="fill-brand-accent animate-pulse" />
                <circle cx="20" cy="165" r="2" className="fill-brand-accent" />
              </svg>
              {/* Overlay labels */}
              <div className="absolute top-4 left-4 bg-slate-950/80 px-2 py-1 rounded text-[9px] font-mono border border-white/5">
                ● 서울/경기 헤드쿼터
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/80 px-2 py-1 rounded text-[9px] font-mono border border-white/5">
                ● 전국 25개 지사 거점
              </div>
            </div>
          </div>

          {/* Card 2: 21+ Years Outsourcing Knowhow Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#EBB63F]" />
                <h4 className="font-bold text-base text-white">21년 이상 구축된 교육 노하우</h4>
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                풍부한 아웃소싱 및 장애인 직무 맞춤형 체계적 매뉴얼 교육 과정이 사전에 검증 완료되어 즉각 활용 가능합니다.
              </p>
            </div>

            {/* Small stylized grid table representing training parameters */}
            <div className="space-y-2 bg-[#073B31] p-3 rounded-xl border border-white/5 text-[10px]">
              <div className="grid grid-cols-3 gap-2 text-slate-300 font-bold border-b border-white/10 pb-1.5 text-center">
                <span>교육 내용</span>
                <span>교육 방법</span>
                <span>교육 주기</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">업무 교육 (실무)</span>
                <span className="bg-white/5 py-1 rounded">Manual</span>
                <span className="bg-white/5 py-1 rounded">신입 교육</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">영업/직무 교육</span>
                <span className="bg-white/5 py-1 rounded">실습 훈련</span>
                <span className="bg-white/5 py-1 rounded">정기 교육</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-gray-400 py-0.5">
                <span className="bg-white/5 py-1 rounded">인성 및 예절</span>
                <span className="bg-white/5 py-1 rounded">동영상 강좌</span>
                <span className="bg-white/5 py-1 rounded">Ad hoc</span>
              </div>
            </div>
          </div>

          {/* Card 3: Standard Operational Circular Diagram */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-[#EBB63F]" />
                <h4 className="font-bold text-base text-white">표준 운영 시스템</h4>
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Manual 및 고유 모바일 APP, 웹 플랫폼에 기반해 선순환하는 고도화된 표준 관리 아키텍처를 가동합니다.
              </p>
            </div>

            {/* Circular diagram */}
            <div className="relative h-44 bg-slate-900/40 rounded-xl border border-white/5 flex items-center justify-center p-2">
              <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center animate-[spin_40s_linear_infinite]">
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
          기업의 장애인 고용을 신속하고 합법적인 효율 시스템으로 지원하며, <span className="underline decoration-2 font-black">'Bene People'</span>이 최상의 솔루션을 제공해 드립니다.
        </div>
      </div>
    </section>
  );
}
