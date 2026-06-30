import { motion } from "motion/react";
import { UserPlus, FileCheck, Laptop, HelpCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { HomepageConfig } from "../types";

interface WorkflowSectionProps {
  config?: HomepageConfig;
}

export default function WorkflowSection({ config }: WorkflowSectionProps) {
  const badge = config?.workflowBadge || "OUR WORKFLOW";
  const title = config?.workflowTitle || "One-Stop 고용 프로세스";
  const desc = config?.workflowDesc || "채용부터 근태 관리, 행정지원, 사후 리포트까지 베네피플이 전 과정을 전폭적으로 지원합니다.";

  const step1Title = config?.workflowStep1Title || "채용 및 매칭";
  const step1Desc = config?.workflowStep1Desc || "직무 분석에 근거하여 기업에 꼭 알맞은 장애인 인재 1:1 면접 선발";

  const step2Title = config?.workflowStep2Title || "계약 및 승인";
  const step2Desc = config?.workflowStep2Desc || "근로기준 지침을 준수하는 합법적 계약 체결 및 유관기관 고용부담 승인 처리";

  const step3Title = config?.workflowStep3Title || "통합 운영 관리";
  const step3Desc = config?.workflowStep3Desc || "베네피플 통합 근태시스템을 통해 직원현황, 근태관리, 성과관리 등 모든 업무를 지원합니다.";

  const step4Title = config?.workflowStep4Title || "행정 지원";
  const step4Desc = config?.workflowStep4Desc || "매월 4대보험 급여 신고, 퇴직 정산 등 모든 복잡한 노무 해결";

  const step5Title = config?.workflowStep5Title || "사후 관리";
  const step5Desc = config?.workflowStep5Desc || "정부 제출 자료 및 결원 등 위기 관리";

  const footerTitle = config?.workflowFooterTitle || "베네피플은 채용만 대행하고 무책임하게 방치하는 대행사가 아닙니다.";
  const footerText = config?.workflowFooterText || "채용부터 행정 지원, 완벽한 사후관리까지 기업이 만족할 수 있도록 전 과정을 성실하게 책임 지원합니다.";

  const steps = [
    {
      step: "01",
      icon: <UserPlus className="w-5 h-5 text-brand-green" />,
      title: step1Title,
      desc: step1Desc
    },
    {
      step: "02",
      icon: <FileCheck className="w-5 h-5 text-brand-green" />,
      title: step2Title,
      desc: step2Desc
    },
    {
      step: "03",
      icon: <Laptop className="w-5 h-5 text-brand-green" />,
      title: step3Title,
      desc: step3Desc
    },
    {
      step: "04",
      icon: <ShieldAlert className="w-5 h-5 text-brand-green" />,
      title: step4Title,
      desc: step4Desc
    },
    {
      step: "05",
      icon: <HelpCircle className="w-5 h-5 text-brand-green" />,
      title: step5Title,
      desc: step5Desc
    }
  ];

  return (
    <section id="workflow" className="py-24 bg-transparent text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-brand-accent/10 rounded-full font-bold">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-white">
            {title}
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            {desc}
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-[#0D5C4E]/25 backdrop-blur-md border border-white/5 hover:border-brand-accent/30 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition duration-300 relative group"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner text-brand-accent">
                    {item.icon}
                  </div>
                  <span className="font-mono text-sm font-black text-brand-accent">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              {/* Arrow right on desktop */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-gray-600 hidden lg:block" aria-hidden="true">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Callout (Correction 7) */}
        <div className="bg-[#0D5C4E]/40 backdrop-blur-md text-white rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xl border border-white/5">
          <p className="text-sm sm:text-base font-bold text-[#EBB63F]">
            {footerTitle}
          </p>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-sans">
            {footerText}
          </p>
        </div>
      </div>
    </section>
  );
}
