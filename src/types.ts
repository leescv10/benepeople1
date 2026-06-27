export interface Employee {
  id: string;
  name: string;
  disabilityType: string;
  role: string;
  status: "재직중" | "휴가중" | "퇴사";
  workHours: string;
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  disabilityType: string;
  method: "재택근무지 IP 일치인증" | "안면인식 로그인 완료" | "모바일 근태앱 전송";
  time: string;
  task: string;
}

export interface DailyLog {
  day: string;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
}

export interface ActivityReport {
  employeeId: string;
  name: string;
  disabilityType: string;
  role: string;
  activityTitle: string;
  activityDescription: string;
  achievementRate: number;
  imageUrl: string;
  logs: string[];
}

export interface DiagnosisData {
  companyName: string;
  totalEmployees: number;
  currentDisabledEmployees: number;
  managerName: string;
  managerContact: string;
  managerEmail: string;
}

export interface DiagnosisResult {
  requiredDisabledCount: number;
  shortage: number;
  pureFineYearly: number;
  benePeopleCostYearly: number;
  savingsYearly: number;
  savingsPercent: number;
  geminiReport: string;
}

export interface HomepageConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  metric1Val: string;
  metric1Lab: string;
  metric2Val: string;
  metric2Lab: string;
  metric3Val: string;
  metric3Lab: string;
  // Intro Section
  introBadge?: string;
  introTitle?: string;
  introDesc?: string;
  introPillar1Title?: string;
  introPillar1Desc?: string;
  introPillar2Title?: string;
  introPillar2Desc?: string;
  introPillar3Title?: string;
  introPillar3Desc?: string;
  // Why Section
  whyBadge?: string;
  whyTitle?: string;
  whyDesc?: string;
  whyCard1Title?: string;
  whyCard1Desc?: string;
  whyCard2Title?: string;
  whyCard2Desc?: string;
  whyCard3Title?: string;
  whyCard3Desc?: string;
  whyCard4Title?: string;
  whyCard4Desc?: string;
  whyRiskTitle?: string;
  whyRiskDesc?: string;
  // Pain Points Section
  painBadge?: string;
  painTitle?: string;
  painDesc?: string;
  painCaution?: string;

  // General & Branding Identity
  logoUrl?: string;
  companyName?: string;
  companyLogoText?: string;

  // Budget Calculator Formula & Texts
  calcBadge?: string;
  calcTitle?: string;
  calcDesc?: string;
  obligationRate?: number; // default: 0.031
  finePerMonth?: number; // default: 2156880
  beneCostPerMonth?: number; // default: 663000
  savingsPercentFixed?: number; // default: 69

  // Three Pillars Section
  pillarsBadge?: string;
  pillarsTitle?: string;
  pillarsDesc?: string;
  pillar1Title?: string;
  pillar1Sub?: string;
  pillar1Val?: string;
  pillar1ValSub?: string;
  pillar2Title?: string;
  pillar2Sub?: string;
  pillar2Val?: string;
  pillar2ValSub?: string;
  pillar3Title?: string;
  pillar3Sub?: string;
  pillar3Val?: string;
  pillar3ValSub?: string;

  // Workflow Section
  workflowBadge?: string;
  workflowTitle?: string;
  workflowDesc?: string;
  workflowStep1Title?: string;
  workflowStep1Desc?: string;
  workflowStep2Title?: string;
  workflowStep2Desc?: string;
  workflowStep3Title?: string;
  workflowStep3Desc?: string;
  workflowStep4Title?: string;
  workflowStep4Desc?: string;
  workflowStep5Title?: string;
  workflowStep5Desc?: string;
  workflowFooterTitle?: string;
  workflowFooterText?: string;

  // ESG Impact Section
  esgBadge?: string;
  esgTitle?: string;
  esgDesc?: string;
  esgCard1Title?: string;
  esgCard1Desc?: string;
  esgCard2Title?: string;
  esgCard2Desc?: string;
  esgCard3Title?: string;
  esgCard3Desc?: string;

  // Footer Section
  footerSlogan?: string;
  companyOwner?: string;
  companyPhone?: string;
  companyFax?: string;
  companyEmail?: string;
  companyAddress?: string;
  footerCopyright?: string;
}

export interface Inquiry {
  id: string;
  companyName: string;
  totalEmployees: number;
  currentDisabledEmployees: number;
  managerName: string;
  managerContact: string;
  managerEmail: string;
  date: string;
  savingsYearly: number;
  status: "접수대기" | "상담완료" | "보류";
}

