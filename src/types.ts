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

