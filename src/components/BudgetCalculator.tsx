import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function BudgetCalculator() {
  const [employees, setEmployees] = useState<number>(300);
  const [currentDisabled, setCurrentDisabled] = useState<number>(0);

  // Legal requirement is 3.1% under standard Korean corporate mandate
  const legalRequired = Math.floor(employees * 0.031);
  const shortage = Math.max(0, legalRequired - currentDisabled);

  // Severe penalty level (when disabled employment is zero/low): ~2,156,880 KRW per month per missing person
  const finePerMonth = 2156880;
  const pureFineYearly = shortage * finePerMonth * 12;

  // Bene People total fee (including salary + support admin fees): 663,000 KRW per month
  const beneCostPerMonth = 663000;
  const beneCostYearly = shortage * beneCostPerMonth * 12;

  const netSavings = pureFineYearly - beneCostYearly;
  const savingsPercent = pureFineYearly > 0 ? 69 : 0;

  return (
    <section id="calculator" className="py-20 bg-brand-green text-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EBB63F] rounded-full filter blur-[120px] opacity-10 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0D5C4E] rounded-full filter blur-[100px] opacity-20 -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-white/10 rounded-full">
            Interactive Budget Simulator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 text-white">
            우리 회사 예상 <span className="text-brand-accent">'장애인 고용 부담금'</span> 및 절감액 계산기
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
            상시 근로자 수와 현재 장애인 고용 수를 입력하시면, 부담금 리스크와 베네피플 솔루션 도입 시의 정확한 연간 비용 절감액을 실시간으로 확인해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left panel: Inputs */}
          <div className="lg:col-span-5 bg-white text-[#1A2E2A] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-brand-green">실질 시뮬레이션 상세 조건</h3>
              </div>

              {/* Slider 1: Total Employees */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">상시 근로자 수</label>
                  <span className="text-xl font-bold text-brand-green font-mono">{employees.toLocaleString()}명</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={employees}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setEmployees(val);
                    // Reset current disabled if it exceeds new legal max
                    const newMax = Math.floor(val * 0.031);
                    if (currentDisabled > newMax) {
                      setCurrentDisabled(newMax);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
                  <span>50명</span>
                  <span>300명 (평균)</span>
                  <span>1,000명</span>
                </div>
              </div>

              {/* Slider 2: Current Disabled Employees */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">현재 장애인 고용 수</label>
                  <span className="text-xl font-bold text-brand-green font-mono">{currentDisabled}명</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(1, legalRequired)}
                  step="1"
                  value={currentDisabled}
                  onChange={(e) => setCurrentDisabled(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                  disabled={legalRequired === 0}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
                  <span>0명</span>
                  <span>의무 인원수 비례 ({legalRequired}명)</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-bg p-4 rounded-xl border border-brand-green/10 mt-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-lightgreen shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                장애인 의무고용률은 민간기업 기준 <strong>3.1%</strong>입니다. 50인 이상 의무고용이지만, 100인 이상 기업부터 실제 미충족 인원에 수치 구간별로 가산된 부담금이 연단위로 징수됩니다.
              </p>
            </div>
          </div>

          {/* Right panel: Live Estimate Feed */}
          <div className="lg:col-span-7 bg-brand-lightgreen/50 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <span className="text-xs font-mono font-medium tracking-wider text-brand-accent uppercase bg-white/10 px-2.5 py-1 rounded">
                  Live Estimate Feed
                </span>
                <span className="text-xs text-gray-300">연간 분석 기준</span>
              </div>

              {/* Summary stat row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-300">법정 의무고용 인원</p>
                  <p className="text-lg sm:text-xl font-bold text-brand-accent mt-1 font-mono">{legalRequired}명</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-300">현재 부족 인원수</p>
                  <p className="text-lg sm:text-xl font-bold text-red-400 mt-1 font-mono">{shortage}명</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-300">베네피플 도입 비용율</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-1 font-mono">약 31% 수준</p>
                </div>
              </div>

              {/* Visualization bars */}
              <div className="space-y-6">
                {/* Before bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                    <span className="text-gray-300 font-medium">베네피플 솔루션 도입 전 (장애인 고용 부담금)</span>
                    <span className="text-red-400 font-bold font-mono">연 약 {pureFineYearly.toLocaleString()}원</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-red-400 h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: shortage > 0 ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">솔루션 도입 없을 시 (순수 벌금 부과액)</p>
                </div>

                {/* After bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                    <span className="text-gray-300 font-medium">베네피플 솔루션 도입 후 (임금 + 위탁수수료)</span>
                    <span className="text-emerald-400 font-bold font-mono">연 약 {beneCostYearly.toLocaleString()}원</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-emerald-400 h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: shortage > 0 ? "31%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">베네피플 풀패키지 도입 시 (임금 + 위탁수수료 총합)</p>
                </div>
              </div>
            </div>

            {/* Savings section */}
            <div className="mt-8 bg-brand-green/80 border border-brand-accent/20 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-300 uppercase tracking-wider font-mono">Yearly Net Savings</p>
                <h4 className="text-xl sm:text-2xl font-black text-brand-accent mt-1">
                  연간 약 {netSavings.toLocaleString()}원 절감
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  단순 벌금으로 휘발될 세금을 경영 자원으로 온전히 전환 회수하는 가치입니다.
                </p>
              </div>

              <div className="bg-brand-accent text-brand-green px-5 py-3 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 min-w-[100px] shadow-md">
                <span className="text-[11px] tracking-widest uppercase opacity-75">Savings Ratio</span>
                <span className="text-2xl font-black font-mono mt-0.5">{savingsPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-4 text-center text-xs sm:text-sm text-gray-300 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-accent" />
          <span>장애인 고용 부담금을 대폭 절감하여 <strong>경영 성과</strong>로 확실하게 전환할 수 있습니다.</span>
          <a
            href="#ai-diagnosis"
            className="text-brand-accent font-bold hover:underline flex items-center gap-1.5 ml-0.5"
          >
            지금 무료 1:1 맞춤 진단받기 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
