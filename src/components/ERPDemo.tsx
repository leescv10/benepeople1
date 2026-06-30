import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, Award, CheckCircle, FileText, Check, Calendar, ArrowRight, Cloud } from "lucide-react";
import GoogleDriveTab from "./GoogleDriveTab";
import { db } from "../lib/googleAuth";
import { doc, getDoc } from "firebase/firestore";

interface ERPDemoProps {
  loggedInCompany?: string | null;
}

export default function ERPDemo({ loggedInCompany = null }: ERPDemoProps) {
  const [activeTab, setActiveTab] = useState<string>("employees");
  const [attendancePeriod, setAttendancePeriod] = useState<"daily" | "monthly" | "yearly">("daily");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("emp-1");
  const erpContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loggedInCompany) {
      setTimeout(() => {
        erpContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [loggedInCompany]);

  // Employees List Data
  const DEFAULT_EMPLOYEES = [
    {
      id: "emp-1",
      name: "김민우",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      disabilityType: "지체장애 중증 (하반신)",
      role: "친환경 탄소배출 데이터 모니터링",
      status: "재직중" as const,
      code: "BP-0138",
      dept: "ESG 환경지원팀"
    },
    {
      id: "emp-2",
      name: "이소연",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      disabilityType: "청각장애 경증",
      role: "ESG 지표 연구자료 수집 및 정렬",
      status: "재직중" as const,
      code: "BP-0142",
      dept: "경영기획부"
    },
    {
      id: "emp-3",
      name: "박준서",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
      disabilityType: "지체장애 중증 (상지 가능)",
      role: "사내 공문서 검수정리 OCR 분석",
      status: "재직중" as const,
      code: "BP-0155",
      dept: "행정사무지원"
    }
  ];

  const [employees, setEmployees] = useState<any[]>(DEFAULT_EMPLOYEES);

  // Load companies and employees dynamically from Firestore or local storage to show administrator's updates
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        // Load companies from Firestore first, then localStorage
        let comps = [];
        const compSnap = await getDoc(doc(db, "configs", "companies"));
        if (compSnap.exists()) {
          comps = compSnap.data().list || [];
        } else {
          const savedComp = localStorage.getItem("bene_people_member_companies");
          if (savedComp) {
            try {
              comps = JSON.parse(savedComp);
            } catch (e) {}
          }
        }

        // Load employees from Firestore first, then localStorage
        let empsList = [];
        const empSnap = await getDoc(doc(db, "configs", "employees"));
        if (empSnap.exists()) {
          empsList = empSnap.data().list || [];
        } else {
          const savedEmp = localStorage.getItem("bene_people_company_employees");
          if (savedEmp) {
            try {
              empsList = JSON.parse(savedEmp);
            } catch (e) {}
          }
        }

        if (comps.length > 0 && empsList.length > 0) {
          // Find the logged-in company's details
          const currentComp = comps.find((c: any) => c.name === loggedInCompany);
          if (currentComp) {
            // Filter employees who belong to this company
            const filtered = empsList
              .filter((e: any) => e.companyId === currentComp.id)
              .map((e: any) => ({
                ...e,
                avatar: e.avatar || e.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
              }));

            if (filtered.length > 0) {
              setEmployees(filtered);
              setSelectedEmployeeId(filtered[0].id || filtered[0].code);
            }
          } else {
            // Fallback: If no company found matching loggedInCompany, map loaded list
            const normalized = empsList.map((e: any) => ({
              ...e,
              avatar: e.avatar || e.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
            }));
            setEmployees(normalized);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic corporate employees for ERP:", err);
      }
    };
    if (loggedInCompany) {
      loadDynamicData();
    }
  }, [loggedInCompany]);

  // Daily Attendance Feed Data
  const attendanceFeed = [
    {
      id: "log-1",
      name: "김민우 (지체장애)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      method: "재택근무지 IP 일치인증" as const,
      time: "오전 08:58",
      task: "탄소배출 데이터 점검"
    },
    {
      id: "log-2",
      name: "이소연 (청각장애)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      method: "안면인식 로그인 완료" as const,
      time: "오전 09:02",
      task: "ESG 데이터 시각화 리서치"
    },
    {
      id: "log-3",
      name: "박준서 (지체장애)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
      method: "모바일 근태앱 전송" as const,
      time: "오전 09:15",
      task: "사내 공문 도서 OCR 검토"
    }
  ];

  // Performance Records
  const performanceRecords: Record<string, {
    title: string;
    desc: string;
    rating: string;
    ratingColor: string;
    bullets: string[];
    photoUrl: string;
  }> = {
    "emp-1": {
      title: "친환경 탄소 데이터 수집 및 등록 완료",
      desc: "관공서 및 제조 기업의 월별/연간 가스, 전기 사용량 고지 데이터를 기획 시트에 안전하게 입력하고 오타 및 이상치 수정을 완벽히 검수하였습니다.",
      rating: "S등급 검출 성공률 99.8%",
      ratingColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bullets: [
        "08:58 - 재택근무지 IP 2중 보안 로그인 완료",
        "09:15 - 탄소배출 모니터링 관리 전용 툴 접속",
        "11:00 - 서울지사 전력소비 수집 데이터 (120건) 대조 및 정렬",
        "14:30 - 탄소발자국 정밀 분류 입력 작업 수행",
        "17:45 - 일일 마감 보고서 자동 제출 및 로그아웃"
      ],
      photoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
    },
    "emp-2": {
      title: "국내 대기업 ESG 평가 지표 리서치 리포팅",
      desc: "국내 주요 대기업 50개사의 2025 지속가능경영 보고서를 정밀 분석하여 사회적 지표(S) 부문의 장애인 직간접 고용률 및 취약계층 일자리 지표 데이터를 추출, 표 형식으로 완벽히 정렬하여 제출하였습니다.",
      rating: "A등급 우수",
      ratingColor: "bg-blue-100 text-blue-800 border-blue-200",
      bullets: [
        "09:02 - 안면 다중 생체인식 로그인 통과",
        "10:00 - 3대 업종별 대기업 지속가능경영보고서 다운로드 및 분류",
        "13:00 - 장애인 직간접 지표 데이터 수집 (총 3건 수집 완료)",
        "15:30 - 타사 ESG 우수 고용사례 저널 정리 및 비교 분석 보고서 작성",
        "17:30 - 주간 결과 리포트 등록 및 실시간 검토 요청 완료"
      ],
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
    },
    "emp-3": {
      title: "스캔 문서 데이터화 및 사내 OCR 대조 분석",
      desc: "사내 종이 영수증 및 스캔 문서 이미지의 디지털 변환 결과를 원본과 한 글자씩 대조하여 기계 인식 오독률을 0.02% 미만으로 교정 및 행정 데이터베이스 동기화 작업을 수행하였습니다.",
      rating: "A등급 통과",
      ratingColor: "bg-blue-100 text-blue-800 border-blue-200",
      bullets: [
        "09:15 - 모바일 스마트 근태 전송 및 업무 활성화",
        "09:30 - 스캔 완료 이미지 팩 수신 확인 (사무 전자 문서함)",
        "11:15 - OCR 자동 변환 영수증 금액 오타 검수 및 수정 (45건)",
        "14:00 - 공문서 검수용 전용 에디터 탑재 및 데이터 보정 작업",
        "17:50 - 실시간 모니터링 종합 로그 전송 완료"
      ],
      photoUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600"
    }
  };

  const selectedPerformance = performanceRecords[selectedEmployeeId] || performanceRecords["emp-1"];

  return (
    <section id="erp-demo" className="py-20 bg-transparent text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-brand-accent/10 rounded-full font-bold">
            Enterprise App Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 text-white">
            베네피플 통합 근태시스템
          </h2>
          {!loggedInCompany && (
            <p className="text-gray-300 mt-4 text-sm sm:text-base font-sans">
              기업 담당자에게 무상으로 지원되는 베네피플 통합 근태 프로그램을 Web과 APP으로 직접 체험해 보세요.
            </p>
          )}
        </div>

        {/* Mock OS Container */}
        <div ref={erpContainerRef} className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[650px]">
          {/* OS Window Header */}
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-xs text-slate-500 ml-4 font-mono hidden sm:inline">
                {loggedInCompany 
                  ? "https://admin.benepeople.com/dashboard" 
                  : "https://admin.benepeople.com/demo/dashboard"}
              </span>
            </div>
            <div className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] uppercase font-mono px-2 py-0.5 rounded font-black tracking-wider">
              Live Mockup Dev
            </div>
          </div>

          {/* Main App Window Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black">
                    Enterprise Console
                  </div>
                  <nav className="mt-3 space-y-1">
                    <button
                      onClick={() => setActiveTab("employees")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === "employees"
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      장애인 재택 사원 목록
                    </button>
                    <button
                      onClick={() => setActiveTab("attendance")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === "attendance"
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      실시간 근태 현황
                    </button>
                    <button
                      onClick={() => setActiveTab("performance")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === "performance"
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      성과 관리
                    </button>
                    <button
                      onClick={() => setActiveTab("gdrive")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === "gdrive"
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                      }`}
                    >
                      <Cloud className="w-4 h-4" />
                      구글 드라이브 문서함
                    </button>
                  </nav>
                </div>
              </div>


            </aside>

            {/* Mobile Navigation Header */}
            <div className="md:hidden flex bg-slate-950 p-2 gap-1 border-b border-slate-800 absolute w-full z-20">
              <button
                onClick={() => setActiveTab("employees")}
                className={`flex-1 text-center py-2 text-[10px] font-bold rounded ${
                  activeTab === "employees" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                사원 목록
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex-1 text-center py-2 text-[10px] font-bold rounded ${
                  activeTab === "attendance" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                근태 현황
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`flex-1 text-center py-2 text-[10px] font-bold rounded ${
                  activeTab === "performance" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                성과 관리
              </button>
              <button
                onClick={() => setActiveTab("gdrive")}
                className={`flex-1 text-center py-2 text-[10px] font-bold rounded ${
                  activeTab === "gdrive" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                드라이브
              </button>
            </div>

            {/* Main Content Pane */}
            <main className="flex-1 bg-slate-900 p-6 overflow-y-auto text-slate-200 mt-12 md:mt-0 pt-16 md:pt-6">
              {/* TAB 1: EMPLOYEES LIST */}
              {activeTab === "employees" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">소속 장애인 근로자 인적 정보</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        현재 베네피플을 통해 당사 소속으로 안전하게 재택 근무 중인 총 3명의 인재 명부입니다.
                      </p>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                      3명 근무 중
                    </span>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto bg-slate-950/50 rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-mono">
                          <th className="p-4 font-semibold">성함</th>
                          <th className="p-4 font-semibold">장애 유형</th>
                          <th className="p-4 font-semibold">배정 직무</th>
                          <th className="p-4 font-semibold text-right">재직 상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {employees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-800/45 transition">
                            <td className="p-4 font-bold text-white flex items-center gap-3">
                              <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex flex-col">
                                <span>{emp.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono font-normal">{emp.code}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
                                {emp.disabilityType}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-slate-400">{emp.role}</td>
                            <td className="p-4 text-right">
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                                {emp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Informational Callout */}
                  <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      사원들의 일일 행정 및 위탁 수수료 정산, 4대보험 업무 및 중도 퇴사 관리 일체는 <strong>베네피플 전담 서포트팀</strong>에서 원스톱으로 처리되므로, 기업 담당자님의 업무 가중이 전혀 발생하지 않습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ATTENDANCE STATUS */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">실시간 근태 현황</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        근로자의 출근/퇴근 현황을 일간/월간/년간 주기별로 한눈에 정밀하게 분류 확인합니다.
                      </p>
                    </div>

                    {/* Frequency Filters */}
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-stretch sm:self-auto">
                      <button
                        onClick={() => setAttendancePeriod("daily")}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-md transition ${
                          attendancePeriod === "daily" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        일간
                      </button>
                      <button
                        onClick={() => setAttendancePeriod("monthly")}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-md transition ${
                          attendancePeriod === "monthly" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        월간
                      </button>
                      <button
                        onClick={() => setAttendancePeriod("yearly")}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-md transition ${
                          attendancePeriod === "yearly" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        년간
                      </button>
                    </div>
                  </div>

                  {/* Dynamic View Content */}
                  {attendancePeriod === "daily" ? (
                    <div className="space-y-6">
                      {/* Live Feed Feed */}
                      <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl">
                        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
                          당일 실시간 근태인증 피드
                        </h4>
                        <div className="space-y-3">
                          {attendanceFeed.map((feed) => (
                            <div
                              key={feed.id}
                              className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-3">
                                <img src={feed.avatar} alt={feed.name} className="w-7 h-7 rounded-full object-cover border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
                                <span className="text-xs font-bold text-white">{feed.name}</span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-brand-lightgreen/20 text-emerald-400 border border-emerald-500/10">
                                  {feed.method}
                                </span>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-4">
                                <span className="text-xs font-mono text-slate-400">{feed.time}</span>
                                <span className="text-xs text-brand-accent font-medium">{feed.task}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Daily Table Grid */}
                      <div className="overflow-x-auto bg-slate-950/50 rounded-xl border border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-mono">
                              <th className="p-3">사원번호</th>
                              <th className="p-3">직원</th>
                              <th className="p-3">조직</th>
                              <th className="p-3">출근/퇴근</th>
                              <th className="p-3 text-center">4/월</th>
                              <th className="p-3 text-center">5/화</th>
                              <th className="p-3 text-center">6/수</th>
                              <th className="p-3 text-center">7/목</th>
                              <th className="p-3 text-center">8/금</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {employees.map((emp) => (
                              <tr key={emp.id} className="hover:bg-slate-800/30">
                                <td className="p-3 font-mono text-slate-500">{emp.code}</td>
                                <td className="p-3 font-bold text-white flex items-center gap-2">
                                  <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
                                  <span>{emp.name}</span>
                                </td>
                                <td className="p-3 text-slate-400">{emp.dept}</td>
                                <td className="p-3 text-slate-400">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-emerald-400">출근 09:00</span>
                                    <span className="text-[10px] text-slate-500">퇴근 18:00</span>
                                  </div>
                                </td>
                                <td className="p-3 text-center text-emerald-400 font-bold">●</td>
                                <td className="p-3 text-center text-emerald-400 font-bold">●</td>
                                <td className="p-3 text-center text-emerald-400 font-bold">●</td>
                                <td className="p-3 text-center text-emerald-400 font-bold">●</td>
                                <td className="p-3 text-center text-emerald-400 font-bold">●</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : attendancePeriod === "monthly" ? (
                    <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl space-y-4 text-center py-10">
                      <Calendar className="w-12 h-12 text-brand-accent mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-white">6월 종합 월간 출근 이력</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        소속 사원 3명의 월간 총 소정근로일수 대비 누적 출근율은 <strong>98.4%</strong>입니다. 지각 및 무단 조퇴 기록이 완벽히 통제되고 있습니다.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4 text-left">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-400">김민우 사원</p>
                          <p className="text-sm font-bold text-white mt-1">출근율 100% (20/20일)</p>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-400">이소연 사원</p>
                          <p className="text-sm font-bold text-white mt-1">출근율 95.0% (19/20일)</p>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-400">박준서 사원</p>
                          <p className="text-sm font-bold text-white mt-1">출근율 100% (20/20일)</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl space-y-4 text-center py-10">
                      <Calendar className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-white">2026년도 연간 출근 현황 지표</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        연간 장애인 고용 분기별 공단 보고서 자동 승인 평점 **공단 승인 최우수 등급** 획득. 위탁 대행 노무사가 보장하는 법적 무결점 출근율을 상시 대조 증빙합니다.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PERFORMANCE DETAILS */}
              {activeTab === "performance" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold text-white">근로자의 성과 확인</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      사원을 클릭하시면 베네피플이 제공하는 실제 증빙용 활동 사진과 실시간 활동 일지만 집중해서 보실 수 있습니다.
                    </p>
                  </div>

                  {/* Employees Switch Cards */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {employees.map((emp) => (
                      <motion.button
                        key={emp.id}
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center justify-center gap-2 ${
                          selectedEmployeeId === emp.id
                            ? "bg-brand-accent/10 border-brand-accent text-brand-accent"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        }`}
                      >
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs sm:text-sm font-bold block">{emp.name}</span>
                        <span className="text-[9px] sm:text-[10px] block opacity-85 truncate max-w-full">
                          {emp.name === "김민우" ? "탄소 모니터링" : emp.name === "이소연" ? "ESG 수집" : "OCR 검수"}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Selected employee info view with photo and log */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
                    {/* Activity Photo Section */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] tracking-wider uppercase font-mono text-slate-500 block mb-2">
                          Activity Workspace Photo
                        </span>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 relative group">
                          {/* Animated Image Wrapper */}
                          <div className="w-full h-full relative">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={selectedEmployeeId}
                                src={selectedPerformance.photoUrl}
                                alt="Activity Proof Workspace"
                                referrerPolicy="no-referrer"
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            </AnimatePresence>
                          </div>

                          {/* Futuristic Grid Overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(235,182,63,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(235,182,63,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                          {/* Animated Laser Scanline bar */}
                          <motion.div
                            className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent shadow-[0_0_10px_rgba(235,182,63,0.6)] pointer-events-none"
                            animate={{ y: ["0%", "450%"] }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />

                          {/* Live Status Badge */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md flex items-center gap-1.5 pointer-events-none shadow-lg">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
                            </span>
                            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-200">
                              SECURE LIVE FEED
                            </span>
                          </div>

                          {/* Employee Name Watermark */}
                          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 pointer-events-none shadow">
                            EMP_ID: {selectedEmployeeId.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block mb-1">성과 등급 판정</span>
                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold border ${selectedPerformance.ratingColor}`}>
                          {selectedPerformance.rating}
                        </span>
                      </div>
                    </div>

                    {/* Work Journal Log Section */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] tracking-wider uppercase font-mono text-slate-400 block mb-1">
                            Current Task Title
                          </span>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-brand-accent shrink-0" />
                            {selectedPerformance.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed bg-slate-900 p-3.5 rounded-lg border border-slate-800/80">
                            {selectedPerformance.desc}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] tracking-wider uppercase font-mono text-slate-400 block mb-2">
                            일일 시간대별 근태 증빙 타임라인
                          </span>
                          <div className="space-y-1.5 font-mono text-slate-400 text-[11px]">
                            {selectedPerformance.bullets.map((bullet, idx) => (
                              <div key={idx} className="flex items-start gap-2 py-0.5">
                                <span className="text-brand-accent">▪</span>
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span>사원: {employees.find((e) => e.id === selectedEmployeeId)?.name}</span>
                        <span>전담 수석 코디네이터 배정 관리 중</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gdrive" && (
                <GoogleDriveTab employees={employees} attendanceFeed={attendanceFeed} />
              )}
            </main>
          </div>
        </div>

        {/* Outer ERP Demo Banner */}
        {!loggedInCompany && (
          <div className="mt-8 bg-emerald-950/40 border border-emerald-500/20 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
            <p className="text-xs sm:text-sm text-slate-200 text-center sm:text-left leading-relaxed">
              <strong className="text-brand-accent font-bold">* 위 근태 대시보드는 실제 베네피플 풀패키지 도입 시 무료로 즉시 활성화됩니다.</strong> 고도화된 안면생체인식 및 고유 IP 2중 보안을 통해 장애가 있더라도 자율적이고 투명하게 근무할 수 있는 환경을 선사합니다.
            </p>
            <a
              href="#ai-diagnosis"
              className="text-xs font-bold bg-brand-lightgreen text-white hover:bg-brand-green transition px-4 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0"
            >
              우리 회사 맞춤 도입 문의하기 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
