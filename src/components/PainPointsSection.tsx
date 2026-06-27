import { motion } from "motion/react";
import { HelpCircle, AlertCircle } from "lucide-react";
import { HomepageConfig } from "../types";

interface PainPointsSectionProps {
  config?: HomepageConfig;
}

export default function PainPointsSection({ config }: PainPointsSectionProps) {
  const painBadge = config?.painBadge || "PAIN POINTS";
  const painTitle = config?.painTitle || "기업의 현실적인 고민";
  const painDesc = config?.painDesc || "장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다.";
  const painCaution = config?.painCaution || "고민하고 망설이는 동안에도, 부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다.";

  const qas = [
    {
      id: "qa-1",
      q: "적합한 직무 역량을 갖춘 장애인 인재를 구하기 어렵습니다.",
      a: "베네피플은 기업 고객이 원하는 맞춤형 장애인 인재를 매칭합니다."
    },
    {
      id: "qa-2",
      q: "장애인의 일일 업무 진행과 근태 관리는 누가 담당하나요?",
      a: "베네피플이 무상 제공하는 스마트 근태 시스템(ERP)과 당사 전담 수석 코디네이터가 1:1 관리를 대행합니다."
    },
    {
      id: "qa-3",
      q: "채용은 두렵고, 차라리 고용부담금을 그대로 내는 것이 마음 편할까요?",
      a: "연간 부담금을 대폭 절감하여 훨씬 효과적으로 전환하는 것이 합리적이며 정답입니다."
    },
    {
      id: "qa-4",
      q: "복잡한 법적 노무 관리와 4대보험, 퇴직금 처리는 어떻게 하나요?",
      a: "베네피플의 전담 공인노무사를 통해 법적 Risk 부담을 완벽히 해소합니다."
    },
    {
      id: "qa-5",
      q: "채용 이후 발생할 수 있는 중도 퇴사 등 사후관리가 부담됩니다.",
      a: "베네피플의 사후 관리 시스템은 퇴사자 사전 면담, overlapping 근무 등을 통해 위기 상황에 신속하게 선대응합니다."
    },
    {
      id: "qa-6",
      q: "어떤 직종이나 원격 업무를 할당해야 하는지도 도무지 잘 모르겠습니다.",
      a: "베네피플은 음악, 미술, 체육, 기타 사무 분야 등 다양한 직종의 장애인 우수 인재풀을 안정적으로 운영하고 있습니다."
    }
  ];

  return (
    <section id="pain-points" className="py-24 bg-transparent text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-brand-accent/10 rounded-full font-bold">
            {painBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-white">
            {painTitle}
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
            {painDesc}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {qas.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#0D5C4E]/25 backdrop-blur-md border border-white/5 hover:border-brand-accent/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl transition duration-300 relative group"
            >
              {/* Question */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 text-xs font-bold font-mono">
                    Q
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {item.q}
                  </h3>
                </div>

                {/* Answer box */}
                <div className="bg-white/[0.03] border-l-4 border-brand-accent p-4 rounded-r-xl">
                  <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed font-sans">
                    {item.a}
                  </p>
                </div>
              </div>

              {/* Number tag */}
              <div className="mt-4 flex justify-end">
                <span className="text-gray-700/40 group-hover:text-brand-accent/20 transition text-4xl font-black font-mono tracking-tighter select-none">
                  0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom caution box */}
        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 text-center max-w-2xl mx-auto flex items-center justify-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-brand-accent shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-amber-200">
            {painCaution}
          </span>
        </div>
      </div>
    </section>
  );
}
