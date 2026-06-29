import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Award, LogOut, Check } from "lucide-react";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import WhySection from "./components/WhySection";
import PainPointsSection from "./components/PainPointsSection";
import ThreePillarsSection from "./components/ThreePillarsSection";
import BudgetCalculator from "./components/BudgetCalculator";
import WorkflowSection from "./components/WorkflowSection";
import ERPDemo from "./components/ERPDemo";
import ESGImpactSection from "./components/ESGImpactSection";
import AIDiagnosisSection from "./components/AIDiagnosisSection";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import { HomepageConfig } from "./types";
import Background3D from "./components/Background3D";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./lib/googleAuth";

const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroBadge: "대한민국 1등 장애인 고용 솔루션 파트너",
  heroTitle: "장애인 고용부담금 절감\n베네피플이 귀사의 성과로\n전환해 드립니다.",
  heroSubtitle: "21년 이상의 전문 아웃소싱 노하우와 맞춤형 장애인 인재 풀을 통해 채용부터 근태관리, 노무 행정까지 원스톱으로 진행합니다.",
  metric1Val: "21+",
  metric1Lab: "업무 및 아웃소싱 연혁",
  metric2Val: "25개",
  metric2Lab: "전국 거점 지사",
  metric3Val: "100%",
  metric3Lab: "노무 법적 무결점 승인",
  // Intro Section
  introBadge: "ABOUT · 베네피플",
  introTitle: "이름에 담은 약속, Benefit + People",
  introDesc: "베네피플은 '혜택(Benefit)'과 '사람(People)'을 더한 이름입니다.\n좋은 인재와 좋은 일터를 안전하고 투명하게 연결하여, 기업과 근로자 모두에게 윈윈(Win-Win)의 가치를 확실히 제공합니다.",
  introPillar1Title: "브랜드 의미",
  introPillar1Desc: "라틴어 Bene(좋은 · 이롭게)에서 출발해, 기업의 이익 창출과 사회공헌 활동 모두 중심에 '사람'을 둡니다.",
  introPillar2Title: "미션 · 비전",
  introPillar2Desc: "베네피플은 누구도 일에서 소외되지 않는 사회를 만들고, 장애인 고용을 단순 비용 지출이 아닌 경영 성과로 바꾸어 기업과 사회가 함께 성장하는 미래를 만듭니다.",
  introPillar3Title: "서비스 가치",
  introPillar3Desc: "장애가 있는 우수한 인재와 기업 고객을 정밀 매칭하고, 채용 · 노무 위탁 · 전용 ERP · 사후관리 전 과정을 합법적으로 완벽 일임하여 완벽히 행정 부담을 덜어드립니다.",
  // Why Section
  whyBadge: "THE REGULATORY CONTEXT",
  whyTitle: "왜 지금 장애인 고용인가?",
  whyDesc: "기업의 장애인 의무 고용은 단순한 도덕적 선택이 아닌, 강력한 법적 의무이자 ESG 경영의 중추적 핵심 요소입니다.",
  whyCard1Title: "의무고용률 지속 강화",
  whyCard1Desc: "100인 이상 사업장 장애인 의무고용율 3.1% 기준이 지속적으로 강화되고 있으며, 미준수 시 법적 제재 부담을 강하게 안게 됩니다.",
  whyCard2Title: "고용부담금 매년 인상",
  whyCard2Desc: "미달 인원당 최저임금 연동 제도가 적용되어, 연간 미달 인원에 부과되는 고용부담금 금액이 매년 고공 행진하고 있습니다.",
  whyCard3Title: "ESG 가이드라인 강화",
  whyCard3Desc: "공인 지속가능경영 평가에서 S(사회적 임팩트) 부문의 장애인 일자리 창출 실적 및 포용 고용 비중이 대폭 강화되고 있습니다.",
  whyCard4Title: "정부 점검 및 관리 강화",
  whyCard4Desc: "장애인 고용 및 실제 근무지의 실질적인 운영 실태와 가짜 고용 필터링에 대한 보건복지부/공단의 사후 현장 점검이 강화되고 있습니다.",
  whyRiskTitle: "장애인 고용 부재의 숨겨진 리스크",
  whyRiskDesc: "많은 기업이 막대한 부담금을 매년 납부하면서도, 정작 실질적인 맞춤형 직무와 체계적인 재택근무 관리 방법을 찾지 못해 매월 깊은 고충을 격하게 겪고 있는 것이 오늘날 대한민국 기업들의 냉정한 현실입니다.",
  // Pain Points Section
  painBadge: "PAIN POINTS",
  painTitle: "기업의 현실적인 고민",
  painDesc: "장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다.",
  painCaution: "고민하고 망설이는 동안에도, 부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다.",

  // General & Identity Defaults
  logoUrl: "", // Defaults to standard build assets if empty
  companyName: "Bene People",
  companyLogoText: "(주)베네피플",

  // Budget Calculator defaults
  calcBadge: "Interactive Budget Simulator",
  calcTitle: "우리 회사 예상 '장애인 고용 부담금' 및 절감액 계산기",
  calcDesc: "상시 근로자 수와 현재 장애인 고용 수를 입력하시면, 부담금 리스크와 베네피플 솔루션 도입 시의 정확한 연간 비용 절감액을 실시간으로 확인해 드립니다.",
  obligationRate: 0.031,
  finePerMonth: 2156880,
  beneCostPerMonth: 663000,
  savingsPercentFixed: 69,

  // Three Pillars Section defaults
  pillarsBadge: "OUR THREE PILLARS",
  pillarsTitle: "기업을 위한 Bene People 3대 솔루션",
  pillarsDesc: "비용, 법적 Risk, 사후 관리에 대해 기업별 맞춤형 솔루션을 완벽 제공합니다.",
  pillar1Title: "극적인 비용 절감 효과",
  pillar1Sub: "300명 기업 기준 연간 부담금 약 2.33억원 대비",
  pillar1Val: "약 1.61억원 SAVE",
  pillar1ValSub: "69% 극적 절감 효과",
  pillar2Title: "법무/노무 리스크 완전 배제",
  pillar2Sub: "노무사를 통한 철저하고 합법적인 계약 및 행정 관리",
  pillar2Val: "전문 공인노무사 합법 보증",
  pillar2ValSub: "의무고용 100% 정상 법적 승인",
  pillar3Title: "원스톱 스마트 운영 시스템",
  pillar3Sub: "기업 커스텀 고도화 웹&앱 모니터링 ERP 무상 지원",
  pillar3Val: "전용 근태 & 업무 ERP 무상 제공",
  pillar3ValSub: "안면인식 · 고유 IP · GPS 연동",

  // Workflow Section defaults
  workflowBadge: "OUR WORKFLOW",
  workflowTitle: "One-Stop 고용 프로세스",
  workflowDesc: "채용부터 근태 관리, 행정지원, 사후 리포트까지 베네피플이 전 과정을 전폭적으로 지원합니다.",
  workflowStep1Title: "채용 및 매칭",
  workflowStep1Desc: "직무 분석에 근거하여 기업에 꼭 알맞은 장애인 인재 1:1 면접 선발",
  workflowStep2Title: "계약 및 승인",
  workflowStep2Desc: "근로기준 지침을 준수하는 합법적 계약 체결 및 유관기관 고용부담 승인 처리",
  workflowStep3Title: "통합 운영 관리",
  workflowStep3Desc: "베네피플 ERP를 통해 직원현황, 근태관리, 성과관리 등 모든 업무를 지원합니다.",
  workflowStep4Title: "행정 지원",
  workflowStep4Desc: "매월 4대보험 급여 신고, 퇴직 정산 등 모든 복잡한 노무 해결",
  workflowStep5Title: "사후 관리",
  workflowStep5Desc: "정부 제출 자료 및 결원 등 위기 관리",
  workflowFooterTitle: "베네피플은 채용만 대행하고 무책임하게 방치하는 대행사가 아닙니다.",
  workflowFooterText: "채용부터 행정 지원, 완벽한 사후관리까지 기업이 만족할 수 있도록 전 과정을 성실하게 책임 지원합니다.",

  // ESG Impact Defaults
  esgBadge: "SUSTAINABLE ESG IMPACT",
  esgTitle: "ESG 경영의 완벽한 달성",
  esgDesc: "장애인 고용 솔루션은 기업의 직접적인 고정 비용 절감뿐만 아니라, 세계적인 핵심 평가 지표인 ESG의 3대 요소를 빈틈없이 충족합니다.",
  esgCard1Title: "친환경적인 근무 지원",
  esgCard1Desc: "재택 또는 근거리 원격 근무 포맷을 정밀 구축하여 출퇴근 차량 이동으로 유발되는 탄소 배출을 최소화하고 일회용품 감소 등 친환경 가치를 직접 실천합니다.",
  esgCard2Title: "중증 장애 취약 일자리 창출",
  esgCard2Desc: "경증 및 중증 장애인 모두에게 동등한 사회적 직업 활동의 소중한 기회를 확대합니다. 장애인의 경제적 자립 기반을 주체적으로 마련하며 사회적 보이지 않는 장벽을 극적으로 줄이고 배려와 포용 문화를 전격적으로 확산합니다.",
  esgCard3Title: "법적 의무 이행",
  esgCard3Desc: "공정하고 합법적인 절차를 통해 장애인 고용부담금(벌금) 발생 리스크를 완전히 예방합니다. 국가적 장애인 의무고용 법률적 기준을 완전 충족하여 기업의 지배구조 신뢰도와 대외 이미지를 확고하게 격상시킵니다.",

  // Footer Section defaults
  footerSlogan: "장애인 인재 채용부터 고용부담금 처리, 전용 ERP 시스템 무상 제공까지 — 베네피플이 채용 · 운영의 전 과정을 완벽히 책임지고 동행합니다.",
  companyOwner: "박성진",
  companyPhone: "02-1234-5678",
  companyFax: "02-1234-5679",
  companyEmail: "info@benepeople.com",
  companyAddress: "경기도 고양시 행신동 948-1 엘지프라자 7층 (본사 · 전국 25개 거점 운영)",
  footerCopyright: "© 2026 Bene People Inc. All rights reserved. 대한민국 No.1 장애인 고용 통합 위탁 솔루션."
};

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInCompany, setLoggedInCompany] = useState<string | null>(null);

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem("bene_people_homepage_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HomepageConfig;
        if (parsed.heroSubtitle && parsed.heroSubtitle.includes("원스톱으로 무결점 안전 처리합니다")) {
          parsed.heroSubtitle = parsed.heroSubtitle.replace("원스톱으로 무결점 안전 처리합니다", "원스톱으로 진행합니다");
        }
        return parsed;
      } catch (e) {
        return DEFAULT_HOMEPAGE_CONFIG;
      }
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  });

  // Load config from Firestore on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, "configs", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cloudConfig = docSnap.data() as HomepageConfig;
          if (cloudConfig.heroSubtitle && cloudConfig.heroSubtitle.includes("원스톱으로 무결점 안전 처리합니다")) {
            cloudConfig.heroSubtitle = cloudConfig.heroSubtitle.replace("원스톱으로 무결점 안전 처리합니다", "원스톱으로 진행합니다");
            // Sync the updated config back to Firestore
            await setDoc(docRef, cloudConfig);
          }
          setHomepageConfig(cloudConfig);
          localStorage.setItem("bene_people_homepage_config", JSON.stringify(cloudConfig));
        }
      } catch (err) {
        console.warn("Could not load homepage config from Firestore, using local cache:", err);
      }
    };
    loadConfig();
  }, []);

  const handleUpdateHomepageConfig = async (newConfig: HomepageConfig) => {
    setHomepageConfig(newConfig);
    localStorage.setItem("bene_people_homepage_config", JSON.stringify(newConfig));
    try {
      const docRef = doc(db, "configs", "homepage");
      await setDoc(docRef, newConfig);
    } catch (err) {
      console.error("Could not save homepage config to Firestore:", err);
    }
  };

  const handleResetHomepageConfig = async () => {
    setHomepageConfig(DEFAULT_HOMEPAGE_CONFIG);
    localStorage.setItem("bene_people_homepage_config", JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));
    try {
      const docRef = doc(db, "configs", "homepage");
      await setDoc(docRef, DEFAULT_HOMEPAGE_CONFIG);
    } catch (err) {
      console.error("Could not reset homepage config in Firestore:", err);
    }
  };

  const handleLogout = () => {
    setLoggedInCompany(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-bg scroll-smooth">
      {/* Brand Header */}
      <Header
        onLoginClick={() => setShowLogin(true)}
        loggedInCompany={loggedInCompany}
        onLogout={handleLogout}
        config={homepageConfig}
      />

      {/* Login Welcome Banner if logged in */}
      {loggedInCompany && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-accent text-brand-green font-bold text-xs py-2 px-4 text-center sticky top-[60px] z-40 flex items-center justify-center gap-2 shadow-md border-b border-amber-300"
        >
          <Check className="w-4 h-4" />
          <span>현재 [ {loggedInCompany} ] 계정으로 인증되었습니다. 회원사 맞춤 ERP 혜택이 적용됩니다!</span>
          <button
            onClick={handleLogout}
            className="underline ml-4 text-[10px] hover:text-[#073B31]/80 flex items-center gap-1 font-extrabold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> 로그아웃
          </button>
        </motion.div>
      )}

      {loggedInCompany === "최고관리자 (ADMIN)" ? (
        /* If Admin logs in, ONLY show the Admin Dashboard Program Workspace */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 pt-24 pb-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdminDashboard
              homepageConfig={homepageConfig}
              onUpdateHomepageConfig={handleUpdateHomepageConfig}
              onResetHomepageConfig={handleResetHomepageConfig}
            />
          </div>
        </motion.div>
      ) : loggedInCompany ? (
        /* If corporate logged in, ONLY show the ERP Program Workspace */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 pt-24 pb-12 bg-[#04241E] relative overflow-hidden min-h-screen"
        >
          <Background3D />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ERPDemo loggedInCompany={loggedInCompany} />
          </div>
        </motion.div>
      ) : (
        /* Else, show the entire Landing and Homepage */
        <div className="relative z-10 bg-[#04241E]">
          {/* 3D Moving Interactive Canvas Background */}
          <Background3D />

          {/* Hero Banner Section */}
          <section className="relative min-h-screen bg-transparent text-white flex items-center justify-center pt-28 pb-20 overflow-hidden">

            {/* Glowing aura decorations */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#EBB63F]/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Text Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs sm:text-sm font-bold text-brand-accent tracking-wide uppercase">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  {homepageConfig.heroBadge}
                </div>

                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.3] tracking-tight whitespace-pre-line">
                  {homepageConfig.heroTitle.split("베네피플").map((part, index, array) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <span className="text-brand-accent">
                          베네피플
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h1>

                <p className="text-gray-300 text-sm sm:text-base xl:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
                  {homepageConfig.heroSubtitle}
                </p>

                {/* Quick trust metrics */}
                <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">{homepageConfig.metric1Val}</span>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{homepageConfig.metric1Lab}</p>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">{homepageConfig.metric2Val}</span>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{homepageConfig.metric2Lab}</p>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">{homepageConfig.metric3Val}</span>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{homepageConfig.metric3Lab}</p>
                  </div>
                </div>
              </div>

              {/* Right Visual Floating Card */}
              <div className="lg:col-span-5 relative hidden lg:block">
                <div className="bg-gradient-to-br from-brand-lightgreen/30 to-[#073B31] border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#EBB63F]/5 rounded-full filter blur-xl"></div>
                  
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                    <div className="p-2 bg-brand-accent/20 rounded-lg text-brand-accent">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">베네피플 안전 고용 보증</h3>
                      <span className="text-[9px] text-gray-400 font-mono">Employment Guarantee Level S</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        <strong>합법적 의무고용 승인:</strong> 전담 공인 노무사가 상시 근무 실태 조사를 밀착 대조하여 관공서 인증을 대행합니다.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        <strong>대리 리스크 zero:</strong> 일체의 4대보험, 퇴직금, 행정 잡무는 베네피플 전용 서포트단이 무료로 처리합니다.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        <strong>지능형 GPS ERP:</strong> 지적장애 및 지체장애 보정 GPS 체크가 완비된 특화 출퇴근 연동 앱을 무상 지원합니다.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic decorative seal */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">BENEPEOPLE TRUST CERTIFICATE</span>
                    <div className="flex items-center gap-1 text-xs font-black text-brand-accent">
                      <Award className="w-4 h-4" />
                      <span>KOREA NO.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Intro Section */}
          <IntroSection config={homepageConfig} />

          {/* 3. Why Section */}
          <WhySection config={homepageConfig} />

          {/* 4. Pain Points Section */}
          <PainPointsSection config={homepageConfig} />

          {/* 5. Three Pillars Section */}
          <ThreePillarsSection config={homepageConfig} />

          {/* 6. Budget Calculator */}
          <BudgetCalculator config={homepageConfig} />

          {/* 7. Workflow Process Section */}
          <WorkflowSection config={homepageConfig} />

          {/* 8. ERP Program Simulator */}
          <ERPDemo />

          {/* 9. ESG Impact Section */}
          <ESGImpactSection config={homepageConfig} />

          {/* 10. AI Diagnostics Consultation Form */}
          <AIDiagnosisSection config={homepageConfig} />

          {/* Brand Footer */}
          <Footer config={homepageConfig} />
        </div>
      )}

      {/* LoginPage Modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
            onLoginSuccess={(company) => {
              const sanitizedCompany = company.replace("데모 ", "").replace("데모", "");
              setLoggedInCompany(sanitizedCompany);
              setShowLogin(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
