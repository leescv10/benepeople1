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
import TermsModal from "./components/TermsModal";
import AdminDashboard from "./components/AdminDashboard";
import { HomepageConfig } from "./types";
import Background3D from "./components/Background3D";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/googleAuth";

const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroBadge: "장애인 고용 솔루션 파트너",
  heroTitle: "장애인 고용부담금\n베네피플이 귀사의 성과로\n전환해 드립니다.",
  heroSubtitle: "21년 이상의 전문 아웃소싱 노하우와 맞춤형 장애인 인재 풀을 통해 채용부터 근태관리,\n노무 행정까지 원스톱으로 진행합니다.",
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
  introPillar3Desc: "장애가 있는 우수한 인재와 기업 고객을 정밀 매칭하고, 채용 · 노무 위탁 · 전용 근태시스템 · 사후관리 전 과정을 합법적으로 일임하여 행정 부담을 덜어 드립니다.",
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
  whyRiskTitle: "장애인 고용 리스크",
  whyRiskDesc: "많은 기업이 막대한 부담금을 매년 납부하면서 장애인 고용과 체계적인 관리 방법을 찾지 못해서 깊은 고충을 겪고 있습니다.",
  // Pain Points Section
  painBadge: "PAIN POINTS",
  painTitle: "기업의 현실적인 고민",
  painDesc: "장애인 고용에는 생각보다 다양하고, 복잡한 문제가 존재합니다.",
  painCaution: "고민하고 망설이는 동안에도, 부담금은 매년 세금처럼 증가하고 있습니다.",

  // General & Identity Defaults
  logoUrl: "", // Defaults to standard build assets if empty
  companyName: "BenePeople",
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
  pillarsTitle: "기업을 위한 BenePeople 3대 솔루션",
  pillarsDesc: "비용, 법적 Risk, 사후 관리에 대해 기업별 맞춤형 솔루션을 제공합니다.",
  pillar1Title: "비용 절감 효과",
  pillar1Sub: "300명 기업 기준 연간 부담금 약 2.33억원 대비",
  pillar1Val: "약 1.61억원 SAVE",
  pillar1ValSub: "69% 극적 절감 효과",
  pillar2Title: "법무/노무 리스크 해소",
  pillar2Sub: "노무사를 통한 철저하고 합법적인 계약 및 행정 관리",
  pillar2Val: "전문 공인노무사 합법 보증",
  pillar2ValSub: "의무고용 100% 정상 법적 승인",
  pillar3Title: "베네피플 Performance Dashbord",
  pillar3Sub: "매월 고객사에 운영 현황을 제공되는 리포트 시스템.",
  pillar3Val: "월별 장애인 고용 리포트 제공",
  pillar3ValSub: "직무 · 근태 · 성과 일괄 관리",

  // Workflow Section defaults
  workflowBadge: "OUR WORKFLOW",
  workflowTitle: "One-Stop 고용 프로세스",
  workflowDesc: "채용부터 근태 관리, 행정지원, 사후 리포트까지 베네피플이 전 과정을 전폭적으로 지원합니다.",
  workflowStep1Title: "채용 및 매칭",
  workflowStep1Desc: "직무 분석에 근거하여 기업에 꼭 알맞은 장애인 인재 1:1 면접 선발",
  workflowStep2Title: "계약 및 승인",
  workflowStep2Desc: "근로기준 지침을 준수하는 합법적 계약 체결 및 유관기관 고용부담 승인 처리",
  workflowStep3Title: "통합 운영 관리",
  workflowStep3Desc: "베네피플 통합 근태관리 시스템을 통해 직원현황, 근태관리, 성과관리 등 모든 업무를 지원합니다.",
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
  esgCard3Desc: "공정하고 합법적인 절차를 통해 장애인 고용부담금 발생 리스크를 완전히 예방합니다. 국가적 장애인 의무고용 법률적 기준을 완전 충족하여 기업의 지배구조 신뢰도와 대외 이미지를 확고하게 격상시킵니다.",

  // Footer Section defaults
  footerSlogan: "장애인 인재 채용부터 고용부담금 처리, 전용 근태관리 시스템 무상 제공까지 — 베네피플이 채용 · 운영의 전 과정을 완벽히 책임지고 동행합니다.",
  companyOwner: "박성진",
  companyPhone: "02-1234-5678",
  companyFax: "02-1234-5679",
  companyEmail: "info@benepeople.com",
  companyAddress: "경기도 고양시 행신동 948-1 엘지프라자 7층 (본사 · 전국 25개 거점 운영)",
  footerCopyright: "© 2026 BenePeople Inc. All rights reserved. 대한민국 No.1 장애인 고용 통합 위탁 솔루션."
};

const cleanBenePeopleText = (str: string): string => {
  if (typeof str !== "string") return str;
  return str.replace(/Bene\s+People/gi, "BenePeople");
};

const cleanBenePeopleObj = <T extends Record<string, any>>(obj: T): T => {
  if (!obj || typeof obj !== "object") return obj;
  const newObj = { ...obj };
  for (const key in newObj) {
    if (typeof newObj[key] === "string") {
      newObj[key] = cleanBenePeopleText(newObj[key]) as any;
    } else if (newObj[key] && typeof newObj[key] === "object") {
      newObj[key] = cleanBenePeopleObj(newObj[key]);
    }
  }
  return newObj;
};

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [badgeClicks, setBadgeClicks] = useState(0);
  const [loggedInCompany, setLoggedInCompany] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeTermsTab, setActiveTermsTab] = useState<"terms" | "privacy">("terms");

  const handleOpenTerms = (tab: "terms" | "privacy") => {
    setActiveTermsTab(tab);
    setIsTermsOpen(true);
  };

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem("bene_people_homepage_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as HomepageConfig;
          const merged = { ...DEFAULT_HOMEPAGE_CONFIG, ...parsed };
          if (merged.heroSubtitle && merged.heroSubtitle.includes("원스톱으로 무결점 안전 처리합니다")) {
            merged.heroSubtitle = merged.heroSubtitle.replace("원스톱으로 무결점 안전 처리합니다", "원스톱으로 진행합니다");
          }
          if (merged.heroSubtitle && merged.heroSubtitle.includes("근태관리, 노무 행정까지")) {
            merged.heroSubtitle = merged.heroSubtitle.replace("근태관리, 노무 행정까지", "근태관리,\n노무 행정까지");
          }
          if (merged.heroTitle && merged.heroTitle.includes("장애인 고용부담금 절감")) {
            merged.heroTitle = merged.heroTitle.replace("장애인 고용부담금 절감", "장애인 고용부담금");
          }
          if (merged.heroBadge === "대한민국 1등 장애인 고용 솔루션 파트너" || merged.heroBadge === "장애인 고용 솔류션 파트너" || !merged.heroBadge) {
            merged.heroBadge = "장애인 고용 솔루션 파트너";
          }
          if (merged.introPillar3Desc && merged.introPillar3Desc.includes("완벽 일임하여 완벽히 행정 부담을 덜어드립니다")) {
            merged.introPillar3Desc = merged.introPillar3Desc.replace("완벽 일임하여 완벽히 행정 부담을 덜어드립니다", "일임하여 행정 부담을 덜어 드립니다");
          }
          if (merged.whyRiskTitle && (merged.whyRiskTitle.includes("장애인 고용 부재의 숨겨진 리스크") || merged.whyRiskTitle === "장애인 고용 부재의 숨겨진 리스크")) {
            merged.whyRiskTitle = "장애인 고용 리스크";
          }
          if (merged.whyRiskDesc && (merged.whyRiskDesc.includes("많은 기업이 막대한 부담금을 매년 납부하면서도, 정작 실질적인 맞춤형 직무와 체계적인 재택근무 관리 방법을 찾지 못해 매월 깊은 고충을 격하게 겪고 있는") || merged.whyRiskDesc.includes("오늘날 대한민국 기업들의 냉정한 현실입니다"))) {
            merged.whyRiskDesc = "많은 기업이 막대한 부담금을 매년 납부하면서 장애인 고용과 체계적인 관리 방법을 찾지 못해서 깊은 고충을 겪고 있습니다.";
          }
          if (merged.painDesc && (merged.painDesc.includes("장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다") || merged.painDesc === "장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다.")) {
            merged.painDesc = "장애인 고용에는 생각보다 다양하고, 복잡한 문제가 존재합니다.";
          }
          if (merged.painCaution && merged.painCaution.includes("부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다")) {
            merged.painCaution = merged.painCaution.replace("부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다", "부담금은 매년 세금처럼 증가하고 있습니다");
          }
          if (merged.pillarsDesc && merged.pillarsDesc.includes("기업별 맞춤형 솔루션을 완벽 제공합니다")) {
            merged.pillarsDesc = merged.pillarsDesc.replace("기업별 맞춤형 솔루션을 완벽 제공합니다", "기업별 맞춤형 솔루션을 제공합니다");
          }
          if (merged.pillar1Title && merged.pillar1Title.includes("극적인 비용 절감 효과")) {
            merged.pillar1Title = "비용 절감 효과";
          }
          if (merged.pillar2Title && merged.pillar2Title.includes("법무/노무 리스크 완전 배제")) {
            merged.pillar2Title = "법무/노무 리스크 해소";
          }
          if (merged.pillar3Title && (merged.pillar3Title.includes("원스톱 스마트 운영 시스템") || merged.pillar3Title === "원스톱 스마트 운영 시스템")) {
            merged.pillar3Title = "베네피플 Performance Dashbord";
          }
          if (merged.pillar3Sub && (merged.pillar3Sub.includes("기업 커스텀 고도화 웹&앱 모니터링 시스템 무상 지원") || merged.pillar3Sub.includes("웹&앱 모니터링 시스템") || merged.pillar3Sub === "기업 커스텀 고도화 웹&앱 모니터링 시스템 무상 지원")) {
            merged.pillar3Sub = "매월 고객사에 운영 현황을 제공되는 리포트 시스템.";
          }
          if (merged.logoUrl && (merged.logoUrl.includes("benepeople_logo") || merged.logoUrl.includes("benepeople_new_logo") || merged.logoUrl.includes("bene_brand_logo"))) {
            merged.logoUrl = "";
          }
          return cleanBenePeopleObj(merged);
        } catch (e) {
          return cleanBenePeopleObj(DEFAULT_HOMEPAGE_CONFIG);
        }
      }
    } catch (err) {
      console.warn("Could not read from localStorage on initialization:", err);
    }
    return cleanBenePeopleObj(DEFAULT_HOMEPAGE_CONFIG);
  });

  // Load config from Firestore on mount with real-time updates
  useEffect(() => {
    const docRef = doc(db, "configs", "homepage");
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          const cloudConfig = { ...DEFAULT_HOMEPAGE_CONFIG, ...docSnap.data() } as HomepageConfig;
          let changed = false;
          if (cloudConfig.logoUrl && (cloudConfig.logoUrl.includes("benepeople_logo") || cloudConfig.logoUrl.includes("benepeople_new_logo") || cloudConfig.logoUrl.includes("bene_brand_logo"))) {
            cloudConfig.logoUrl = "";
            changed = true;
          }
          if (cloudConfig.heroSubtitle && cloudConfig.heroSubtitle.includes("원스톱으로 무결점 안전 처리합니다")) {
            cloudConfig.heroSubtitle = cloudConfig.heroSubtitle.replace("원스톱으로 무결점 안전 처리합니다", "원스톱으로 진행합니다");
            changed = true;
          }
          if (cloudConfig.heroSubtitle && cloudConfig.heroSubtitle.includes("근태관리, 노무 행정까지")) {
            cloudConfig.heroSubtitle = cloudConfig.heroSubtitle.replace("근태관리, 노무 행정까지", "근태관리,\n노무 행정까지");
            changed = true;
          }
          if (cloudConfig.heroTitle && cloudConfig.heroTitle.includes("장애인 고용부담금 절감")) {
            cloudConfig.heroTitle = cloudConfig.heroTitle.replace("장애인 고용부담금 절감", "장애인 고용부담금");
            changed = true;
          }
          if (cloudConfig.heroBadge === "대한민국 1등 장애인 고용 솔루션 파트너" || cloudConfig.heroBadge === "장애인 고용 솔류션 파트너" || !cloudConfig.heroBadge) {
            cloudConfig.heroBadge = "장애인 고용 솔루션 파트너";
            changed = true;
          }
          if (cloudConfig.introPillar3Desc && cloudConfig.introPillar3Desc.includes("완벽 일임하여 완벽히 행정 부담을 덜어드립니다")) {
            cloudConfig.introPillar3Desc = cloudConfig.introPillar3Desc.replace("완벽 일임하여 완벽히 행정 부담을 덜어드립니다", "일임하여 행정 부담을 덜어 드립니다");
            changed = true;
          }
          if (cloudConfig.whyRiskTitle && (cloudConfig.whyRiskTitle.includes("장애인 고용 부재의 숨겨진 리스크") || cloudConfig.whyRiskTitle === "장애인 고용 부재의 숨겨진 리스크")) {
            cloudConfig.whyRiskTitle = "장애인 고용 리스크";
            changed = true;
          }
          if (cloudConfig.whyRiskDesc && (cloudConfig.whyRiskDesc.includes("많은 기업이 막대한 부담금을 매년 납부하면서도, 정작 실질적인 맞춤형 직무와 체계적인 재택근무 관리 방법을 찾지 못해 매월 깊은 고충을 격하게 겪고 있는") || cloudConfig.whyRiskDesc.includes("오늘날 대한민국 기업들의 냉정한 현실입니다"))) {
            cloudConfig.whyRiskDesc = "많은 기업이 막대한 부담금을 매년 납부하면서 장애인 고용과 체계적인 관리 방법을 찾지 못해서 깊은 고충을 겪고 있습니다.";
            changed = true;
          }
          if (cloudConfig.painDesc && (cloudConfig.painDesc.includes("장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다") || cloudConfig.painDesc === "장애인 고용에는 생각보다 복잡한 허들들이 다양하게 존재합니다.")) {
            cloudConfig.painDesc = "장애인 고용에는 생각보다 다양하고, 복잡한 문제가 존재합니다.";
            changed = true;
          }
          if (cloudConfig.painCaution && cloudConfig.painCaution.includes("부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다")) {
            cloudConfig.painCaution = cloudConfig.painCaution.replace("부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다", "부담금은 매년 세금처럼 증가하고 있습니다");
            changed = true;
          }
          if (cloudConfig.pillarsDesc && cloudConfig.pillarsDesc.includes("기업별 맞춤형 솔루션을 완벽 제공합니다")) {
            cloudConfig.pillarsDesc = cloudConfig.pillarsDesc.replace("기업별 맞춤형 솔루션을 완벽 제공합니다", "기업별 맞춤형 솔루션을 제공합니다");
            changed = true;
          }
          if (cloudConfig.pillar1Title && cloudConfig.pillar1Title.includes("극적인 비용 절감 효과")) {
            cloudConfig.pillar1Title = "비용 절감 효과";
            changed = true;
          }
          if (cloudConfig.pillar2Title && cloudConfig.pillar2Title.includes("법무/노무 리스크 완전 배제")) {
            cloudConfig.pillar2Title = "법무/노무 리스크 해소";
            changed = true;
          }
          if (cloudConfig.pillar3Title && (cloudConfig.pillar3Title.includes("원스톱 스마트 운영 시스템") || cloudConfig.pillar3Title === "원스톱 스마트 운영 시스템")) {
            cloudConfig.pillar3Title = "베네피플 Performance Dashbord";
            changed = true;
          }
          if (cloudConfig.pillar3Sub && (cloudConfig.pillar3Sub.includes("기업 커스텀 고도화 웹&앱 모니터링 시스템 무상 지원") || cloudConfig.pillar3Sub.includes("웹&앱 모니터링 시스템") || cloudConfig.pillar3Sub === "기업 커스텀 고도화 웹&앱 모니터링 시스템 무상 지원")) {
            cloudConfig.pillar3Sub = "매월 고객사에 운영 현황을 제공되는 리포트 시스템.";
            changed = true;
          }
          const cleanedCloudConfig = cleanBenePeopleObj(cloudConfig);
          if (changed) {
            await setDoc(docRef, cleanedCloudConfig);
          }
          setHomepageConfig(cleanedCloudConfig);
          try {
            localStorage.setItem("bene_people_homepage_config", JSON.stringify(cleanedCloudConfig));
          } catch (e) {
            console.warn("Could not save to localStorage on loadConfig:", e);
          }
        }
      } catch (err) {
        console.warn("Could not process real-time homepage config snapshot:", err);
      }
    }, (error) => {
      console.error("onSnapshot failed for homepage config:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateHomepageConfig = async (newConfig: HomepageConfig) => {
    const cleaned = cleanBenePeopleObj(newConfig);
    setHomepageConfig(cleaned);
    try {
      localStorage.setItem("bene_people_homepage_config", JSON.stringify(cleaned));
    } catch (e) {
      console.warn("Could not save to localStorage on handleUpdateHomepageConfig:", e);
    }
    try {
      const docRef = doc(db, "configs", "homepage");
      await setDoc(docRef, cleaned);
    } catch (err) {
      console.error("Could not save homepage config to Firestore:", err);
    }
  };

  const handleResetHomepageConfig = async () => {
    const cleaned = cleanBenePeopleObj(DEFAULT_HOMEPAGE_CONFIG);
    setHomepageConfig(cleaned);
    try {
      localStorage.setItem("bene_people_homepage_config", JSON.stringify(cleaned));
    } catch (e) {
      console.warn("Could not save to localStorage on handleResetHomepageConfig:", e);
    }
    try {
      const docRef = doc(db, "configs", "homepage");
      await setDoc(docRef, cleaned);
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
          <span>현재 [ {loggedInCompany} ] 계정으로 인증되었습니다. 회원사 맞춤 혜택이 적용됩니다!</span>
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center justify-center">
              {/* Centered Text Column */}
              <div className="space-y-7 text-center max-w-3xl flex flex-col items-center justify-center">
                <button
                  onClick={() => {
                    setBadgeClicks(prev => {
                      const next = prev + 1;
                      if (next >= 10) {
                        setShowLogin(true);
                        return 0;
                      }
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-xs sm:text-sm font-bold text-brand-accent tracking-wide uppercase hover:bg-white/15 active:scale-95 transition-all cursor-pointer focus:outline-none select-none"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow text-brand-accent" />
                  {homepageConfig.heroBadge}
                </button>

                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.3] tracking-tight whitespace-pre-line text-center">
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

                <p className="text-gray-300 text-sm sm:text-base xl:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-normal text-center whitespace-pre-line">
                  {homepageConfig.heroSubtitle}
                </p>
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

          {/* 9. ESG Impact Section */}
          <ESGImpactSection config={homepageConfig} />

          {/* 10. AI Diagnostics Consultation Form */}
          <AIDiagnosisSection config={homepageConfig} />

          {/* Brand Footer */}
          <Footer config={homepageConfig} onOpenTerms={handleOpenTerms} />
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

      {/* Terms and Privacy Policy Fullscreen Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <TermsModal
            isOpen={isTermsOpen}
            initialTab={activeTermsTab}
            onClose={() => setIsTermsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
