import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Calculator, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Plus, 
  Minus, 
  Building2, 
  Users, 
  Award, 
  TrendingDown, 
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { HomepageConfig } from "../types";

interface BudgetCalculatorProps {
  config?: HomepageConfig;
}

export default function BudgetCalculator({ config }: BudgetCalculatorProps) {
  // Granular inputs for exact calculation
  const [employees, setEmployees] = useState<number>(300);
  const [mildDisabled, setMildDisabled] = useState<number>(0);
  const [severeDisabled, setSevereDisabled] = useState<number>(0);
  
  // Custom tooltips & active explanations state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Dynamic values with safe defaults
  const obligationRate = config?.obligationRate !== undefined ? config.obligationRate : 0.031; // 3.1%
  const finePerMonth = config?.finePerMonth !== undefined ? config.finePerMonth : 2156880; // Level 5 fine (2026 minimum wage equivalent)
  const beneCostPerMonth = config?.beneCostPerMonth !== undefined ? config.beneCostPerMonth : 663000; // Beneple per worker monthly cost

  // Constants based on South Korea's actual graded penalty guidelines for 2025/2026
  const baseLevyPerMonth = 1278000; // 부담기초액 (Standard basic levy)
  
  const calcBadge = config?.calcBadge || "Interactive Legislative Budget Simulator";
  const calcTitle = config?.calcTitle || "우리 회사 예상 '장애인 고용 부담금' 및 절감액 계산기";
  const calcDesc = config?.calcDesc || "대한민국 장애인 고용 촉진법에 따른 가중치(중증 2배), 5단계 할증 구간, 100인 이상 부담금 징수 조항을 완벽히 적용하여 한 치의 오차도 없는 법정 부담금 리스크와 베네피플 솔루션 도입 시의 정확한 연간 비용 절감액을 진단해 드립니다.";

  // --- Exact Mathematical Calculations according to South Korean Labor Law ---
  
  // 1. 법정 의무고용 인원 (Discard decimals)
  const legalRequired = Math.floor(employees * obligationRate);
  
  // 2. 인정 고용 인원 (중증 장애인은 2배수로 인정하는 법정 제도 반영)
  const recognizedCount = mildDisabled + (severeDisabled * 2);
  
  // 3. 고용 미달 인원
  const shortage = Math.max(0, legalRequired - recognizedCount);

  // 4. 의무 고용 이행율 (%)
  const fulfillmentRatePercent = legalRequired > 0 
    ? Math.min(100, Math.round((recognizedCount / legalRequired) * 100)) 
    : 100;

  // 5. 실질 적용 부담금 구간 및 1인당 월 부담금 (5-Tier Graduated Penalty Rate)
  let currentTier = 1;
  let levyRatePerMonth = baseLevyPerMonth;
  let tierName = "할증 없음 (의무 충족)";
  let tierDesc = "장애인 고용률을 충족하여 고용부담금이 발생하지 않습니다.";

  if (legalRequired === 0) {
    currentTier = 0; // Not applicable
    levyRatePerMonth = 0;
    tierName = "의무고용 제외 대상";
    tierDesc = "상시 근로자 50인 미만은 법적 의무고용 지정 대상에서 제외됩니다.";
  } else if (shortage === 0) {
    currentTier = 0; // Fully Met
    levyRatePerMonth = 0;
    tierName = "의무고용 100% 충족";
    tierDesc = "법정 장애인 의무 채용 조건을 100% 달성한 아주 모범적인 기업입니다.";
  } else if (mildDisabled === 0 && severeDisabled === 0) {
    // 0명 고용 시: 최저임금액 가산 (Tier 5)
    currentTier = 5;
    levyRatePerMonth = finePerMonth; // 2,156,880원
    tierName = "Tier 5: 장애인 고용 0명 (최저임금 가산)";
    tierDesc = "장애인을 단 1명도 고용하지 않아 법정 최고율인 최저임금의 100%가 부과되는 위험 구간입니다.";
  } else {
    // 고용 인원이 있는 경우 이행률에 따른 할증 구간 계산
    if (fulfillmentRatePercent >= 75) {
      currentTier = 1;
      levyRatePerMonth = baseLevyPerMonth; // 1,278,000원
      tierName = "Tier 1: 의무 인원의 75% 이상 고용";
      tierDesc = "의무 고용 인원의 3/4 이상을 채용하여 가산금 없이 부담기초액 기본 요율만 적용받는 구간입니다.";
    } else if (fulfillmentRatePercent >= 50) {
      currentTier = 2;
      levyRatePerMonth = Math.floor(baseLevyPerMonth * 1.05); // 1,341,900원
      tierName = "Tier 2: 의무 인원의 50% ~ 75% 미만 고용";
      tierDesc = "의무 고용의 절반 이상을 달성했으나 미달 인원에 대해 부담기초액의 5%가 할증되는 구간입니다.";
    } else if (fulfillmentRatePercent >= 25) {
      currentTier = 3;
      levyRatePerMonth = Math.floor(baseLevyPerMonth * 1.15); // 1,469,700원
      tierName = "Tier 3: 의무 인원의 25% ~ 50% 미만 고용";
      tierDesc = "의무 고용의 이행 수준이 낮아 미달 인원에 대해 부담기초액의 15%가 할증되는 구간입니다.";
    } else {
      currentTier = 4;
      levyRatePerMonth = Math.floor(baseLevyPerMonth * 1.30); // 1,661,400원
      tierName = "Tier 4: 의무 인원의 25% 미만 고용";
      tierDesc = "의무 이행 수준이 1/4 미만으로 극히 미흡하여 부담기초액의 30%가 가중 할증되는 매우 불리한 구간입니다.";
    }
  }

  // 6. 100인 미만 기업 면제 여부 판단 (중요 법규정 정밀 반영)
  const isExemptedFromFine = employees < 100;

  // 7. 연간 순 부담금 (벌금) 총액
  const pureFineYearly = isExemptedFromFine ? 0 : shortage * levyRatePerMonth * 12;

  // 8. 베네피플 솔루션 도입 효율 (중증 2배수 최적화 솔루션 기준)
  // 중증 장애인 채용 시 2배수로 인정되므로, 미달 인원(shortage)을 채우기 위해 필요한 실질 중증 채용 인원은 shortage / 2 올림 수치입니다!
  const beneHiresNeeded = Math.ceil(shortage / 2);
  const beneCostYearly = shortage > 0 ? beneHiresNeeded * beneCostPerMonth * 12 : 0;

  // 9. 연간 비용 절감액 (Net Savings)
  const netSavings = Math.max(0, pureFineYearly - beneCostYearly);
  const savingsPercent = pureFineYearly > 0 ? Math.round((netSavings / pureFineYearly) * 100) : 0;

  // 10. 초과 고용 및 장려금 혜택 (의무 충족 이후)
  const excessCount = Math.max(0, recognizedCount - legalRequired);
  // 고용장려금 평균 추산액 (초과 고용 1인당 월평균 약 500,000원 상당 직접 지급)
  const rewardYearly = employees >= 50 && excessCount > 0 ? excessCount * 500000 * 12 : 0;

  // Helper incrementer/decrementer with safety bounds
  const changeEmployeeValue = (val: number, isSlider = false) => {
    if (isSlider) {
      const updated = Math.max(100, Math.min(10000, val));
      setEmployees(updated);
    } else {
      const updated = Math.min(10000, val);
      setEmployees(updated);
    }
  };

  const handleInputBlur = (val: number, setter: (v: number) => void, min = 0, max = 10000) => {
    if (isNaN(val)) {
      setter(min);
    } else {
      setter(Math.max(min, Math.min(max, val)));
    }
  };

  return (
    <section id="calculator" className="py-24 bg-transparent text-white relative overflow-hidden">
      {/* Dynamic Background Overlays for Deep Visual Hierarchy */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#EBB63F] rounded-full filter blur-[140px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0D5C4E] rounded-full filter blur-[120px] opacity-25 -ml-20 -mb-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-4.5 py-1.5 bg-white/10 rounded-full font-bold inline-flex items-center gap-1.5 shadow-sm">
            <Calculator className="w-3.5 h-3.5 animate-pulse" />
            {calcBadge}
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight mt-5 text-white leading-tight">
            {calcTitle.includes("'장애인 고용 부담금'") ? (
              <>
                {calcTitle.split("'장애인 고용 부담금'")[0]}
                <span className="text-brand-accent relative inline-block">
                  '장애인 고용 부담금'
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-brand-accent/20 -z-10 rounded-full"></span>
                </span>
                {calcTitle.split("'장애인 고용 부담금'")[1]}
              </>
            ) : (
              calcTitle
            )}
          </h2>
          <p className="text-gray-300 mt-5 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-2xl mx-auto font-sans">
            {calcDesc}
          </p>
        </div>

        {/* Calculator Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Precise & Granular Inputs */}
          <div className="lg:col-span-5 bg-white text-[#1A2E2A] p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-emerald-950/5">
            <div className="space-y-7">
              {/* Box Title */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-green/10 rounded-xl text-brand-green">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-green">정밀 시뮬레이션 상세 조건</h3>
                    <p className="text-[11px] text-gray-500 font-sans">실제 우리 기업 현황을 대입하세요</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-extrabold bg-[#1A2E2A]/5 text-[#1A2E2A]/70 px-2 py-0.5 rounded">
                  2026 개정법률 기준
                </span>
              </div>

              {/* Input 1: Total Regular Employees (상시 근로자 수) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-green/80" />
                    상시 근로자 수
                    <button 
                      onClick={() => setActiveTooltip(activeTooltip === "employees" ? null : "employees")}
                      className="text-gray-400 hover:text-brand-green transition focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      value={employees === 0 ? "" : employees}
                      onChange={(e) => changeEmployeeValue(parseInt(e.target.value) || 0)}
                      onBlur={(e) => handleInputBlur(parseInt(e.target.value), setEmployees, 100, 10000)}
                      className="w-20 px-2 py-1 text-right text-sm font-mono font-bold text-brand-green bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:bg-white"
                    />
                    <span className="text-sm font-bold text-gray-700">명</span>
                  </div>
                </div>

                {activeTooltip === "employees" && (
                  <div className="p-3 bg-gray-50 border-l-2 border-brand-green rounded text-xs text-gray-600 leading-relaxed animate-fadeIn">
                    매월 1일부터 말일까지의 상시 근로자 수를 합산하여 해당 월수로 나눈 평균 인원입니다. 소수점 이하는 버림 처리됩니다.
                  </div>
                )}

                {/* Symmetrical Slider with custom markers */}
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="10"
                  value={Math.max(100, employees)}
                  onChange={(e) => changeEmployeeValue(parseInt(e.target.value), true)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-green focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>100명</span>
                  <span>2,000명</span>
                  <span>4,000명</span>
                  <span>6,000명</span>
                  <span>8,000명</span>
                  <span>10,000명</span>
                </div>
              </div>

              {/* Input 2: Mild Disabled Count (경증 장애인 수) */}
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      경증 장애인 고용 수
                    </label>
                    <p className="text-[10px] text-gray-500 font-sans">고용 중인 경증 등록 장애인</p>
                  </div>
                  
                  {/* +/- Incrementor Controller */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMildDisabled(Math.max(0, mildDisabled - 1))}
                      className="p-1.5 bg-white border border-gray-200 hover:border-brand-green/30 hover:text-brand-green rounded-md transition shadow-sm active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={mildDisabled}
                      onChange={(e) => setMildDisabled(Math.max(0, parseInt(e.target.value) || 0))}
                      onBlur={(e) => handleInputBlur(parseInt(e.target.value), setMildDisabled, 0, 1000)}
                      className="w-12 text-center text-sm font-mono font-bold text-brand-green bg-white border border-gray-200 rounded-md py-0.5"
                    />
                    <button
                      onClick={() => setMildDisabled(mildDisabled + 1)}
                      className="p-1.5 bg-white border border-gray-200 hover:border-brand-green/30 hover:text-brand-green rounded-md transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-gray-700 w-3">명</span>
                  </div>
                </div>
              </div>

              {/* Input 3: Severe Disabled Count (중증 장애인 수) - HIGHLIGHTS 2X VALUE */}
              <div className="space-y-3 bg-brand-green/[0.02] p-4 rounded-xl border border-brand-green/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-accent/20 text-brand-green text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg font-sans">
                  의무 충족 가중치 2배 (200%) 반영!
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-brand-green flex items-center gap-1.5">
                      중증 장애인 고용 수
                      <button 
                        onClick={() => setActiveTooltip(activeTooltip === "severe" ? null : "severe")}
                        className="text-gray-400 hover:text-brand-green transition focus:outline-none"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-brand-green/60" />
                      </button>
                    </label>
                    <p className="text-[10px] text-[#0A3D33] font-medium font-sans">고용 중인 중증 등록 장애인</p>
                  </div>

                  {/* +/- Incrementor Controller */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSevereDisabled(Math.max(0, severeDisabled - 1))}
                      className="p-1.5 bg-white border border-gray-200 hover:border-brand-green/30 hover:text-brand-green rounded-md transition shadow-sm active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={severeDisabled}
                      onChange={(e) => setSevereDisabled(Math.max(0, parseInt(e.target.value) || 0))}
                      onBlur={(e) => handleInputBlur(parseInt(e.target.value), setSevereDisabled, 0, 500)}
                      className="w-12 text-center text-sm font-mono font-bold text-brand-green bg-white border border-gray-200 rounded-md py-0.5"
                    />
                    <button
                      onClick={() => setSevereDisabled(severeDisabled + 1)}
                      className="p-1.5 bg-white border border-gray-200 hover:border-brand-green/30 hover:text-brand-green rounded-md transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-brand-green w-3">명</span>
                  </div>
                </div>

                {activeTooltip === "severe" && (
                  <div className="p-3 bg-emerald-50 border-l-2 border-brand-lightgreen rounded text-xs text-[#0A3D33] leading-relaxed animate-fadeIn">
                    <strong>[장애인고용법 제28조의2]</strong>에 의거하여, 중증장애인을 고용한 경우에는 그 인원의 <strong>2배</strong>에 해당하는 장애인을 고용한 것으로 인정하여 의무고용 인원에서 대폭 제외 혜택을 받습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Legal Reference Note */}
            <div className="bg-brand-bg/60 p-4.5 rounded-xl border border-brand-green/10 mt-6 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-brand-lightgreen shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 leading-relaxed font-sans space-y-1">
                <p>
                  민간기업 법정 장애인 의무고용률은 <strong>{(obligationRate * 100).toFixed(1)}%</strong>입니다.
                </p>
                <p className="text-[11px] text-gray-500">
                  • 50인 이상: 장애인 의무 고용 지정 대상<br />
                  • 100인 이상: 미달 시 <strong>의무 고용 부담금 징수 대상 (가산금 부과)</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Real-time Legislative Compliance Report */}
          <div className="lg:col-span-7 bg-brand-lightgreen/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Top Meta info */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-accent uppercase bg-white/10 px-3 py-1 rounded">
                  Analytical Compliance Diagnosis
                </span>
                <span className="text-xs text-gray-300 font-medium">실시간 법적 진단 리포트</span>
              </div>

              {/* Dynamic Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center transition-all hover:bg-white/10">
                  <p className="text-[10px] text-gray-300">법정 의무 인원</p>
                  <p className="text-lg font-bold text-white mt-1 font-mono">{legalRequired}명</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center transition-all hover:bg-white/10">
                  <p className="text-[10px] text-gray-300">현재 인정 인원</p>
                  <p className="text-lg font-bold text-brand-accent mt-1 font-mono">
                    {recognizedCount}명 <span className="text-[10px] text-gray-400 font-sans font-normal">(실수 {mildDisabled + severeDisabled})</span>
                  </p>
                </div>
                <div className="bg-[#EF4444]/10 border border-red-500/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-red-300">최종 부족 인원</p>
                  <p className="text-lg font-bold text-red-400 mt-1 font-mono">{shortage}명</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-300">의무 이행률</p>
                  <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">{fulfillmentRatePercent}%</p>
                </div>
              </div>

              {/* 5-Tier Graduated Penalty Rate Visualizer */}
              {legalRequired > 0 && !isExemptedFromFine && (
                <div className="space-y-2 bg-black/25 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-brand-accent animate-bounce" />
                      부담금 요율 구간 진단 (5단계 누진 할증)
                    </span>
                    <span className="text-xs text-brand-accent font-extrabold px-2.5 py-0.5 bg-brand-accent/10 rounded-full">
                      {shortage === 0 ? "이행 완료" : `Tier ${currentTier} 적용`}
                    </span>
                  </div>

                  {/* Progressive indicator bar */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${shortage === 0 ? "bg-emerald-500" : (currentTier === 1 ? "bg-amber-400" : "bg-white/10")}`} title="Tier 1" />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${shortage === 0 ? "bg-emerald-500" : (currentTier === 2 ? "bg-amber-500" : "bg-white/10")}`} title="Tier 2" />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${shortage === 0 ? "bg-emerald-500" : (currentTier === 3 ? "bg-orange-500" : "bg-white/10")}`} title="Tier 3" />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${shortage === 0 ? "bg-emerald-500" : (currentTier === 4 ? "bg-red-400" : "bg-white/10")}`} title="Tier 4" />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${shortage === 0 ? "bg-emerald-500" : (currentTier === 5 ? "bg-red-600" : "bg-white/10")}`} title="Tier 5" />
                  </div>

                  <div className="text-left">
                    <p className="text-[11px] font-bold text-gray-200 mt-2 font-sans">{tierName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-sans">{tierDesc}</p>
                    {shortage > 0 && (
                      <p className="text-[10px] text-red-300 font-mono mt-1">
                        • 미달 인원 1인당 월 <strong>{levyRatePerMonth.toLocaleString()}원</strong> 부과 중
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 100-Person Exemption Rule Exception Message */}
              {isExemptedFromFine && (
                <div className="p-3.5 bg-blue-500/15 border border-blue-400/20 rounded-xl flex items-start gap-2.5 text-left animate-fadeIn">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-blue-200 leading-relaxed font-sans">
                    <strong>[부담금 면제 혜택 대상]</strong> 상시 근로자 100인 미만 기업은 장애인 의무 고용 지정 대상이지만, 미달되더라도 법적 고용부담금은 <strong>전액 면제</strong>됩니다. 다만, 베네피플을 통해 선제적으로 고용 시 ESG 공시 가점 및 무상 지원 혜택을 극대화할 수 있습니다.
                  </div>
                </div>
              )}

              {/* Comparison visual bars */}
              {shortage > 0 && (
                <div className="space-y-4 pt-2">
                  {/* Before bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300 font-medium">도입 전 (연간 법정 고용 부담금 벌금)</span>
                      <span className="text-red-400 font-bold font-mono">연 약 {pureFineYearly.toLocaleString()}원</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: isExemptedFromFine ? "0%" : "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-left font-sans">세금 공제 처리가 불가능한 공과금성 벌금 (전액 자본 휘발)</p>
                  </div>

                  {/* After bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300 font-medium">베네피플 중증 가중치 솔루션 도입 시 (연 총비용)</span>
                      <span className="text-emerald-400 font-bold font-mono">연 약 {beneCostYearly.toLocaleString()}원</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="bg-gradient-to-r from-emerald-500 to-brand-accent h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: isExemptedFromFine ? "0%" : `${Math.min(100, Math.round((beneCostYearly / (pureFineYearly || 1)) * 100))}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-left font-sans">인건비 및 대행관리 수수료 일체 포함 (법인세 손비인정 100% 가능)</p>
                  </div>
                </div>
              )}

              {/* Perfect Side-by-Side Financial Statement Grid */}
              {shortage > 0 && (
                <div className="bg-black/15 border border-white/5 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-white/5 py-2 px-3 border-b border-white/5 font-bold font-sans text-gray-200">
                    <div className="col-span-4 text-left">항목</div>
                    <div className="col-span-4 text-right text-red-300">기존 부담금 (벌금)</div>
                    <div className="col-span-4 text-right text-emerald-300">베네피플 패키지</div>
                  </div>
                  <div className="divide-y divide-white/5 px-3">
                    <div className="grid grid-cols-12 py-2 font-sans">
                      <div className="col-span-4 text-left text-gray-400">필요 채용 인원</div>
                      <div className="col-span-4 text-right font-mono text-red-300">{shortage}명 (경증기준)</div>
                      <div className="col-span-4 text-right font-mono text-emerald-300">{beneHiresNeeded}명 (중증2배적용)</div>
                    </div>
                    <div className="grid grid-cols-12 py-2 font-sans">
                      <div className="col-span-4 text-left text-gray-400">1인당 월평균 비용</div>
                      <div className="col-span-4 text-right font-mono text-red-300">{levyRatePerMonth.toLocaleString()}원</div>
                      <div className="col-span-4 text-right font-mono text-emerald-300">{beneCostPerMonth.toLocaleString()}원</div>
                    </div>
                    <div className="grid grid-cols-12 py-2 font-sans">
                      <div className="col-span-4 text-left text-gray-400">기업 지출 성격</div>
                      <div className="col-span-4 text-right text-red-300">손비불인정 (자본 잠식)</div>
                      <div className="col-span-4 text-right text-emerald-300">100% 비용처리 (법인세 절감)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quota Compliance Gratitude or Incentive Reward Card */}
              {shortage === 0 && (
                <div className="p-5 bg-gradient-to-r from-emerald-600/30 to-brand-accent/10 border border-emerald-500/30 rounded-xl text-left space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-emerald-300 font-sans">장애인 고용 모범기업 (의무 100% 충족)</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    귀사는 현재 법정 장애인 의무 채용 한도를 완전히 달성하여 고용 부담금 청구 리스크가 전혀 없는 최우수 준수 등급 상태입니다. 
                  </p>
                  
                  {excessCount > 0 ? (
                    <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/20 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-emerald-300">법정 초과 고용 장려금 혜택</p>
                        <p className="text-sm font-extrabold text-white mt-0.5">연간 약 ₩{rewardYearly.toLocaleString()} 수령 가능</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded font-sans">
                        초과 {excessCount}명 분
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      *추가적으로 고용 한도를 초과하여 고용할 시 국가로부터 <strong>장애인 고용장려금(인당 월 35만~90만원)</strong>의 현금 지원금을 직접 지급받으실 수 있습니다.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Savings section (Only if shortage exists and there are savings) */}
            {shortage > 0 && !isExemptedFromFine ? (
              <div className="mt-8 bg-brand-green/80 border border-brand-accent/20 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-left animate-fadeIn">
                <div className="space-y-1">
                  <p className="text-[10px] text-brand-accent font-extrabold uppercase tracking-widest font-mono">
                    Yearly Net Business Benefit
                  </p>
                  <h4 className="text-xl sm:text-2.5xl font-sans font-black text-brand-accent">
                    연간 약 {netSavings.toLocaleString()}원 절감
                  </h4>
                  <p className="text-[11px] text-gray-200 font-sans leading-relaxed">
                    의무 미달로 휘발되던 무의미한 벌금을 법인세 감면 혜택을 갖춘 기업의 <strong>실질 경영 자원 및 ESG 인적 자본</strong>으로 전환한 결실입니다.
                  </p>
                </div>

                <div className="bg-brand-accent text-[#0A3D33] px-5 py-3 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 min-w-[110px] shadow-lg border border-white/15">
                  <span className="text-[10px] tracking-wider uppercase opacity-85 font-mono">Net Savings</span>
                  <span className="text-2.5xl font-black font-mono mt-0.5">{savingsPercent}%</span>
                </div>
              </div>
            ) : shortage > 0 && isExemptedFromFine ? (
              <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4.5 text-left text-xs text-gray-300 leading-relaxed font-sans space-y-1.5">
                <p className="font-bold text-brand-accent">💡 100인 미만 강소기업을 위한 베네피플 ESG 패키지 제안</p>
                <p>
                  현재 부담금 부과 대상은 아니지만, 베네피플을 통해 장애인 근로자를 간편 매칭할 경우 공공 입찰 가산점 획득, ESG 지속가능경영 공시 경쟁력 선점, 그리고 다양한 고용장려금 선제 매칭을 지원합니다.
                </p>
              </div>
            ) : null}

          </div>
        </div>

        {/* Actionable CTA Footer */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-xs sm:text-sm text-gray-300 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-lg">
          <ShieldCheck className="w-5 h-5 text-brand-accent animate-pulse" />
          <span className="font-sans">
            정밀 계산된 솔루션을 통해 고용 리스크를 완벽하게 해소하고, <strong>실질 재무 구조 개선</strong>을 이끌어 낼 수 있습니다.
          </span>
          <a
            href="#ai-diagnosis"
            className="text-brand-accent font-bold hover:underline flex items-center gap-1.5 ml-0.5 group font-sans"
          >
            지금 무료 1:1 정밀 리포트 진단받기 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}
