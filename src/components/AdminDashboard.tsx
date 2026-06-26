import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Users,
  FileText,
  TrendingUp,
  Save,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Download,
  Percent,
  TrendingDown,
  Calendar,
  Building2,
  Phone,
  Plus,
  Upload,
  X,
  Search
} from "lucide-react";
import { HomepageConfig, Inquiry } from "../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface AdminDashboardProps {
  homepageConfig: HomepageConfig;
  onUpdateHomepageConfig: (newConfig: HomepageConfig) => void;
  onResetHomepageConfig: () => void;
}

export default function AdminDashboard({
  homepageConfig,
  onUpdateHomepageConfig,
  onResetHomepageConfig,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "inquiries" | "accounts">("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingConfig, setEditingConfig] = useState<HomepageConfig>({ ...homepageConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [contentSubTab, setContentSubTab] = useState<"hero" | "intro" | "why" | "pain">("hero");

  // Member companies list
  const [companies, setCompanies] = useState<any[]>(() => {
    const saved = localStorage.getItem("bene_people_member_companies");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "comp-1",
        name: "(주)베네피플 일렉트릭",
        code: "BPE-01",
        status: "ONLINE",
        description: "재택사무지원 8명 및 ESG리서치 4명 탑재. 출퇴근 IP 일치 확인 완료 및 화상 생체인증 가동률 100%.",
        totalEmployeesCount: 12,
      },
      {
        id: "comp-2",
        name: "ESG 환경코퍼레이션",
        code: "ESG-02",
        status: "ONLINE",
        description: "친환경 탄소 데이터 가공인력 15명 탑재. 전원 원격 GPS 지오펜싱(Geo-fencing) 실시간 정상 검증 가동중.",
        totalEmployeesCount: 15,
      }
    ];
  });

  // Disabled employees list
  const [disabledEmployees, setDisabledEmployees] = useState<any[]>(() => {
    const saved = localStorage.getItem("bene_people_company_employees");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "emp-1",
        companyId: "comp-1",
        name: "김민우",
        code: "BP-0138",
        dept: "ESG 환경지원팀",
        disabilityType: "지체장애 중증 (하반신)",
        role: "친환경 탄소배출 데이터 모니터링",
        status: "재직중",
        attendanceMethod: "재택근무지 IP 일치인증",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        documentName: "장애인증명서_김민우.pdf"
      },
      {
        id: "emp-2",
        companyId: "comp-2",
        name: "이소연",
        code: "BP-0142",
        dept: "경영기획부",
        disabilityType: "청각장애 경증",
        role: "ESG 지표 연구자료 수집 및 정렬",
        status: "재직중",
        attendanceMethod: "안면인식 로그인 완료",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
        documentName: "장애인증명서_이소연.pdf"
      },
      {
        id: "emp-3",
        companyId: "comp-1",
        name: "박준서",
        code: "BP-0155",
        dept: "행정사무지원",
        disabilityType: "지체장애 중증 (상지 가능)",
        role: "사내 공문서 검수정리 OCR 분석",
        status: "재직중",
        attendanceMethod: "모바일 근태앱 전송",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
        documentName: "복지카드_박준서.png"
      }
    ];
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("comp-1");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState<boolean>(false);

  // New Employee Form state
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpCode, setNewEmpCode] = useState("");
  const [newEmpDept, setNewEmpDept] = useState("");
  const [newEmpDisabilityType, setNewEmpDisabilityType] = useState("지체장애 중증 (하반신)");
  const [newEmpRole, setNewEmpRole] = useState("");
  const [newEmpStatus, setNewEmpStatus] = useState<"재직중" | "휴직" | "퇴사">("재직중");
  const [newEmpAttendanceMethod, setNewEmpAttendanceMethod] = useState("재택근무지 IP 일치인증");
  const [newEmpAvatar, setNewEmpAvatar] = useState("");
  const [newEmpDocument, setNewEmpDocument] = useState("");
  const [newEmpAvatarFile, setNewEmpAvatarFile] = useState<File | null>(null);
  const [newEmpDocFile, setNewEmpDocFile] = useState<File | null>(null);

  // New Company form
  const [newCompName, setNewCompName] = useState("");
  const [newCompDesc, setNewCompDesc] = useState("");

  // Drag over states
  const [dragOverAvatar, setDragOverAvatar] = useState(false);
  const [dragOverDoc, setDragOverDoc] = useState(false);

  // Handle saving states
  useEffect(() => {
    localStorage.setItem("bene_people_member_companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("bene_people_company_employees", JSON.stringify(disabledEmployees));
  }, [disabledEmployees]);

  // Sync editing configuration with prop updates
  useEffect(() => {
    setEditingConfig({ ...homepageConfig });
  }, [homepageConfig]);

  // Load inquiries from localStorage or generate mock ones if empty
  useEffect(() => {
    const saved = localStorage.getItem("bene_people_inquiries");
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        generateMockInquiries();
      }
    } else {
      generateMockInquiries();
    }
  }, []);

  const generateMockInquiries = () => {
    const mockInquiries: Inquiry[] = [
      {
        id: "inq-1",
        companyName: "(주)한양디앤에스",
        totalEmployees: 185,
        currentDisabledEmployees: 1,
        managerName: "김우진 팀장",
        managerContact: "010-3482-1928",
        managerEmail: "wj.kim@hanyangds.com",
        date: "2026-06-25",
        savingsYearly: 103530240,
        status: "접수대기",
      },
      {
        id: "inq-2",
        companyName: "대유글로벌(주)",
        totalEmployees: 340,
        currentDisabledEmployees: 3,
        managerName: "최영민 부장",
        managerContact: "02-983-4812",
        managerEmail: "ymchoi@dayou-global.co.kr",
        date: "2026-06-24",
        savingsYearly: 181177920,
        status: "상담완료",
      },
      {
        id: "inq-3",
        companyName: "(주)엔텍소프트",
        totalEmployees: 95,
        currentDisabledEmployees: 0,
        managerName: "이지혜 과장",
        managerContact: "010-4491-0012",
        managerEmail: "jh.lee@enteksoft.co.kr",
        date: "2026-06-22",
        savingsYearly: 54353040,
        status: "접수대기",
      },
      {
        id: "inq-4",
        companyName: "서원케미칼",
        totalEmployees: 120,
        currentDisabledEmployees: 2,
        managerName: "박도식 상무",
        managerContact: "010-9090-3311",
        managerEmail: "dspark@seowonchem.com",
        date: "2026-06-18",
        savingsYearly: 36235360,
        status: "보류",
      },
    ];
    setInquiries(mockInquiries);
    localStorage.setItem("bene_people_inquiries", JSON.stringify(mockInquiries));
  };

  const handleUpdateStatus = (id: string, newStatus: "접수대기" | "상담완료" | "보류") => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    setInquiries(updated);
    localStorage.setItem("bene_people_inquiries", JSON.stringify(updated));
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm("정말로 이 상담 문의 내역을 삭제하시겠습니까?")) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      setInquiries(updated);
      localStorage.setItem("bene_people_inquiries", JSON.stringify(updated));
    }
  };

  const handleSaveHomepageConfig = () => {
    onUpdateHomepageConfig(editingConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRestoreDefaults = () => {
    if (confirm("홈페이지 텍스트를 초기 기획 사양으로 복구하시겠습니까?")) {
      onResetHomepageConfig();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Helper to read file as base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "doc") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "avatar") {
      setNewEmpAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEmpAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewEmpDocFile(file);
      setNewEmpDocument(file.name);
    }
  };

  // Drag and Drop helpers
  const handleDragOver = (e: React.DragEvent, type: "avatar" | "doc") => {
    e.preventDefault();
    if (type === "avatar") setDragOverAvatar(true);
    else setDragOverDoc(true);
  };

  const handleDragLeave = (type: "avatar" | "doc") => {
    if (type === "avatar") setDragOverAvatar(false);
    else setDragOverDoc(false);
  };

  const handleDrop = (e: React.DragEvent, type: "avatar" | "doc") => {
    e.preventDefault();
    if (type === "avatar") {
      setDragOverAvatar(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setNewEmpAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewEmpAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setDragOverDoc(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setNewEmpDocFile(file);
        setNewEmpDocument(file.name);
      }
    }
  };

  // Add Employee Handler
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpCode || !newEmpDept || !newEmpRole) {
      alert("모든 필수 입력 사항을 기입해 주세요.");
      return;
    }

    // Check if code is unique
    if (disabledEmployees.some(emp => emp.code === newEmpCode)) {
      alert("이미 등록된 사원코드입니다. 다른 사원코드를 기입해 주세요.");
      return;
    }

    const defaultAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
    ];

    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const createdEmp = {
      id: `emp-${Date.now()}`,
      companyId: selectedCompanyId,
      name: newEmpName,
      code: newEmpCode,
      dept: newEmpDept,
      disabilityType: newEmpDisabilityType,
      role: newEmpRole,
      status: newEmpStatus,
      attendanceMethod: newEmpAttendanceMethod,
      avatarUrl: newEmpAvatar || randomAvatar,
      documentName: newEmpDocument || "장애인증명서_미등록.pdf"
    };

    const updatedEmployees = [createdEmp, ...disabledEmployees];
    setDisabledEmployees(updatedEmployees);

    // Update Company Employee Count
    const updatedCompanies = companies.map(comp => {
      if (comp.id === selectedCompanyId) {
        return {
          ...comp,
          totalEmployeesCount: (comp.totalEmployeesCount || 0) + 1
        };
      }
      return comp;
    });
    setCompanies(updatedCompanies);

    // Clear form
    setNewEmpName("");
    setNewEmpCode("");
    setNewEmpDept("");
    setNewEmpDisabilityType("지체장애 중증 (하반신)");
    setNewEmpRole("");
    setNewEmpStatus("재직중");
    setNewEmpAttendanceMethod("재택근무지 IP 일치인증");
    setNewEmpAvatar("");
    setNewEmpDocument("");
    setNewEmpAvatarFile(null);
    setNewEmpDocFile(null);
    setShowAddEmployeeModal(false);

    alert(`${newEmpName} 근로자가 성공적으로 등록 및 업로드 되었습니다.`);
  };

  // Delete Employee Handler
  const handleDeleteEmployee = (id: string, name: string) => {
    if (confirm(`정말로 ${name} 근로자의 등록 정보를 영구 삭제하시겠습니까? (출퇴근 DB에서도 제외됩니다)`)) {
      const updated = disabledEmployees.filter(emp => emp.id !== id);
      setDisabledEmployees(updated);

      // Decrement Company Employee Count
      const updatedCompanies = companies.map(comp => {
        if (comp.id === selectedCompanyId) {
          return {
            ...comp,
            totalEmployeesCount: Math.max(0, (comp.totalEmployeesCount || 0) - 1)
          };
        }
        return comp;
      });
      setCompanies(updatedCompanies);
    }
  };

  // Add Company Handler
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName) {
      alert("회원사명을 입력해 주세요.");
      return;
    }

    const newComp = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      code: `BPC-${companies.length + 1}`,
      status: "ONLINE",
      description: newCompDesc || "신규 등록된 장애인 맞춤형 일자리 위탁 회원사 채널입니다.",
      totalEmployeesCount: 0
    };

    setCompanies([...companies, newComp]);
    setSelectedCompanyId(newComp.id);
    setNewCompName("");
    setNewCompDesc("");
    setShowAddCompanyModal(false);

    alert(`'${newCompName}' 회원사가 성공적으로 생성 및 등록되었습니다.`);
  };

  // Stats calculation
  const totalInquiriesCount = inquiries.length;
  const pendingCount = inquiries.filter((i) => i.status === "접수대기").length;
  const completedCount = inquiries.filter((i) => i.status === "상담완료").length;
  const totalEstimatedSavings = inquiries.reduce((sum, i) => sum + i.savingsYearly, 0);

  // Chart Mock Data
  const trafficData = [
    { name: "06/20", 방문자: 420, 문의신청: 1 },
    { name: "06/21", 방문자: 480, 문의신청: 2 },
    { name: "06/22", 방문자: 510, 문의신청: 3 },
    { name: "06/23", 방문자: 630, 문의신청: 5 },
    { name: "06/24", 방문자: 750, 문의신청: 8 },
    { name: "06/25", 방문자: 890, 문의신청: 12 },
    { name: "06/26", 방문자: 1040, 문의신청: 15 },
  ];

  const savingsByCompanyData = inquiries.map((inq) => ({
    name: inq.companyName.length > 7 ? inq.companyName.slice(0, 7) + ".." : inq.companyName,
    "연간 예상 절감액(만원)": Math.round(inq.savingsYearly / 10000),
  }));

  return (
    <div className="bg-[#FAFDFB] min-h-screen text-[#1A2E2A] pt-4 pb-16">
      {/* Dashboard Top Navigation Info */}
      <div className="border-b border-gray-200 bg-white shadow-sm rounded-2xl mb-8 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#EBB63F]/10 rounded-lg text-[#D1991F] font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 block tracking-widest font-mono uppercase">
                BENEPEOPLE WEB ADMIN SYSTEM
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#073B31]">
                베네피플 통합 관리자 프로그램
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            메인 홈페이지 노출 텍스트 편집, 실시간 AI 간이진단 인입 리스트 관리 및 플랫폼 보안 통계를 총괄합니다.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-brand-green text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            운영 현황
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "content"
                ? "bg-brand-green text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            홈페이지 텍스트 관리
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "inquiries"
                ? "bg-brand-green text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            AI 고용 진단 신청 ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("accounts")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "accounts"
                ? "bg-brand-green text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            회원사 채널 모니터
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">누적 AI 분석 건수</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-[#073B31]">{totalInquiriesCount}건</span>
                  <span className="text-xs text-emerald-600 font-bold font-mono flex items-center gap-0.5">
                    +15% <TrendingUp className="w-3 h-3" />
                  </span>
                </div>
                <div className="h-1 bg-gray-100 w-full rounded-full mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "75%" }}></div>
                </div>
                <span className="text-[9px] text-gray-400 block mt-2">지난 주 대비 인입 속도 1.4배 향상</span>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">신규 진단 대기</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-amber-500">{pendingCount}개소</span>
                  <span className="text-xs text-amber-600 font-bold font-mono">즉시 대응 필요</span>
                </div>
                <div className="h-1 bg-gray-100 w-full rounded-full mt-4 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(pendingCount / totalInquiriesCount) * 100}%` }}></div>
                </div>
                <span className="text-[9px] text-gray-400 block mt-2">미처리 인입 24시간 내 배정 원칙</span>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">추천 세이브 합산</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-black text-brand-green">₩{(totalEstimatedSavings / 100000000).toFixed(2)}억원</span>
                  <span className="text-xs text-emerald-600 font-bold font-mono">고용부담 보전</span>
                </div>
                <div className="h-1 bg-gray-100 w-full rounded-full mt-4 overflow-hidden">
                  <div className="bg-brand-green h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
                <span className="text-[9px] text-gray-400 block mt-2">기업체 부담 완화 제안 총액</span>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">체크인 ERP 활성 채널</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-brand-lightgreen">128개 사</span>
                  <span className="text-xs text-blue-600 font-bold font-mono">실시간 구동</span>
                </div>
                <div className="h-1 bg-gray-100 w-full rounded-full mt-4 overflow-hidden">
                  <div className="bg-brand-lightgreen h-full rounded-full" style={{ width: "85%" }}></div>
                </div>
                <span className="text-[9px] text-gray-400 block mt-2">전국 재택/근로 장애인 인적망 탑재</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Traffic & Submissions */}
              <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-sm text-[#073B31]">실시간 트래픽 및 AI 고용진단 인입 추이</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">최근 7일간의 방문자 유입 대비 신청 전환 비율</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold font-mono">LIVE MATCHING</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="방문자" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                      <Area type="monotone" dataKey="문의신청" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Savings Potential by Firm */}
              <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-sm text-[#073B31]">주요 진단 회원사 부담금 세이브 규모</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">베네피플 맞춤 컨설팅 적용 시 예상되는 절감 효과</p>
                  </div>
                  <span className="text-[10px] bg-[#EBB63F]/10 text-[#D1991F] px-2 py-1 rounded font-bold">SAVINGS RATIO</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsByCompanyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="연간 예상 절감액(만원)" fill="#073B31" radius={[4, 4, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Guide */}
            <div className="bg-[#073B31] text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-brand-accent font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>실제 홈페이지 반영 즉시동작 안내</span>
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  '홈페이지 텍스트 관리' 탭에서 헤드라인 문구를 수정하고 저장하면, 일반 사용자가 방문하는 랜딩 페이지의 메인 헤더가 실시간으로 영구 교체됩니다.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("content")}
                className="bg-[#EBB63F] hover:bg-amber-400 text-brand-green font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 transition"
              >
                <span>텍스트 편집기로 가기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Homepage Content Editor */}
        {activeTab === "content" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#073B31]">실시간 메인 홈페이지 노출 카피 수정</h2>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                홍보용 문구를 수정하여 신규 유입 기업들에게 강력한 첫인상을 심어줄 수 있습니다. 마크다운 대신 개행 문자나 자연어 형식으로 직접 편집해 주세요.
              </p>
            </div>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>성공적으로 저장되었습니다! 홈페이지 및 랜딩 화면에 변경사항이 영구 반영되었습니다.</span>
              </motion.div>
            )}

            {/* Sub-Tabs for different sections */}
            <div className="flex border-b border-gray-100 overflow-x-auto pb-px gap-2">
              <button
                onClick={() => setContentSubTab("hero")}
                className={`pb-3 text-xs font-bold whitespace-nowrap px-3 transition border-b-2 ${
                  contentSubTab === "hero"
                    ? "border-[#073B31] text-[#073B31]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                메인 히어로 & 지표
              </button>
              <button
                onClick={() => setContentSubTab("intro")}
                className={`pb-3 text-xs font-bold whitespace-nowrap px-3 transition border-b-2 ${
                  contentSubTab === "intro"
                    ? "border-[#073B31] text-[#073B31]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                소개 영역 (Intro)
              </button>
              <button
                onClick={() => setContentSubTab("why")}
                className={`pb-3 text-xs font-bold whitespace-nowrap px-3 transition border-b-2 ${
                  contentSubTab === "why"
                    ? "border-[#073B31] text-[#073B31]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                고용 필요성 (Why)
              </button>
              <button
                onClick={() => setContentSubTab("pain")}
                className={`pb-3 text-xs font-bold whitespace-nowrap px-3 transition border-b-2 ${
                  contentSubTab === "pain"
                    ? "border-[#073B31] text-[#073B31]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                현실적 고민 (Pain Points)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Fields (Takes 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {contentSubTab === "hero" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        히어로 배지 텍스트
                      </label>
                      <input
                        type="text"
                        value={editingConfig.heroBadge}
                        onChange={(e) => setEditingConfig({ ...editingConfig, heroBadge: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        메인 헤드라인 텍스트 (줄바꿈 가능)
                      </label>
                      <textarea
                        rows={4}
                        value={editingConfig.heroTitle}
                        onChange={(e) => setEditingConfig({ ...editingConfig, heroTitle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-mono leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        메인 서브 요약 설명글
                      </label>
                      <textarea
                        rows={3}
                        value={editingConfig.heroSubtitle}
                        onChange={(e) => setEditingConfig({ ...editingConfig, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-extrabold text-xs text-[#073B31] uppercase tracking-wider mb-3">수치 지표 관리 (Metrics)</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 1 수치</label>
                            <input
                              type="text"
                              value={editingConfig.metric1Val}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric1Val: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 1 설명문구</label>
                            <input
                              type="text"
                              value={editingConfig.metric1Lab}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric1Lab: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 2 수치</label>
                            <input
                              type="text"
                              value={editingConfig.metric2Val}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric2Val: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 2 설명문구</label>
                            <input
                              type="text"
                              value={editingConfig.metric2Lab}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric2Lab: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 3 수치</label>
                            <input
                              type="text"
                              value={editingConfig.metric3Val}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric3Val: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">지표 3 설명문구</label>
                            <input
                              type="text"
                              value={editingConfig.metric3Lab}
                              onChange={(e) => setEditingConfig({ ...editingConfig, metric3Lab: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {contentSubTab === "intro" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        소개 배지 텍스트
                      </label>
                      <input
                        type="text"
                        value={editingConfig.introBadge || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, introBadge: e.target.value })}
                        placeholder="ABOUT · 베네피플"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        소개 메인 타이틀
                      </label>
                      <input
                        type="text"
                        value={editingConfig.introTitle || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, introTitle: e.target.value })}
                        placeholder="이름에 담은 약속, Benefit + People"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        소개 상세 설명글 (줄바꿈 가능)
                      </label>
                      <textarea
                        rows={4}
                        value={editingConfig.introDesc || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, introDesc: e.target.value })}
                        placeholder="소개 상세 설명을 입력해 주세요."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <h3 className="font-extrabold text-xs text-[#073B31] uppercase tracking-wider">3대 핵심 기둥 (Pillars)</h3>
                      
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">첫 번째 기둥</span>
                        <input
                          type="text"
                          value={editingConfig.introPillar1Title || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar1Title: e.target.value })}
                          placeholder="브랜드 의미"
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                        />
                        <textarea
                          rows={2}
                          value={editingConfig.introPillar1Desc || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar1Desc: e.target.value })}
                          placeholder="설명을 입력하세요."
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs"
                        />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">두 번째 기둥</span>
                        <input
                          type="text"
                          value={editingConfig.introPillar2Title || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar2Title: e.target.value })}
                          placeholder="미션 · 비전"
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                        />
                        <textarea
                          rows={2}
                          value={editingConfig.introPillar2Desc || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar2Desc: e.target.value })}
                          placeholder="설명을 입력하세요."
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs"
                        />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">세 번째 기둥</span>
                        <input
                          type="text"
                          value={editingConfig.introPillar3Title || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar3Title: e.target.value })}
                          placeholder="서비스 가치"
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs font-bold"
                        />
                        <textarea
                          rows={2}
                          value={editingConfig.introPillar3Desc || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, introPillar3Desc: e.target.value })}
                          placeholder="설명을 입력하세요."
                          className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {contentSubTab === "why" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        필요성 배지 텍스트
                      </label>
                      <input
                        type="text"
                        value={editingConfig.whyBadge || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, whyBadge: e.target.value })}
                        placeholder="THE REGULATORY CONTEXT"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        필요성 영역 제목
                      </label>
                      <input
                        type="text"
                        value={editingConfig.whyTitle || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, whyTitle: e.target.value })}
                        placeholder="왜 지금 장애인 고용인가?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        필요성 설명문구
                      </label>
                      <textarea
                        rows={3}
                        value={editingConfig.whyDesc || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, whyDesc: e.target.value })}
                        placeholder="의무 고용의 필요성을 간략히 설명해 주세요."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <h3 className="font-extrabold text-xs text-[#073B31] uppercase tracking-wider">주요 상황 지표 카드 (4 Cards)</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                          <span className="text-[9px] font-bold text-emerald-800">지표 카드 1</span>
                          <input
                            type="text"
                            value={editingConfig.whyCard1Title || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard1Title: e.target.value })}
                            placeholder="의무고용률 지속 강화"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editingConfig.whyCard1Desc || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard1Desc: e.target.value })}
                            placeholder="설명"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                          <span className="text-[9px] font-bold text-emerald-800">지표 카드 2</span>
                          <input
                            type="text"
                            value={editingConfig.whyCard2Title || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard2Title: e.target.value })}
                            placeholder="고용부담금 매년 인상"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editingConfig.whyCard2Desc || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard2Desc: e.target.value })}
                            placeholder="설명"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                          <span className="text-[9px] font-bold text-emerald-800">지표 카드 3</span>
                          <input
                            type="text"
                            value={editingConfig.whyCard3Title || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard3Title: e.target.value })}
                            placeholder="ESG 가이드라인 강화"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editingConfig.whyCard3Desc || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard3Desc: e.target.value })}
                            placeholder="설명"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                          <span className="text-[9px] font-bold text-emerald-800">지표 카드 4</span>
                          <input
                            type="text"
                            value={editingConfig.whyCard4Title || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard4Title: e.target.value })}
                            placeholder="정부 점검 및 관리 강화"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editingConfig.whyCard4Desc || ""}
                            onChange={(e) => setEditingConfig({ ...editingConfig, whyCard4Desc: e.target.value })}
                            placeholder="설명"
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <h3 className="font-extrabold text-xs text-[#073B31] uppercase tracking-wider">주요 위험 요인 및 하단 경고글</h3>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">리스크 박스 타이틀</label>
                        <input
                          type="text"
                          value={editingConfig.whyRiskTitle || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, whyRiskTitle: e.target.value })}
                          placeholder="장애인 고용 부재의 숨겨진 리스크"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">리스크 박스 설명문구 (줄바꿈 가능)</label>
                        <textarea
                          rows={4}
                          value={editingConfig.whyRiskDesc || ""}
                          onChange={(e) => setEditingConfig({ ...editingConfig, whyRiskDesc: e.target.value })}
                          placeholder="리스크 설명을 입력해 주세요."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {contentSubTab === "pain" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        고민 배지 텍스트
                      </label>
                      <input
                        type="text"
                        value={editingConfig.painBadge || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, painBadge: e.target.value })}
                        placeholder="PAIN POINTS"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        고민 영역 대제목
                      </label>
                      <input
                        type="text"
                        value={editingConfig.painTitle || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, painTitle: e.target.value })}
                        placeholder="기업의 현실적인 고민"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        고민 영역 서두 설명글
                      </label>
                      <textarea
                        rows={3}
                        value={editingConfig.painDesc || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, painDesc: e.target.value })}
                        placeholder="고민 영역 상세설명"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        하단 노란색 강조 경고글
                      </label>
                      <textarea
                        rows={3}
                        value={editingConfig.painCaution || ""}
                        onChange={(e) => setEditingConfig({ ...editingConfig, painCaution: e.target.value })}
                        placeholder="고민하고 망설이는 동안에도, 부담금은 매년 세금처럼 매달 일정하게 증가하고 있습니다."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Simulated Live Web Preview (Takes 5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#073B31]/5 p-5 rounded-2xl border border-dashed border-[#073B31]/10 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#073B31] block tracking-widest uppercase mb-4">
                      🖥️ 실시간 웹 랜더링 미리보기
                    </span>
                    
                    {contentSubTab === "hero" && (
                      <div className="bg-brand-green text-white p-5 rounded-xl shadow-lg space-y-4">
                        <span className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-brand-accent inline-block">{editingConfig.heroBadge}</span>
                        <h4 className="text-sm font-extrabold whitespace-pre-line leading-relaxed">{editingConfig.heroTitle}</h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed">{editingConfig.heroSubtitle}</p>
                        
                        <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-white">
                          <div>
                            <p className="text-xs font-black text-[#EBB63F]">{editingConfig.metric1Val}</p>
                            <p className="text-[8px] text-gray-300 scale-90 origin-center">{editingConfig.metric1Lab}</p>
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#EBB63F]">{editingConfig.metric2Val}</p>
                            <p className="text-[8px] text-gray-300 scale-90 origin-center">{editingConfig.metric2Lab}</p>
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#EBB63F]">{editingConfig.metric3Val}</p>
                            <p className="text-[8px] text-gray-300 scale-90 origin-center">{editingConfig.metric3Lab}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {contentSubTab === "intro" && (
                      <div className="bg-[#073B31] text-white p-5 rounded-xl shadow-lg space-y-4">
                        <div className="border-l-2 border-brand-accent pl-2">
                          <span className="text-[9px] font-bold text-brand-accent block">{editingConfig.introBadge || "ABOUT · 베네피플"}</span>
                          <h4 className="text-xs font-bold">{editingConfig.introTitle || "이름에 담은 약속"}</h4>
                        </div>
                        <p className="text-[10px] text-gray-300 whitespace-pre-line">{editingConfig.introDesc || ""}</p>
                        
                        <div className="space-y-2 pt-2">
                          <div className="p-2.5 bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-lg text-[10px]">
                            <p className="font-bold text-brand-accent">{editingConfig.introPillar1Title || "브랜드 의미"}</p>
                            <p className="text-gray-300 mt-1">{editingConfig.introPillar1Desc || ""}</p>
                          </div>
                          <div className="p-2.5 bg-[#0D5C4E]/40 border border-[#0D5C4E] rounded-lg text-[10px]">
                            <p className="font-bold text-brand-accent">{editingConfig.introPillar2Title || "미션 · 비전"}</p>
                            <p className="text-gray-300 mt-1">{editingConfig.introPillar2Desc || ""}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {contentSubTab === "why" && (
                      <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-lg space-y-4 text-gray-800">
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">{editingConfig.whyBadge || "THE REGULATORY CONTEXT"}</span>
                        <h4 className="text-xs font-black text-emerald-950">{editingConfig.whyTitle || "왜 지금인가?"}</h4>
                        <p className="text-[10px] text-gray-500">{editingConfig.whyDesc || ""}</p>
                        
                        <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-lg text-[10px] text-red-900">
                          <p className="font-bold">{editingConfig.whyRiskTitle || "숨겨진 리스크"}</p>
                          <p className="text-red-700 mt-1 whitespace-pre-line">{editingConfig.whyRiskDesc || ""}</p>
                        </div>
                      </div>
                    )}

                    {contentSubTab === "pain" && (
                      <div className="bg-[#F8FAF9] border border-gray-200 p-5 rounded-xl shadow-lg space-y-4 text-gray-800">
                        <span className="text-[9px] font-bold bg-emerald-100/50 text-emerald-950 px-2 py-0.5 rounded-full">{editingConfig.painBadge || "PAIN POINTS"}</span>
                        <h4 className="text-xs font-black text-emerald-950">{editingConfig.painTitle || "고민"}</h4>
                        <p className="text-[10px] text-gray-500">{editingConfig.painDesc || ""}</p>
                        
                        <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-[9px] text-amber-800 font-bold">
                          {editingConfig.painCaution || ""}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 font-sans mt-4">
                    * 우측 화면은 홈페이지의 실제 모듈 구성을 그대로 축소 묘사한 모바일 지향 프리뷰 카드입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4" />
                기본 사양 복원
              </button>
              
              <button
                onClick={handleSaveHomepageConfig}
                className="bg-[#073B31] hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
              >
                <Save className="w-4 h-4" />
                수정 문구 저장 및 즉시 반영
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Consultation / Inquiries tracker */}
        {activeTab === "inquiries" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#073B31]">실시간 AI 모바일 고용진단 신청 목록</h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  사용자가 랜딩 화면 하단 'AI 부담금 진단기' 양식을 채울 때마다 리스트가 자동 동기화되며 누적 저장됩니다.
                </p>
              </div>
              <button
                onClick={generateMockInquiries}
                className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                테스트 데이터 리셋
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                    <th className="p-4">신청일 / 상태</th>
                    <th className="p-4">회사명 (규모 / 현재 장애인 고용)</th>
                    <th className="p-4">담당자 정보</th>
                    <th className="p-4 text-right">예상 절감 규모</th>
                    <th className="p-4 text-center">행동/상태수정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-sans">
                        현재 등록된 간이진단 문의가 없습니다. 랜딩 하단 양식에 테스트 입력을 넣어 보세요!
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-brand-lightgreen" />
                            <span>{inq.date}</span>
                          </div>
                          <div>
                            {inq.status === "접수대기" && (
                              <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                <Clock className="w-3 h-3" />
                                접수대기
                              </span>
                            )}
                            {inq.status === "상담완료" && (
                              <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                <CheckCircle className="w-3 h-3" />
                                상담완료
                              </span>
                            )}
                            {inq.status === "보류" && (
                              <span className="bg-gray-100 border border-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                <XCircle className="w-3 h-3" />
                                보류
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-extrabold text-[#073B31] text-sm flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-brand-lightgreen" />
                            <span>{inq.companyName}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1">
                            상시 근로자: <strong>{inq.totalEmployees}명</strong> | 장애인 근로: <strong>{inq.currentDisabledEmployees}명</strong>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-gray-700">{inq.managerName}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{inq.managerContact}</span>
                          </div>
                          <div className="text-[11px] text-gray-400">{inq.managerEmail}</div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-emerald-600">
                          연 ₩{inq.savingsYearly.toLocaleString()}원 세이브
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {inq.status !== "상담완료" && (
                              <button
                                onClick={() => handleUpdateStatus(inq.id, "상담완료")}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold p-1.5 rounded-lg border border-emerald-200 transition"
                                title="상담완료 처리"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {inq.status !== "보류" && (
                              <button
                                onClick={() => handleUpdateStatus(inq.id, "보류")}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold p-1.5 rounded-lg border border-gray-200 transition"
                                title="보류 처리"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-1.5 rounded-lg border border-red-200 transition"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Simulated Accounts Monitoring */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#073B31]">회원사 위탁 채널 & 장애인 근로자 관리</h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  각 연동 회원사별 장애인 근로자의 인적사항 및 직무, 장애 정도, 출퇴근 증빙 서류를 통합 등록 및 관리합니다.
                </p>
              </div>
              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="bg-[#073B31] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>신규 회원사 등록</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Companies List (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">위탁 회원사 채널</h3>
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {companies.map((comp) => {
                    const isSelected = selectedCompanyId === comp.id;
                    const compEmployeesCount = disabledEmployees.filter(emp => emp.companyId === comp.id).length;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedCompanyId(comp.id)}
                        className={`p-5 border cursor-pointer rounded-2xl transition flex flex-col justify-between gap-3 relative overflow-hidden ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-500/5 shadow-md"
                            : "border-gray-100 bg-white hover:border-gray-200 shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-sm text-[#073B31]">{comp.name}</h4>
                              <span className="text-[9px] bg-emerald-500 text-white font-bold px-1 py-0.5 rounded-full font-mono">ONLINE</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block font-mono">ID: {comp.code}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                          {comp.description}
                        </p>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100/50 text-[11px] font-sans">
                          <span className="text-gray-400">등록 완료 장애인 인력</span>
                          <span className="font-bold text-emerald-600">{compEmployeesCount}명</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Employees Master List (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-3">
                {(() => {
                  const currentComp = companies.find((c) => c.id === selectedCompanyId) || companies[0];
                  if (!currentComp) return null;
                  const currentEmployees = disabledEmployees.filter((emp) => emp.companyId === currentComp.id);

                  return (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-[#073B31]">
                              {currentComp.name}
                            </h3>
                            <span className="text-xs text-gray-400 font-sans">등록 장애인 명부</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-sans">
                            해당 위탁 회원사에 소속되어 실시간 화상 근태/생체 검증을 진행중인 장애인 근로자 목록입니다.
                          </p>
                        </div>

                        {/* Direct upload / register employee button */}
                        <button
                          onClick={() => setShowAddEmployeeModal(true)}
                          className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          <span>장애인 근로자 직접 등록 (업로드)</span>
                        </button>
                      </div>

                      {/* Employees List */}
                      <div className="space-y-4">
                        {currentEmployees.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl font-sans">
                            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 font-bold">등록된 장애인 근로자가 없습니다.</p>
                            <p className="text-xs text-gray-400 mt-1">상단의 '장애인 근로자 직접 등록 (업로드)' 버튼을 통해 근로자 정보와 복지카드/증빙 문서를 수동으로 등록해 주세요.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentEmployees.map((emp) => (
                              <div key={emp.id} className="p-4 border border-gray-100 rounded-xl hover:border-emerald-500/30 transition bg-gray-50/30 flex flex-col justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={emp.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                                    alt={emp.name}
                                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <div>
                                        <h4 className="font-extrabold text-sm text-[#073B31] truncate">{emp.name}</h4>
                                        <span className="text-[9px] text-gray-400 font-mono tracking-wider">{emp.code} | {emp.dept}</span>
                                      </div>
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded shrink-0">
                                        {emp.status}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-gray-600 font-sans leading-relaxed mt-2 space-y-0.5">
                                      <div>장애등급: <strong>{emp.disabilityType}</strong></div>
                                      <div>담당직무: <strong>{emp.role}</strong></div>
                                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-1.5 font-sans">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span>출퇴근인증: {emp.attendanceMethod}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t border-gray-100/70 pt-3 flex items-center justify-between">
                                  {/* Uploaded Certificate / Welfare card info */}
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white border border-gray-200 rounded-lg px-2 py-1 max-w-[75%] truncate font-mono">
                                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate" title={emp.documentName || "장애인증명서_인증됨.pdf"}>
                                      {emp.documentName || "장애인증명서_인증됨.pdf"}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition"
                                    title="근로자 삭제"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal 1: Add Disabled Employee Modal */}
            <AnimatePresence>
              {showAddEmployeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-black text-lg text-[#073B31]">장애인 근로자 직접 등록 & 증빙서류 업로드</h3>
                        <p className="text-xs text-gray-500 mt-1">기업 부담금 면제를 위해 근로자 프로필 정보와 복지카드/증명서를 수동으로 직접 업로드합니다.</p>
                      </div>
                      <button
                        onClick={() => setShowAddEmployeeModal(false)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">근로자 성명 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: 김동현"
                            value={newEmpName}
                            onChange={(e) => setNewEmpName(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">발급용 사원코드 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: BP-0219"
                            value={newEmpCode}
                            onChange={(e) => setNewEmpCode(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">배정 소속 부서 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: ESG 환경지원팀"
                            value={newEmpDept}
                            onChange={(e) => setNewEmpDept(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">장애 유형 및 정도 *</label>
                          <select
                            value={newEmpDisabilityType}
                            onChange={(e) => setNewEmpDisabilityType(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-sans"
                          >
                            <option value="지체장애 중증 (하반신)">지체장애 중증 (하반신)</option>
                            <option value="지체장애 중증 (상지 가능)">지체장애 중증 (상지 가능)</option>
                            <option value="지체장애 경증">지체장애 경증</option>
                            <option value="청각장애 경증">청각장애 경증</option>
                            <option value="청각장애 중증">청각장애 중증</option>
                            <option value="시각장애 경증">시각장애 경증</option>
                            <option value="시각장애 중증">시각장애 중증</option>
                            <option value="발달장애 중증">발달장애 중증</option>
                            <option value="뇌병변장애 중증">뇌병변장애 중증</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">수행 직무 (수행할 업무 내용) *</label>
                        <input
                          type="text"
                          required
                          placeholder="예: 친환경 탄소 가공 데이터 분류 및 데이터 라벨링"
                          value={newEmpRole}
                          onChange={(e) => setNewEmpRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">재직 상태 *</label>
                          <select
                            value={newEmpStatus}
                            onChange={(e) => setNewEmpStatus(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-sans"
                          >
                            <option value="재직중">재직중</option>
                            <option value="휴직">휴직</option>
                            <option value="퇴사">퇴사</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">실시간 출퇴근 인증 수단 *</label>
                          <select
                            value={newEmpAttendanceMethod}
                            onChange={(e) => setNewEmpAttendanceMethod(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-sans"
                          >
                            <option value="재택근무지 IP 일치인증">재택근무지 IP 일치인증</option>
                            <option value="안면인식 로그인 완료">안면인식 로그인 완료</option>
                            <option value="모바일 근태앱 전송">모바일 근태앱 전송</option>
                            <option value="실시간 원격 화상 생체인증">실시간 원격 화상 생체인증</option>
                          </select>
                        </div>
                      </div>

                      {/* File Upload zone 1: Avatar Profile Image */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">근로자 프로필 이미지 (드래그 앤 드롭 또는 선택)</label>
                        <div
                          onDragOver={(e) => handleDragOver(e, "avatar")}
                          onDragLeave={() => handleDragLeave("avatar")}
                          onDrop={(e) => handleDrop(e, "avatar")}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center gap-2 ${
                            dragOverAvatar
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {newEmpAvatar ? (
                            <div className="flex items-center gap-3">
                              <img src={newEmpAvatar} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <span className="text-[10px] text-emerald-600 font-bold block">이미지 로드 완료</span>
                                <button
                                  type="button"
                                  onClick={() => setNewEmpAvatar("")}
                                  className="text-[9px] text-red-500 underline"
                                >
                                  이미지 삭제
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-gray-400" />
                              <p className="text-[11px] text-gray-400">
                                <strong>드래그 앤 드롭</strong> 하거나 클릭하여 이미지를 등록하세요.
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "avatar")}
                                className="hidden"
                                id="avatar-file-input"
                              />
                              <label
                                htmlFor="avatar-file-input"
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-bold cursor-pointer transition text-[10px]"
                              >
                                파일 선택
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      {/* File Upload zone 2: Disability card/Certificate document */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">장애인증명서 또는 복지카드 사본 사본 업로드 (필수 증빙서류) *</label>
                        <div
                          onDragOver={(e) => handleDragOver(e, "doc")}
                          onDragLeave={() => handleDragLeave("doc")}
                          onDrop={(e) => handleDrop(e, "doc")}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center gap-2 ${
                            dragOverDoc
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {newEmpDocument ? (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="font-mono text-[10px] font-bold">{newEmpDocument} (등록 완료)</span>
                              <button
                                type="button"
                                onClick={() => setNewEmpDocument("")}
                                className="text-gray-400 hover:text-red-500 ml-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <FileText className="w-6 h-6 text-gray-400" />
                              <p className="text-[11px] text-gray-400">
                                <strong>장애인 증빙 PDF 또는 이미지 사본</strong>을 드래그하여 등록하세요.
                              </p>
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg font-sans"
                                onChange={(e) => handleFileChange(e, "doc")}
                                className="hidden"
                                id="doc-file-input"
                              />
                              <label
                                htmlFor="doc-file-input"
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-bold cursor-pointer transition text-[10px]"
                              >
                                증빙서류 선택
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setShowAddEmployeeModal(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md"
                        >
                          등록 및 업로드 완료
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal 2: Add Company Modal */}
            <AnimatePresence>
              {showAddCompanyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <h3 className="font-black text-lg text-[#073B31]">신규 위탁 회원사 채널 생성</h3>
                      <button
                        onClick={() => setShowAddCompanyModal(false)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCompany} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">회원사 이름 *</label>
                        <input
                          type="text"
                          required
                          placeholder="예: (주)한국미래정보기술"
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">위탁 업무 및 채널 요약 정보</label>
                        <textarea
                          rows={3}
                          placeholder="예: 재택 빅데이터 라벨링 근로자 5명 위탁 운영 중."
                          value={newCompDesc}
                          onChange={(e) => setNewCompDesc(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setShowAddCompanyModal(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#073B31] hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md"
                        >
                          회원사 등록 생성
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
