import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Laptop, 
  Clock, 
  Maximize2, 
  X, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  Activity, 
  Palette, 
  Music, 
  Briefcase, 
  CheckCircle2, 
  Eye, 
  FileText 
} from "lucide-react";
import { HomepageConfig } from "../types";

interface ThreePillarsSectionProps {
  config?: HomepageConfig;
}

export default function ThreePillarsSection({ config }: ThreePillarsSectionProps) {
  const badge = config?.pillarsBadge || "OUR THREE PILLARS";
  const title = config?.pillarsTitle || "기업을 위한 BenePeople 3대 솔루션";
  const desc = config?.pillarsDesc || "비용, 법적 Risk, 사후 관리에 대해 기업별 맞춤형 솔루션을 제공합니다.";

  const p1Title = config?.pillar1Title || "비용 절감 효과";
  const p1Sub = config?.pillar1Sub || "300명 기업 기준 연간 부담금 약 2.33억원 대비";
  const p1Val = config?.pillar1Val || "약 1.61억원 SAVE";
  const p1ValSub = config?.pillar1ValSub || "69% 극적 절감 효과";

  const p2Title = config?.pillar2Title || "법무/노무 리스크 해소";
  const p2Sub = config?.pillar2Sub || "노무사를 통한 철저하고 합법적인 계약 및 행정 관리";
  const p2Val = config?.pillar2Val || "전문 공인노무사 합법 보증";
  const p2ValSub = config?.pillar2ValSub || "의무고용 100% 정상 법적 승인";

  const p3Title = config?.pillar3Title || "베네피플 Performance Dashbord";
  const p3Sub = config?.pillar3Sub || "매월 고객사에 운영 현황을 제공되는 리포트 시스템.";

  // Interactive state for Card 3 preview
  const [miniTab, setMiniTab] = useState<"status" | "attendance" | "performance">("status");
  // Full modal view state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Selected tab in full modal
  const [modalTab, setModalTab] = useState<"status" | "attendance" | "performance">("status");

  // Sample data of June 2026 Monthly Report
  const employees = [
    { name: "박지윤", joinDate: "2024.03.05", duty: "행정지원 (사무보조)", status: "성실", attendance: 96, icon: FileText, color: "text-blue-400" },
    { name: "김성민", joinDate: "2025.01.12", duty: "체육지도 (홈트레이닝)", status: "정상", attendance: 100, icon: Activity, color: "text-orange-400" },
    { name: "이서현", joinDate: "2024.11.18", duty: "미술창작 (일러스트)", status: "정상", attendance: 100, icon: Palette, color: "text-indigo-400" },
    { name: "임지우", joinDate: "2025.04.10", duty: "음악감상 (보고서작성)", status: "정상", attendance: 97, icon: Music, color: "text-purple-400" },
    { name: "정보경", joinDate: "2025.05.20", duty: "미술창작 (캘리그라피)", status: "우수", attendance: 100, icon: Palette, color: "text-emerald-400" }
  ];

  const daysInJune = Array.from({ length: 30 }, (_, i) => i + 1);
  const isWeekend = (day: number) => {
    // June 1, 2026 is Monday
    // Day 6, 13, 20, 27 are Saturdays (6 % 7 = 6)
    // Day 7, 14, 21, 28 are Sundays (0 % 7 = 0)
    const dayOfWeek = day % 7;
    return dayOfWeek === 6 || dayOfWeek === 0;
  };

  return (
    <section id="three-pillars" className="py-24 bg-transparent text-white relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-white/10 rounded-full font-bold">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4 text-white font-sans">
            {title.includes("BenePeople 3대 솔루션") ? (
              <>
                {title.split("BenePeople 3대 솔루션")[0]}
                <span className="text-brand-accent underline decoration-4 decoration-brand-accent">BenePeople 3대 솔루션</span>
                {title.split("BenePeople 3대 솔루션")[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
            {desc}
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
              <h3 className="text-xl font-bold text-white mb-2">{p1Title}</h3>
              <p className="text-xs text-slate-350 font-medium">{p1Sub}</p>
            </div>

            {/* Main Visual Callout */}
            <div className="mt-8 bg-brand-accent text-brand-green p-5 rounded-xl text-center shadow-lg group-hover:scale-[1.02] transition duration-300">
              <span className="text-[10px] uppercase font-mono tracking-widest block opacity-75">연간 절감액</span>
              <p className="text-xl sm:text-2xl font-black mt-1">{p1Val}</p>
              <span className="text-xs font-bold block bg-brand-green/10 py-1 rounded-md mt-2">{p1ValSub}</span>
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
              <h3 className="text-xl font-bold text-white mb-2">{p2Title}</h3>
              <p className="text-xs text-slate-350 font-medium">{p2Sub}</p>
            </div>

            {/* Main Visual Callout */}
            <div className="mt-8 bg-[#073B31]/90 border border-emerald-500/20 p-5 rounded-xl text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-2">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-white">{p2Val}</p>
              <span className="text-[10px] text-gray-400 mt-1">{p2ValSub}</span>
            </div>
          </div>

          {/* Pillar 3: Live Interactive Report Dashboard */}
          <div className="bg-[#0D5C4E]/45 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-brand-accent/50 transition duration-300">
            <div className="absolute top-0 right-0 bg-white/10 text-gray-300 font-mono text-xs font-black px-3 py-1 rounded-bl-xl">
              03
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{p3Title}</h3>
              <p className="text-xs text-slate-350 font-medium mb-4">{p3Sub}</p>
            </div>

            {/* Live Interactive Report Card Mockup instead of static texts */}
            <div className="mt-4 bg-[#052119]/90 border border-emerald-500/20 rounded-xl p-4 flex flex-col shadow-inner">
              {/* Header block with live badge */}
              <div className="flex items-center justify-between mb-3 border-b border-[#104A3C]/40 pb-2">
                <span className="text-[10px] text-brand-accent font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping"></span>
                  LIVE DEMO REPORT
                </span>
                <span className="text-[9px] text-gray-400 font-mono">2026.06</span>
              </div>

              {/* 3 Metrics Block */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-[#09352A] rounded-lg p-1.5 border border-emerald-500/10">
                  <span className="text-xs font-extrabold text-[#E2B755]">5명</span>
                  <p className="text-[8px] text-gray-400">고용 인원</p>
                </div>
                <div className="bg-[#09352A] rounded-lg p-1.5 border border-emerald-500/10">
                  <span className="text-xs font-extrabold text-[#E2B755]">99%</span>
                  <p className="text-[8px] text-gray-400">평균 출근율</p>
                </div>
                <div className="bg-[#09352A] rounded-lg p-1.5 border border-emerald-500/10">
                  <span className="text-xs font-extrabold text-[#E2B755]">3건</span>
                  <p className="text-[8px] text-gray-400">의견 피드백</p>
                </div>
              </div>

              {/* Mini Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#092B21] rounded-lg p-1 mb-3">
                {(["status", "attendance", "performance"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMiniTab(tab)}
                    className={`text-[9px] font-bold py-1 rounded transition duration-250 ${
                      miniTab === tab
                        ? "bg-brand-accent text-brand-green font-extrabold shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab === "status" ? "직무현황" : tab === "attendance" ? "근태현황" : "성과현황"}
                  </button>
                ))}
              </div>

              {/* Mini Tab Contents (Fixed height to prevent layout shifting) */}
              <div className="h-16 flex flex-col justify-center text-[10px] text-gray-300">
                {miniTab === "status" && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] bg-white/5 px-2 py-0.5 rounded border-l border-brand-accent/40">
                      <span>박지윤 (행정지원)</span>
                      <span className="text-[8px] bg-brand-accent/15 text-brand-accent px-1 rounded">성실</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] bg-white/5 px-2 py-0.5 rounded border-l border-[#E2B755]/40">
                      <span>김성민 (체육지도)</span>
                      <span className="text-[8px] bg-amber-400/15 text-amber-300 px-1 rounded">정상</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] bg-white/5 px-2 py-0.5 rounded border-l border-emerald-400/40">
                      <span>정보경 (미술창작)</span>
                      <span className="text-[8px] bg-emerald-400/15 text-emerald-300 px-1 rounded">우수</span>
                    </div>
                  </div>
                )}

                {miniTab === "attendance" && (
                  <div className="space-y-1.5 px-1">
                    <div>
                      <div className="flex justify-between text-[8px] mb-0.5 text-gray-400">
                        <span>김성민 / 이서현 / 정보경</span>
                        <span className="text-emerald-400 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[100%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] mb-0.5 text-gray-400">
                        <span>임지우 (음악감상)</span>
                        <span className="text-amber-300 font-bold">97%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-300 h-full w-[97%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}

                {miniTab === "performance" && (
                  <div className="bg-[#09352A] rounded p-1.5 border border-emerald-500/10 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <div className="leading-snug truncate">
                      <p className="font-bold text-[9px] text-[#E2B755]">정보경 미술 활동 작품</p>
                      <span className="text-[8px] text-gray-400 block truncate">일상 힐링 엽서 시리즈 드로잉 완료</span>
                    </div>
                  </div>
                )}
              </div>

              {/* View Full Report Trigger Button */}
              <button
                onClick={() => {
                  setModalTab(miniTab);
                  setIsModalOpen(true);
                }}
                className="mt-4 w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-brand-green font-extrabold rounded-lg text-[10px] tracking-wide transition duration-200 shadow flex items-center justify-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                전체 리포트 상세 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen High-Fidelity Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-[#031A14] border border-[#104A3C]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-gray-300 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 1. Header Banner Panel (Inspired by first image) */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#072F24] via-[#041A14] to-[#02100C] border-b border-[#135A47]/40 relative overflow-hidden">
                {/* Accent lighting pattern */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <span className="text-[11px] font-bold text-brand-accent tracking-wider font-mono">
                    (주)베네피플 x 파트너사 협업 리포트
                  </span>
                  <span className="text-xs text-gray-400 font-medium">월간 리포트 | 2026년 6월</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white font-sans mt-2 relative inline-block">
                  2026년 6월 장애인 고용 월별 리포트
                  <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-transparent mt-1.5 rounded-full"></div>
                </h1>

                {/* 3 Golden-Bordered Highlights (First image replica) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                  <div className="bg-[#05261E] border border-[#E2B755]/40 rounded-xl p-4 text-center group hover:border-[#E2B755] transition-all duration-300">
                    <span className="text-2xl sm:text-3xl font-black text-[#E2B755] block">5명</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 block">고용 인원</span>
                  </div>
                  <div className="bg-[#05261E] border border-[#E2B755]/40 rounded-xl p-4 text-center group hover:border-[#E2B755] transition-all duration-300">
                    <span className="text-2xl sm:text-3xl font-black text-[#E2B755] block">99%</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 block">평균 출근율</span>
                  </div>
                  <div className="bg-[#05261E] border border-[#E2B755]/40 rounded-xl p-4 text-center group hover:border-[#E2B755] transition-all duration-300">
                    <span className="text-2xl sm:text-3xl font-black text-[#E2B755] block">3건</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 block">의견 피드백</span>
                  </div>
                </div>

                {/* Little Subtitle line */}
                <div className="mt-4 text-center text-[10px] sm:text-xs text-gray-400 font-mono flex flex-wrap justify-center gap-x-4 gap-y-1">
                  <span>• 직무/근태현황</span>
                  <span>• 근태관리/성실도</span>
                  <span>• 직무별 성과/소견</span>
                  <span>• 의견 피드백(대체인력 매칭) 제공</span>
                </div>
              </div>

              {/* 2. Toggle controls & Section label */}
              <div className="bg-[#041611] px-6 py-4 border-b border-[#135A47]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse"></div>
                  <h2 className="text-sm sm:text-base font-bold text-[#E2B755] font-sans">
                    {modalTab === "status" && "1. 직무현황 | 2026년 6월"}
                    {modalTab === "attendance" && "2. 근태관리 | 2026년 6월"}
                    {modalTab === "performance" && "3. 성과관리 | 2026년 6월"}
                  </h2>
                </div>

                {/* Tab buttons */}
                <div className="flex p-1 bg-[#092B21] rounded-lg border border-[#135A47]/30">
                  {(["status", "attendance", "performance"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition duration-200 ${
                        modalTab === tab
                          ? "bg-brand-accent text-brand-green font-black shadow-md"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab === "status" ? "직무현황" : tab === "attendance" ? "근태관리" : "성과관리"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Main Modal Scroll Content */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#03130E] space-y-6">
                {modalTab === "status" && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Top highlights row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#042119] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">고용 인원</span>
                          <span className="text-lg font-black text-white">5명 (중증 5명)</span>
                        </div>
                      </div>
                      <div className="bg-[#042119] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">평균 출근율</span>
                          <span className="text-lg font-black text-white">99% (수행성공)</span>
                        </div>
                      </div>
                      <div className="bg-[#042119] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">평균 근무일수</span>
                          <span className="text-lg font-black text-white">29일 (법정준수)</span>
                        </div>
                      </div>
                    </div>

                    {/* Table (First image replica) */}
                    <div className="bg-[#042119] border border-[#135A47]/30 rounded-xl overflow-hidden shadow-lg">
                      <div className="px-4 py-3 bg-[#073024] border-b border-[#135A47]/40">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">직무현황 상세</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#135A47]/20 text-[11px] text-gray-400 bg-white/5">
                              <th className="px-4 py-3 font-semibold">이름</th>
                              <th className="px-4 py-3 font-semibold">입사일</th>
                              <th className="px-4 py-3 font-semibold">담당 직무</th>
                              <th className="px-4 py-3 font-semibold text-center">성실도/상태</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#135A47]/10 text-xs text-gray-300">
                            {employees.map((emp, i) => {
                              const EmpIcon = emp.icon;
                              return (
                                <tr key={i} className="hover:bg-white/5 transition duration-150">
                                  <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                                    {emp.name}
                                  </td>
                                  <td className="px-4 py-3.5 font-mono text-gray-400">{emp.joinDate}</td>
                                  <td className="px-4 py-3.5">
                                    <span className="flex items-center gap-1.5">
                                      <EmpIcon className={`w-3.5 h-3.5 ${emp.color}`} />
                                      {emp.duty}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className={`inline-block px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wide ${
                                      emp.status === "우수" 
                                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" 
                                        : emp.status === "성실"
                                        ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                                        : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                                    }`}>
                                      {emp.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === "attendance" && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Matrix calendar description */}
                    <div className="bg-[#042119] border border-white/5 rounded-xl p-4 leading-relaxed text-xs text-gray-300">
                      <p className="font-bold text-[#E2B755] mb-1">📅 2026년 6월 통합 근태 현황판</p>
                      모든 근무자는 베네피플 담당자가 매일 근태를 확인하여 입력합니다. <br />
                      <span className="text-emerald-400">○ (출근)</span>, <span className="text-amber-300 font-bold">★ (공휴일/휴무)</span>, <span className="text-orange-400">연 (연차)</span>로 표시됩니다.
                    </div>

                    {/* Attendance Grid (Second image bottom replica) */}
                    <div className="bg-[#042119] border border-[#135A47]/30 rounded-xl overflow-hidden shadow-lg">
                      <div className="px-4 py-3 bg-[#073024] border-b border-[#135A47]/40 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">6월 일별 출결 기록 (1일 ~ 30일)</h3>
                        <span className="text-[10px] text-gray-400">← 좌우 드래그하여 확인 →</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                          <table className="w-full text-center border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-white/5 border-b border-[#135A47]/20 text-gray-400">
                                <th className="px-3 py-2 text-left font-bold border-r border-[#135A47]/20 sticky left-0 bg-[#042119]">이름</th>
                                {daysInJune.map((day) => {
                                  const weekend = isWeekend(day);
                                  return (
                                    <th 
                                      key={day} 
                                      className={`p-1.5 font-mono font-bold border-r border-[#135A47]/10 ${
                                        weekend ? "bg-red-500/10 text-red-400" : "text-gray-300"
                                      }`}
                                    >
                                      {day}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#135A47]/10 text-gray-300">
                              {employees.map((emp, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="px-3 py-3 text-left font-bold border-r border-[#135A47]/20 sticky left-0 bg-[#042119] text-white">
                                    {emp.name}
                                  </td>
                                  {daysInJune.map((day) => {
                                    const weekend = isWeekend(day);
                                    // Make some random annual leaves for 96% and 97% stats
                                    const isLeave = (emp.name === "박지윤" && day === 15) || (emp.name === "임지우" && day === 22);
                                    
                                    return (
                                      <td 
                                        key={day} 
                                        className={`p-1.5 border-r border-[#135A47]/10 font-bold ${
                                          weekend ? "bg-[#091f1a]" : ""
                                        }`}
                                      >
                                        {isLeave ? (
                                          <span className="text-orange-400">연</span>
                                        ) : weekend ? (
                                          <span className="text-amber-300">★</span>
                                        ) : (
                                          <span className="text-emerald-400">○</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Summary Cards (Second image replica) */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-[#E2B755] uppercase tracking-wider">사원별 월간 최종 출근율</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {employees.map((emp, i) => (
                          <div key={i} className="bg-[#042119] border border-[#135A47]/20 rounded-xl p-3 text-center">
                            <span className="text-xs text-gray-400 block mb-1">{emp.name}</span>
                            <span className="text-lg font-black text-emerald-400 block">{emp.attendance}%</span>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                              <div 
                                className="bg-emerald-400 h-full rounded-full" 
                                style={{ width: `${emp.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === "performance" && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Performance intro */}
                    <div className="bg-[#042119] border border-white/5 rounded-xl p-4 leading-relaxed text-xs text-gray-300">
                      <p className="font-bold text-[#E2B755] mb-1">🎨 전문 직무 수행 평가 및 관리자 소견</p>
                      베네피플은 전문 직무 지도사를 배치하여, 장애인 사원의 업무 가이드 교육 및 데일리 피드백을 밀착 지원합니다. <br />
                      완성된 주간 성과 보고서 및 산출물 내역을 아래와 같이 고객사에 정기 제공합니다.
                    </div>

                    {/* Employee activity cards (Second image top replica) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Card 1 */}
                      <div className="bg-[#042119] border border-emerald-500/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#E2B755]/30 transition duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400">
                              <Activity className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-white text-sm">김성민 사원</h4>
                              <span className="text-[10px] text-gray-400">입사일: 2025.01.12</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 bg-orange-400/10 text-orange-400 border border-orange-400/20 text-[9px] font-bold rounded-full">
                            체육지도
                          </span>
                        </div>
                        <div className="mt-4 space-y-1 text-xs text-gray-300 leading-relaxed">
                          <p className="font-bold text-[#E2B755]">홈트레이닝 및 체력 활동 (피트니스)</p>
                          <p className="text-[11px] text-gray-400">
                            매일 아침 스트레칭과 기초 근력 활동 매뉴얼을 준수하며 일일 실천 보고서를 완벽 제출했습니다. 전문 체육교사의 피드백에 매우 우수하게 응답하여 성실성이 최고조에 달합니다.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-gray-400">사후관리 지도사 소견</span>
                          <span className="text-emerald-400 font-bold">정상 근무 완료</span>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-[#042119] border border-emerald-500/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#E2B755]/30 transition duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                              <Palette className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-white text-sm">이서현 사원</h4>
                              <span className="text-[10px] text-gray-400">입사일: 2024.11.18</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 text-[9px] font-bold rounded-full">
                            미술창작
                          </span>
                        </div>
                        <div className="mt-4 space-y-1 text-xs text-gray-300 leading-relaxed">
                          <p className="font-bold text-[#E2B755]">미술 치료 프로그램 참여 (일러스트)</p>
                          <p className="text-[11px] text-gray-400">
                            매주 지정된 일러스트 주간 테마 과제를 완성도 높은 디지털 및 수채화 화풍으로 완성했습니다. 감정 표현 능력이 훌륭하며, 산출물을 성실히 축적하고 있어 기업 홍보 리소스 활용이 추천됩니다.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-gray-400">사후관리 지도사 소견</span>
                          <span className="text-[#E2B755] font-bold">우수 결과물 제출</span>
                        </div>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-[#042119] border border-emerald-500/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#E2B755]/30 transition duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-white text-sm">박지윤 사원</h4>
                              <span className="text-[10px] text-gray-400">입사일: 2024.03.05</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[9px] font-bold rounded-full">
                            행정지원
                          </span>
                        </div>
                        <div className="mt-4 space-y-1 text-xs text-gray-300 leading-relaxed">
                          <p className="font-bold text-[#E2B755]">창작 키트 프로그램 참여 (캘리그라피)</p>
                          <p className="text-[11px] text-gray-400">
                            손재주가 매우 고우신 사원으로, 전용 캘리그라피 세트를 사용해 매주 한글 단문/장문 작품을 작성하여 스캔 보고했습니다. 성실도가 대단히 뛰어납니다.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-gray-400">사후관리 지도사 소견</span>
                          <span className="text-emerald-400 font-bold">성실 근무 수행</span>
                        </div>
                      </div>

                      {/* Card 4 */}
                      <div className="bg-[#042119] border border-emerald-500/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#E2B755]/30 transition duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
                              <Music className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-white text-sm">임지우 사원</h4>
                              <span className="text-[10px] text-gray-400">입사일: 2025.04.10</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 bg-purple-400/10 text-purple-400 border border-purple-400/20 text-[9px] font-bold rounded-full">
                            음악감상
                          </span>
                        </div>
                        <div className="mt-4 space-y-1 text-xs text-gray-300 leading-relaxed">
                          <p className="font-bold text-[#E2B755]">시각&효과 음악 감상 및 감상문 작성</p>
                          <p className="text-[11px] text-gray-400">
                            치유 사운드 감상 후, 곡의 분위기와 소감을 담은 텍스트 에세이를 작성해 제출하고 있습니다. 작문 감각이 무척 뛰어납니다.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-gray-400">사후관리 지도사 소견</span>
                          <span className="text-emerald-400 font-bold">정상 수급 승인</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Modal Footer Area */}
              <div className="p-4 sm:p-6 bg-[#02100C] border-t border-[#135A47]/30 text-center text-[10px] text-gray-500 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span>© 2026 BenePeople Inc. All rights reserved.</span>
                <span className="text-brand-accent">본 운영 현황 대시보드는 (주)베네피플 소속 노무사 및 전문 지도사들의 자문에 의해 법적으로 안전 보증됩니다.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

