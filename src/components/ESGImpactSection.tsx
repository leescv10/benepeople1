import { motion } from "motion/react";
import { Leaf, Heart, Scale } from "lucide-react";

export default function ESGImpactSection() {
  const pillars = [
    {
      id: "esg-env",
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      tag: "Environment",
      title: "친환경적인 근무 지원",
      desc: "재택 또는 근거리 원격 근무 포맷을 정밀 구축하여 출퇴근 차량 이동으로 유발되는 탄소 배출을 최소화하고 일회용품 감소 등 친환경 가치를 직접 실천합니다."
    },
    {
      id: "esg-soc",
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      tag: "Social",
      title: "중증 장애 취약 일자리 창출",
      desc: "경증 및 중증 장애인 모두에게 동등한 사회적 직업 활동의 소중한 기회를 확대합니다. 장애인의 경제적 자립 기반을 주체적으로 마련하며 사회적 보이지 않는 장벽을 극적으로 줄이고 배려와 포용 문화를 전격적으로 확산합니다."
    },
    {
      id: "esg-gov",
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      tag: "Governance",
      title: "법적 의무 이행",
      desc: "공정하고 합법적인 절차를 통해 장애인 고용부담금(벌금) 발생 리스크를 완전히 예방합니다. 국가적 장애인 의무고용 법률적 기준을 완전 충족하여 기업의 지배구조 신뢰도와 대외 이미지를 확고하게 격상시킵니다."
    }
  ];

  return (
    <section id="esg" className="py-24 bg-white text-[#1A2E2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-lightgreen px-3 py-1 bg-brand-lightgreen/10 rounded-full font-bold">
            SUSTAINABLE ESG IMPACT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-brand-green">
            ESG 경영의 완벽한 달성
          </h2>
          <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
            장애인 고용 솔루션은 기업의 직접적인 고정 비용 절감뿐만 아니라, 세계적인 핵심 평가 지표인 ESG의 3대 요소를 빈틈없이 충족합니다.
          </p>
        </div>

        {/* 3 Pillars grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((item, idx) => (
            <div
              key={item.id}
              className="bg-brand-bg border border-gray-100 hover:border-brand-lightgreen/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-50 flex items-center justify-center shadow-inner group-hover:scale-105 transition duration-300">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-black tracking-widest text-gray-400 uppercase">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-green mb-3">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>포용적 ESG 경영 실현</span>
                <span className="font-mono font-bold">0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
