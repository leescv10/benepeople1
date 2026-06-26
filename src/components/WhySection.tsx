import { motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, TrendingUp, Users, ShieldAlert } from "lucide-react";

export default function WhySection() {
  const cards = [
    {
      id: "why-1",
      icon: <TrendingUp className="w-6 h-6 text-brand-lightgreen" />,
      title: "의무고용률 지속 강화",
      desc: "100인 이상 사업장 장애인 의무고용율 3.1% 기준이 지속적으로 강화되고 있으며, 미준수 시 법적 제재 부담을 강하게 안게 됩니다."
    },
    {
      id: "why-2",
      icon: <ShieldAlert className="w-6 h-6 text-brand-lightgreen" />,
      title: "고용부담금 매년 인상",
      desc: "미달 인원당 최저임금 연동 제도가 적용되어, 연간 미달 인원에 부과되는 고용부담금 금액이 매년 고공 행진하고 있습니다."
    },
    {
      id: "why-3",
      icon: <Users className="w-6 h-6 text-brand-lightgreen" />,
      title: "ESG 가이드라인 강화",
      desc: "공인 지속가능경영 평가에서 S(사회적 임팩트) 부문의 장애인 일자리 창출 실적 및 포용 고용 비중이 대폭 강화되고 있습니다."
    },
    {
      id: "why-4",
      icon: <AlertTriangle className="w-6 h-6 text-brand-lightgreen" />,
      title: "정부 점검 및 관리 강화",
      desc: "장애인 고용 및 실제 근무지의 실질적인 운영 실태와 가짜 고용 필터링에 대한 보건복지부/공단의 사후 현장 점검이 강화되고 있습니다."
    }
  ];

  return (
    <section id="why" className="py-24 bg-white text-[#1A2E2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-lightgreen px-3 py-1 bg-brand-lightgreen/10 rounded-full font-bold">
            THE REGULATORY CONTEXT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-brand-green">
            왜 지금 장애인 고용인가?
          </h2>
          <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
            기업의 장애인 의무 고용은 단순한 도덕적 선택이 아닌, 강력한 법적 의무이자 ESG 경영의 중추적 핵심 요소입니다.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="bg-brand-bg hover:bg-white border border-gray-100 hover:border-brand-lightgreen/20 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6 group-hover:scale-105 transition duration-300">
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-green mb-3">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <span className="text-slate-300 group-hover:text-brand-lightgreen transition font-mono text-xs font-bold flex items-center gap-1">
                  0{idx + 1} <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlighted block (Correction 4) */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 sm:p-8 flex items-start gap-4 max-w-4xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-red-950 text-sm sm:text-base">장애인 고용 부재의 숨겨진 리스크</h4>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed mt-2.5">
              많은 기업이 막대한 부담금을 매년 납부하면서도, 정작 <strong>실질적인 맞춤형 직무</strong>와 <strong>체계적인 재택근무 관리 방법</strong>을 찾지 못해 매월 깊은 고충을 격하게 겪고 있는 것이 오늘날 대한민국 기업들의 냉정한 현실입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
