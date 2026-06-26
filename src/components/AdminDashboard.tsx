import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  Phone
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Form: Headline & Subtitle */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    헤드라인 서브 배지 텍스트
                  </label>
                  <input
                    type="text"
                    value={editingConfig.heroBadge}
                    onChange={(e) => setEditingConfig({ ...editingConfig, heroBadge: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen outline-none text-xs sm:text-sm font-medium transition"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">메인 배너 최상단에 뜨는 홍보용 원형 배지구</span>
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
                  <span className="text-[10px] text-gray-400 block mt-1">줄바꿈을 적용하면 웹 브라우저에서도 그대로 단락이 맞춰집니다.</span>
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
              </div>

              {/* Right Form: Metrics Panel */}
              <div className="space-y-5 bg-[#073B31]/5 p-5 rounded-2xl border border-dashed border-[#073B31]/10">
                <h3 className="font-extrabold text-xs text-[#073B31] uppercase tracking-wider mb-2">하단 수치 지표 관리 (Metrics)</h3>
                
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

                {/* Simulated Web Preview Card */}
                <div className="p-4 bg-brand-green text-white rounded-xl shadow-sm mt-6">
                  <span className="text-[9px] font-bold text-brand-accent block">REAL-TIME WEB RENDER PREVIEW</span>
                  <div className="mt-2 border-l-2 border-brand-accent pl-2">
                    <span className="text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded-full text-brand-accent inline-block mb-1">{editingConfig.heroBadge}</span>
                    <h4 className="text-xs font-extrabold whitespace-pre-line leading-relaxed">{editingConfig.heroTitle}</h4>
                  </div>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#073B31]">베네피플 위탁 채널 활성 목록</h2>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                현재 시스템에 탑재된 주요 연동 회원사의 실시간 GPS 출퇴근 근태 증빙 현황을 관찰할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-emerald-500/10 bg-emerald-500/5 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#073B31] text-white rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#073B31]">(주)베네피플 일렉트릭</h3>
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">ONLINE</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    재택사무지원 8명 및 ESG리서치 4명 탑재. <br />
                    출퇴근 IP 일치 확인 완료 및 화상 생체인증 가동률 100%.
                  </p>
                </div>
              </div>

              <div className="p-5 border border-emerald-500/10 bg-emerald-500/5 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#073B31] text-white rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#073B31]">ESG 환경코퍼레이션</h3>
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">ONLINE</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    친환경 탄소 데이터 가공인력 15명 탑재. <br />
                    전원 원격 GPS 지오펜싱(Geo-fencing) 실시간 정상 검증 가동중.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
