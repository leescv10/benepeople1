import React, { useState } from "react";
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

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInCompany, setLoggedInCompany] = useState<string | null>(null);

  const handleLogout = () => {
    setLoggedInCompany(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-bg scroll-smooth">
      {/* Brand Header */}
      <Header onLoginClick={() => setShowLogin(true)} />

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

      {/* Hero Banner Section */}
      <section className="relative min-h-screen bg-[#073B31] text-white flex items-center justify-center pt-28 pb-20 overflow-hidden">
        {/* Glowing aura decorations */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#EBB63F]/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs sm:text-sm font-bold text-brand-accent tracking-wide uppercase">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              대한민국 1등 장애인 고용 솔루션 파트너
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight">
              장애인 고용부담금 절감, <br className="hidden sm:inline" />
              귀사의 <span className="text-[#EBB63F] underline decoration-4 decoration-brand-accent">성과</span>로 전환해 드립니다.
            </h1>

            <p className="text-gray-300 text-sm sm:text-base xl:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              21년 이상의 전문 아웃소싱 노하우와 맞춤형 장애인 인재 풀을 통해 
              <strong> 채용부터 근태관리, 노무 행정</strong>까지 원스톱으로 무결점 안전 처리합니다.
            </p>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">21+</span>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">업무 및 아웃소싱 연혁</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">25개</span>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">전국 거점 지사</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-accent font-mono">100%</span>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">노무 법적 무결점 승인</p>
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
                    <strong>합법적 의무고용 승인:</strong> 전담 공인 노무사가 상시 근무 실태 조사를 밀착 대조하여 관공서 정상 인정을 완벽 대행합니다.
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
      <IntroSection />

      {/* 3. Why Section */}
      <WhySection />

      {/* 4. Pain Points Section */}
      <PainPointsSection />

      {/* 5. Three Pillars Section */}
      <ThreePillarsSection />

      {/* 6. Budget Calculator */}
      <BudgetCalculator />

      {/* 7. Workflow Process Section */}
      <WorkflowSection />

      {/* 8. ERP Program Simulator */}
      <ERPDemo />

      {/* 9. ESG Impact Section */}
      <ESGImpactSection />

      {/* 10. AI Diagnostics Consultation Form */}
      <AIDiagnosisSection />

      {/* Brand Footer */}
      <Footer />

      {/* LoginPage Modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
            onLoginSuccess={(company) => {
              setLoggedInCompany(company);
              setShowLogin(false);
              // Smooth scroll to ERP Demo section
              setTimeout(() => {
                const erpSection = document.getElementById("erp-demo");
                if (erpSection) {
                  erpSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 100);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
