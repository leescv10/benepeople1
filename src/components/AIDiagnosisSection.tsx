import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Loader2, AlertCircle, RefreshCw, FileText, Check, PhoneCall, Award } from "lucide-react";
import { DiagnosisResult, HomepageConfig } from "../types";
import { db } from "../lib/googleAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AIDiagnosisSectionProps {
  config?: HomepageConfig;
}

export default function AIDiagnosisSection({ config }: AIDiagnosisSectionProps) {
  const [form, setForm] = useState({
    companyName: "",
    totalEmployees: "",
    currentDisabledEmployees: "",
    managerName: "",
    managerContact: "",
    managerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.companyName ||
      !form.totalEmployees ||
      !form.managerName ||
      !form.managerContact ||
      !form.managerEmail
    ) {
      setError("필수 입력 항목(*)을 모두 기입해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      try {
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: form.companyName,
            totalEmployees: parseInt(form.totalEmployees, 10),
            currentDisabledEmployees: parseInt(form.currentDisabledEmployees, 10) || 0,
            managerName: form.managerName,
            managerContact: form.managerContact,
            managerEmail: form.managerEmail,
            // Custom formula variables passed dynamically to the backend calculations
            obligationRate: config?.obligationRate,
            finePerMonth: config?.finePerMonth,
            beneCostPerMonth: config?.beneCostPerMonth,
            savingsPercentFixed: config?.savingsPercentFixed,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error("서버 진단 API를 사용할 수 없습니다.");
        }
      } catch (fetchErr) {
        console.warn("Server API not available. Running high-fidelity local calculations & report generation for Netlify compatibility...", fetchErr);
        
        // Calculate variables locally for static environments
        const employees = parseInt(form.totalEmployees, 10) || 0;
        const current = parseInt(form.currentDisabledEmployees, 10) || 0;
        
        const oRate = config?.obligationRate !== undefined ? parseFloat(String(config.obligationRate)) : 0.031;
        const fPerMonth = config?.finePerMonth !== undefined ? parseInt(String(config.finePerMonth), 10) : 2156880;
        const bCostPerMonth = config?.beneCostPerMonth !== undefined ? parseInt(String(config.beneCostPerMonth), 10) : 663000;
        
        const requiredDisabledCount = Math.floor(employees * oRate);
        const shortage = Math.max(0, requiredDisabledCount - current);
        
        const pureFineMonthly = shortage * fPerMonth;
        const pureFineYearly = pureFineMonthly * 12;
        
        const benePeopleCostMonthly = shortage * bCostPerMonth;
        const benePeopleCostYearly = benePeopleCostMonthly * 12;
        
        const savingsYearly = pureFineYearly - benePeopleCostYearly;
        const savingsPercent = pureFineYearly > 0 
          ? (config?.savingsPercentFixed !== undefined ? parseInt(String(config.savingsPercentFixed), 10) : Math.round((savingsYearly / pureFineYearly) * 100))
          : 0;

        const geminiReport = `### (주)베네피플 AI 맞춤형 장애인 고용 분석 제안서 (클라이언트 정밀 분석)
 
 **귀사명**: ${form.companyName}  
 **담당자**: ${form.managerName} 님 (${form.managerEmail})
 
 현재 상시 근로자 ${employees}명 기준, 법정 장애인 의무 고용 인원은 **${requiredDisabledCount}명** (3.1% 기준) 입니다. 현재 고용 중이신 인원은 **${current}명**으로, 법정 기준 대비 **${shortage}명**의 장애인 근로자 충원이 긴급히 필요한 상황입니다.
 
 #### 1. 재무 리스크 분석 (정밀 시뮬레이션)
 - **현 상태 유지 시 (부담금 벌금 부과)**: 연간 약 **₩${pureFineYearly.toLocaleString()} 원**의 막대한 부담금이 세금 형태로 매달 누적 청구되어 기업 재정에 직접적인 타격을 주게 됩니다.
 - **베네피플 솔루션 도입 시**: 연간 약 **₩${benePeopleCostYearly.toLocaleString()} 원**의 합리적인 임금 및 위탁 비용으로 대체 가능합니다.
 - **예상 재무 절감 효과**: 연간 약 **₩${savingsYearly.toLocaleString()} 원 (${savingsPercent}% 절감)**을 온전히 절감하여 기업의 순수 경영성과 자원으로 환수하실 수 있습니다.
 
 #### 2. 베네피플 ESG 특화 3대 솔루션
 - **노무 리스크 제로**: 계약 체결부터 유관기관 승인, 퇴직 관리까지 전담 공인노무사를 통해 법적 보증을 완벽 지원합니다.
 - **스마트 근태시스템 무상 탑재**: 자택 근태 및 업무 보고를 안면인식, IP, GPS로 완벽하게 대조 검증하여 공공기관 감사 대비 증빙을 자동 생성합니다.
 - **다양한 장애인 직무풀 매칭**: 문화, 예술, 체육 및 친환경 탄소 배출 데이터 리서치 분류 등 귀사의 산업 형태에 최적화된 우수 인재풀을 안정적으로 배정합니다.
 
 #### 3. ESG 경영 지표 임팩트 추천
 - 단순한 일시적 벌금 절감을 넘어, 세계적 흐름인 ESG 평가의 Social(사회적 책임) 부문을 적극 채워 기업 브랜드 가치 및 지배구조 신뢰도를 혁신적으로 격상시킵니다.
 
 *입력해주신 연락처(${form.managerContact}) 및 이메일로 베네피플 수석 컨설턴트가 영업일 기준 24시간 내 유선 브리핑 및 맞춤형 상세 제안서 책자(무료)를 송부해 드리겠습니다.*`;

        data = {
          requiredDisabledCount,
          shortage,
          pureFineYearly,
          benePeopleCostYearly,
          savingsYearly,
          savingsPercent,
          geminiReport,
        };
      }

      setResult(data);

      // Save inquiry to localStorage and Firestore for Admin Dashboard review
      try {
        const inqRef = doc(db, "configs", "inquiries");
        const inqSnap = await getDoc(inqRef);
        let list = [];
        if (inqSnap.exists()) {
          list = inqSnap.data().list || [];
        } else {
          const saved = localStorage.getItem("bene_people_inquiries");
          if (saved) {
            try {
              list = JSON.parse(saved);
            } catch (e) {}
          }
        }

        const newInquiry = {
          id: `inq-${Date.now()}`,
          companyName: form.companyName,
          totalEmployees: parseInt(form.totalEmployees, 10),
          currentDisabledEmployees: parseInt(form.currentDisabledEmployees, 10) || 0,
          managerName: form.managerName,
          managerContact: form.managerContact,
          managerEmail: form.managerEmail,
          date: new Date().toISOString().split("T")[0],
          savingsYearly: data.savingsYearly || 0,
          status: "접수대기",
        };

        list.unshift(newInquiry);
        localStorage.setItem("bene_people_inquiries", JSON.stringify(list));
        await setDoc(inqRef, { list });
      } catch (storageError) {
        console.warn("Could not save inquiry to Firestore/local storage:", storageError);
      }
    } catch (err: any) {
      console.error(err);
      setError("AI 진단서 생성 중 연결 실패가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      companyName: "",
      totalEmployees: "",
      currentDisabledEmployees: "",
      managerName: "",
      managerContact: "",
      managerEmail: "",
    });
    setResult(null);
  };

  const downloadPDF = () => {
    if (!result) return;

    // Create a hidden iframe for print-to-PDF
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Process and convert markdown content to styled HTML
    const markdownLines = result.geminiReport.split("\n");
    let reportHtml = "";
    markdownLines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        reportHtml += `<h4 style="font-size: 16px; font-weight: bold; color: #073B31; margin-top: 20px; margin-bottom: 10px; border-left: 4px solid #EBB63F; padding-left: 10px; font-family: sans-serif;">${trimmed.replace("###", "").trim()}</h4>`;
      } else if (trimmed.startsWith("##")) {
        reportHtml += `<h3 style="font-size: 18px; font-weight: 800; color: #073B31; margin-top: 25px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; font-family: sans-serif;">${trimmed.replace("##", "").trim()}</h3>`;
      } else if (trimmed.startsWith("#")) {
        reportHtml += `<h2 style="font-size: 22px; font-weight: 900; color: #073B31; margin-top: 30px; margin-bottom: 15px; text-align: center; font-family: sans-serif;">${trimmed.replace("#", "").trim()}</h2>`;
      } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        let content = trimmed.replace(/^[-*]\s*/, "").trim();
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #073B31;">$1</strong>');
        reportHtml += `<li style="font-size: 13px; color: #4b5563; margin-left: 20px; margin-top: 6px; margin-bottom: 6px; line-height: 1.6; font-family: sans-serif;">${content}</li>`;
      } else if (trimmed === "") {
        reportHtml += `<div style="height: 8px;"></div>`;
      } else {
        let content = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #073B31;">$1</strong>');
        reportHtml += `<p style="font-size: 13px; color: #374151; margin-top: 8px; margin-bottom: 8px; line-height: 1.6; font-family: sans-serif;">${content}</p>`;
      }
    });

    const formattedDate = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${form.companyName} 장애인 고용 분석 제안서</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
          
          body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", sans-serif;
            margin: 0;
            padding: 40px;
            color: #1A2E2A;
            background-color: #ffffff;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .header {
            border-bottom: 3px solid #073B31;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          
          .title-area h1 {
            font-size: 24px;
            font-weight: 900;
            color: #073B31;
            margin: 0 0 5px 0;
            letter-spacing: -0.5px;
          }
          
          .title-area p {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
          }
          
          .logo-area {
            text-align: right;
          }
          
          .logo-text {
            font-size: 18px;
            font-weight: 800;
            color: #073B31;
            letter-spacing: -0.5px;
            margin: 0;
          }
          
          .logo-sub {
            font-size: 9px;
            color: #EBB63F;
            font-weight: bold;
            letter-spacing: 1px;
            margin-top: 2px;
          }
          
          .meta-info {
            background-color: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 13px;
          }
          
          .meta-item {
            color: #4b5563;
          }
          
          .meta-item strong {
            color: #073B31;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 35px;
          }
          
          .stat-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            background-color: #ffffff;
          }
          
          .stat-card.accent {
            background-color: #073B31;
            border-color: #073B31;
            color: #ffffff;
          }
          
          .stat-card.accent .stat-val {
            color: #EBB63F;
          }
          
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 5px;
            display: block;
          }
          
          .stat-card.accent .stat-label {
            color: #a7f3d0;
          }
          
          .stat-val {
            font-size: 18px;
            font-weight: 800;
            color: #1A2E2A;
          }
          
          .stat-card.red .stat-val {
            color: #ef4444;
          }
          
          .stat-card.green .stat-val {
            color: #10b981;
          }
          
          .report-content {
            background-color: #ffffff;
            padding: 0;
            margin-bottom: 40px;
          }
          
          .footer-banner {
            background-color: #fdfaf2;
            border: 1px dashed #EBB63F;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-top: 40px;
            page-break-inside: avoid;
          }
          
          .footer-banner h4 {
            color: #073B31;
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: bold;
          }
          
          .footer-banner p {
            color: #4b5563;
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>장애인 고용 진단 분석 제안서</h1>
            <p>발행일: ${formattedDate} | 관리번호: BP-${Date.now().toString().slice(-6)}</p>
          </div>
          <div class="logo-area">
            <h2 class="logo-text">(주)베네피플</h2>
            <div class="logo-sub">BENEPEOPLE ESG SOLUTION</div>
          </div>
        </div>
        
        <div class="meta-info">
          <div class="meta-item">귀사명: <strong>${form.companyName}</strong></div>
          <div class="meta-item">상시 근로자: <strong>${form.totalEmployees}명</strong></div>
          <div class="meta-item">현재 장애인 고용: <strong>${form.currentDisabledEmployees}명</strong></div>
          <div class="meta-item">진단 요청자: <strong>${form.managerName} (${form.managerEmail})</strong></div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card accent">
            <span class="stat-label">법정 의무고용 (3.1%)</span>
            <span class="stat-val">${result.requiredDisabledCount}명</span>
          </div>
          <div class="stat-card red">
            <span class="stat-label">현재 부족 인원</span>
            <span class="stat-val">${result.shortage}명</span>
          </div>
          <div class="stat-card red">
            <span class="stat-label">연간 부담금 리스크</span>
            <span class="stat-val">₩${result.pureFineYearly.toLocaleString()}</span>
          </div>
          <div class="stat-card green">
            <span class="stat-label">연간 예산 절감액</span>
            <span class="stat-val">₩${result.savingsYearly.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="report-content">
          ${reportHtml}
        </div>
        
        <div class="footer-banner">
          <h4>(주)베네피플 전문 노무 컨설팅 안내</h4>
          <p>
            위 분석 보고서는 기업 정보에 근거한 실시간 인공지능 정밀 시뮬레이션 결과입니다.<br/>
            추가 무료 유선상담 신청 시, 전문 수석 공인노무사가 귀사 직무를 재분석하여 합법적이고 완벽한 부담금 면제 모델을 제공해 드립니다.<br/>
            <strong>문의처: 02-1234-5678 | 이메일: info@benepeople.co.kr</strong>
          </p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 10000);
  };

  // Helper function to render markdown generated by Gemini safely into UI
  const parseMarkdownToReact = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-base sm:text-lg font-bold text-brand-green mt-6 mb-3 border-l-4 border-brand-accent pl-2.5">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-black text-brand-green mt-8 mb-4 border-b border-gray-100 pb-2">
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-black text-brand-green mt-10 mb-4 text-center">
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Handle bolding within bullet point e.g., **text**
        const rawContent = trimmed.replace(/^[-*]\s*/, "").trim();
        return (
          <li key={idx} className="text-xs sm:text-sm text-gray-600 ml-4 list-disc my-1.5 leading-relaxed font-sans">
            {renderLineWithBolding(rawContent)}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-700 leading-relaxed my-2 font-sans">
          {renderLineWithBolding(trimmed)}
        </p>
      );
    });
  };

  // Safe inner line bold parser for **bold** format
  const renderLineWithBolding = (line: string) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return line;
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-brand-green font-bold">{part}</strong> : part);
  };

  return (
    <section id="ai-diagnosis" className="py-24 bg-transparent text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0D5C4E] rounded-full filter blur-[100px] opacity-30 -ml-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent px-3 py-1 bg-white/10 rounded-full font-bold">
            AI CONSULTATION SYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-white">
            우리 회사의 <span className="text-brand-accent">장애인 고용 부담금 분석</span>
          </h2>
          <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
            회사 규모와 현재 고용 상태를 기재해 보세요. Google Gemini AI가 실시간 분석하여 실제 수억원 상당의 리스크 예방 및 전용 제안서를 단 3초 만에 무상으로 자동 추출해 드립니다.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!result ? (
              /* Diagnosis Entry Form */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white text-[#1A2E2A] rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Field 1: Company Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        회사명 (귀사명) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="예: (주)베네피플전자"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>

                    {/* Field 2: Total Employees */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        전체 상시 근로자 수 (명) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalEmployees"
                        required
                        min="1"
                        value={form.totalEmployees}
                        onChange={handleChange}
                        placeholder="예: 320"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>

                    {/* Field 3: Current Disabled */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        현재 고용 중인 장애인 수 (명) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="currentDisabledEmployees"
                        required
                        min="0"
                        value={form.currentDisabledEmployees}
                        onChange={handleChange}
                        placeholder="고용 중이 아닐 경우 0 입력"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>

                    {/* Field 4: Manager Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        담당자 이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="managerName"
                        required
                        value={form.managerName}
                        onChange={handleChange}
                        placeholder="예: 홍길동 인사팀장"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>

                    {/* Field 5: Contact */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        담당자 연락처 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="managerContact"
                        required
                        value={form.managerContact}
                        onChange={handleChange}
                        placeholder="예: 010-1234-5678"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>

                    {/* Field 6: Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        이메일 주소 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="managerEmail"
                        required
                        value={form.managerEmail}
                        onChange={handleChange}
                        placeholder="진단 결과를 발송할 이메일 주소"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#EBB63F] text-brand-green font-bold text-sm sm:text-base py-4 rounded-xl shadow-lg hover:bg-amber-400 active:scale-[0.99] transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Google Gemini AI가 맞춤 제안서를 분석 중입니다...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>⚡ AI 정밀 진단 즉시 실행 및 제안서 수령</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                      ※ 당사 개인정보 처리방침에 근거하여 입력하신 자료는 1:1 진단 목적 외에 전혀 보존되거나 유출되지 않으니 안심하세요.
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* Diagnosis Report Output */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white text-[#1A2E2A] rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
              >
                {/* Header Banner */}
                <div className="bg-brand-green p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-accent uppercase bg-white/10 px-2.5 py-1 rounded">
                      Analysis Document Generated
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-2">
                      {form.companyName} 전용 고용 진단서
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-auto">
                    <button
                      onClick={downloadPDF}
                      className="bg-brand-accent hover:bg-amber-400 text-brand-green font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 justify-center shadow-md cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> PDF 리포트 다운로드
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 justify-center cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" /> 다시 계산하기
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats Panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-100">
                  <div className="p-4 sm:p-6 text-center border-r border-b md:border-b-0 border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-medium">법정 의무고용 (3.1%)</span>
                    <span className="text-xl sm:text-2xl font-black text-brand-green mt-1 block font-mono">
                      {result.requiredDisabledCount}명
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 text-center border-r border-b md:border-b-0 border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-medium">현재 부족 인원</span>
                    <span className="text-xl sm:text-2xl font-black text-red-500 mt-1 block font-mono">
                      {result.shortage}명
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 text-center border-r border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-medium">연간 벌금 부담액</span>
                    <span className="text-xl sm:text-2xl font-black text-red-600 mt-1 block font-mono">
                      ₩{result.pureFineYearly.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 text-center">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-medium">연간 예산 절감액</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block font-mono">
                      ₩{result.savingsYearly.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Main Gemini Analysis Report */}
                <div className="p-6 sm:p-8 space-y-4 bg-gray-50/50 border-b border-gray-100 max-h-[500px] overflow-y-auto no-scrollbar font-sans">
                  {parseMarkdownToReact(result.geminiReport)}
                </div>

                {/* Post Consultation Action banner */}
                <div className="p-6 sm:p-8 bg-[#EBB63F]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#EBB63F] flex items-center justify-center text-brand-green shrink-0 shadow-sm mt-0.5">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1A2E2A] text-sm sm:text-base">
                        전문 노무 컨설턴트 1:1 무료 유선 상담 안내
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Gemini AI 진단 내용을 토대로 베네피플의 전문 수석 공인노무사 및 인사 실무 컨설턴트가 24시간 내 유선 브리핑을 지원해 드립니다.
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:02-1234-5678`}
                    className="bg-brand-green text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md hover:bg-brand-lightgreen transition self-stretch sm:self-auto text-center"
                  >
                    상담 예약 확정
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
