import { motion } from "motion/react";
import { UserPlus, FileCheck, Laptop, HelpCircle, ShieldAlert, ArrowRight } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      step: "01",
      icon: <UserPlus className="w-5 h-5 text-brand-green" />,
      title: "채용 및 매칭",
      desc: "직무 분석에 근거하여 기업에 꼭 알맞은 장애인 인재 1:1 면접 선발"
    },
    {
      step: "02",
      icon: <FileCheck className="w-5 h-5 text-brand-green" />,
      title: "계약 및 승인",
      desc: "근로기준 지침을 준수하는 합법적 계약 체결 및 유관기관 고용부담금 승인 처리"
    },
    {
      step: "03",
      icon: <Laptop className="w-5 h-5 text-brand-green" />,
      title: "통합 운영 관리",
      desc: "베네피플 ERP를 통해 직원현황, 근태관리, 성과관리 등 모든 업무를 지원합니다."
    },
    {
      step: "04",
      icon: <ShieldAlert className="w-5 h-5 text-brand-green" />,
      title: "행정 지원",
      desc: "매월 4대보험 급여 신고, 퇴직 정산 등 모든 복잡한 노무 해결"
    },
    {
      step: "05",
      icon: <HelpCircle className="w-5 h-5 text-brand-green" />,
      title: "사후 관리",
      desc: "정부 제출 자료 및 결원 등 위기 관리"
    }
  ];

  return (
    <section id="workflow" className="py-24 bg-[#F8FAF9] text-[#1A2E2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-lightgreen px-3 py-1 bg-brand-lightgreen/10 rounded-full font-bold">
            OUR WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-brand-green">
            One-Stop 고용 프로세스
          </h2>
          <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
            채용부터 근태 관리, 행정지원, 사후 리포트까지 베네피플이 전 과정을 전폭적으로 지원합니다.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white border border-gray-100 hover:border-brand-lightgreen/30 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center border border-gray-50 shadow-inner">
                    {item.icon}
                  </div>
                  <span className="font-mono text-sm font-black text-brand-accent">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-brand-green mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Arrow right on desktop */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-slate-200 hidden lg:block" aria-hidden="true">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Callout (Correction 7) */}
        <div className="bg-brand-green text-white rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-lg border border-white/10">
          <p className="text-sm sm:text-base font-bold text-[#EBB63F]">
            베네피플은 채용만 대행하고 무책임하게 방치하는 대행사가 아닙니다.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 mt-2">
            채용부터 행정 지원, 완벽한 사후관리까지 기업이 만족할 수 있도록 전 과정을 성실하게 책임지고 지원합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
