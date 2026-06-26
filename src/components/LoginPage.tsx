import React, { useState } from "react";
import { motion } from "motion/react";
import { LogIn, ShieldCheck, Mail, Lock, ArrowLeft, Building2, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onClose: () => void;
  onLoginSuccess: (companyName: string) => void;
}

const DEMO_ACCOUNTS = [
  {
    type: "demo1",
    email: "admin@benepeople.com",
    label: "1번 데모 회원사",
  },
  {
    type: "demo2",
    email: "partner@esgcorp.kr",
    label: "2번 데모 회원사",
  },
] as const;

export default function LoginPage({ onClose, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleDemoFill = (type: "demo1" | "demo2") => {
    const account = DEMO_ACCOUNTS.find((demoAccount) => demoAccount.type === type);
    if (account) {
      setEmail(account.email);
      setPassword("");
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("아이디(이메일)와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok && result.companyName) {
        onLoginSuccess(result.companyName);
      } else {
        setError(result.error || "일치하는 계정 정보가 없습니다. 아이디와 비밀번호를 다시 확인해 주세요.");
      }
    } catch {
      setLoading(false);
      setError("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-green/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative light elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0D5C4E] rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white text-[#1A2E2A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative z-10"
      >
        {/* Back Button & Header Row */}
        <div className="p-6 pb-0 flex justify-between items-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-lightgreen transition"
          >
            <ArrowLeft className="w-4 h-4" /> 메인으로 돌아가기
          </button>
          <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-green text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-lightgreen" />
            보안서버 구동중
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-green text-white rounded-xl flex items-center justify-center text-xl font-black mx-auto shadow-md mb-4">
              B
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-green">
              회원사 전용 로그인
            </h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              (주)베네피플의 차세대 ERP 통합 근태 및 행정 위탁 시스템에 오신 것을 정중히 환영합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / ID Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                회원사 이메일 또는 관리자 ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="name@company.com 또는 admins"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lightgreen focus:border-transparent outline-none text-xs sm:text-sm font-medium transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Utility Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-800 select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green focus:ring-brand-lightgreen border-gray-300 accent-brand-green"
                />
                로그인 기억하기
              </label>
              <a
                href="#ai-diagnosis"
                onClick={onClose}
                className="text-brand-lightgreen font-bold hover:underline"
              >
                비밀번호를 분실하셨나요?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-red-700 text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EBB63F] hover:bg-amber-400 text-brand-green font-bold text-xs sm:text-sm py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>회원사 계정 보안 인증 중...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>회원사 로그인 완료</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mb-3">
              <Building2 className="w-3.5 h-3.5 text-brand-lightgreen" />
              <span>간편 데모 체험용 로그인 계정</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.type}
                  type="button"
                  onClick={() => handleDemoFill(account.type)}
                  className="text-left bg-gray-50 hover:bg-brand-lightgreen/5 border border-gray-200 hover:border-brand-lightgreen/30 p-2.5 rounded-lg text-[10px] text-gray-600 transition"
                >
                  <strong className="block text-brand-green font-bold">{account.label}</strong>
                  {account.email}
                  <span className="block text-[9px] text-gray-400 mt-0.5">
                    데모 비밀번호는 운영 환경 변수로 관리됩니다
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
            아직 회원사가 아니신가요? <br />
            <a
              href="#ai-diagnosis"
              onClick={onClose}
              className="text-brand-lightgreen font-bold underline"
            >
              여기를 클릭해 무료 AI 고용 진단과 가입 상담
            </a>을 무료로 먼저 진행하세요.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
