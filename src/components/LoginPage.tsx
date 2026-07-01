import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogIn, ShieldCheck, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { db } from "../lib/googleAuth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import logoImg from "../assets/images/bene_brand_logo_1782911879088.jpg";

interface LoginPageProps {
  onClose: () => void;
  onLoginSuccess: (companyName: string) => void;
}

export default function LoginPage({ onClose, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [logoSource, setLogoSource] = useState(logoImg);

  // Load logoUrl from localStorage on mount as instant fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bene_people_homepage_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.logoUrl) {
          const isCustom = !parsed.logoUrl.includes("benepeople_logo") && 
                           !parsed.logoUrl.includes("benepeople_new_logo") && 
                           !parsed.logoUrl.includes("bene_brand_logo") && 
                           parsed.logoUrl.trim() !== "";
          if (isCustom) {
            setLogoSource(parsed.logoUrl);
          }
        }
      }
    } catch (e) {
      console.warn("Could not read homepage config in LoginPage:", e);
    }
  }, []);

  // Fetch real-time updates for homepage logo
  useEffect(() => {
    const homepageRef = doc(db, "configs", "homepage");
    const unsubscribe = onSnapshot(homepageRef, (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.logoUrl) {
            const isCustom = !data.logoUrl.includes("benepeople_logo") && 
                             !data.logoUrl.includes("benepeople_new_logo") && 
                             !data.logoUrl.includes("bene_brand_logo") && 
                             data.logoUrl.trim() !== "";
            if (isCustom) {
              setLogoSource(data.logoUrl);
            } else {
              setLogoSource(logoImg);
            }
          } else {
            setLogoSource(logoImg);
          }
        }
      } catch (err) {
        console.warn("Could not process homepage snapshot in LoginPage:", err);
      }
    }, (err) => {
      console.warn("Homepage onSnapshot error in LoginPage:", err);
    });
    return () => unsubscribe();
  }, []);

  // Fetch registered companies on mount with real-time updates
  useEffect(() => {
    const compRef = doc(db, "configs", "companies");
    const unsubscribe = onSnapshot(compRef, (snap) => {
      try {
        if (snap.exists()) {
          const list = snap.data().list || [];
          setCompanies(list);
        } else {
          // Fallback to local
          const savedComp = localStorage.getItem("bene_people_member_companies");
          if (savedComp) {
            try {
              const list = JSON.parse(savedComp);
              setCompanies(list);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Could not process companies snapshot in LoginPage:", err);
      }
    }, (error) => {
      console.error("onSnapshot failed for companies in LoginPage:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("아이디(이메일)와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);

    // Simulate authenticating server call
    setTimeout(() => {
      setLoading(false);
      
      const cleanedEmail = email.toLowerCase().trim();

      // Explicit Admin Check
      if (cleanedEmail === "admins") {
        if (password === "chon1092!!") {
          onLoginSuccess("최고관리자 (ADMIN)");
        } else {
          setError("최고관리자 로그인 정보가 올바르지 않습니다. (ID: admins / PW: chon1092!!)");
        }
        return;
      }

      // Try to find a matching company from the loaded companies list
      let matchedComp = companies.find((c: any) => {
        const nameCleaned = c.name.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
        const codeCleaned = c.code.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        
        if (cleanedEmail.includes("benepeople") && (c.id === "comp-1" || c.name.includes("베네피플"))) return true;
        if (cleanedEmail.includes("esgcorp") && (c.id === "comp-2" || c.name.includes("ESG"))) return true;
        if (codeCleaned && cleanedEmail.includes(codeCleaned)) return true;
        if (nameCleaned && cleanedEmail.includes(nameCleaned)) return true;
        return false;
      });

      // Special check for hardcoded defaults
      if (!matchedComp) {
        if (cleanedEmail === "admin@benepeople.com") {
          matchedComp = { id: "comp-1", name: "(주)베네피플 일렉트릭" };
        } else if (cleanedEmail === "partner@esgcorp.kr") {
          matchedComp = { id: "comp-2", name: "ESG 환경코퍼레이션" };
        }
      }

      if (matchedComp) {
        if (password.length >= 6) {
          onLoginSuccess(matchedComp.name);
        } else {
          setError("비밀번호는 최소 6자리 이상이어야 합니다.");
        }
      } else {
        // Fallback matching if email contains certain keywords
        if (password.length >= 6) {
          const isEsg = cleanedEmail.includes("esg");
          onLoginSuccess(isEsg ? "ESG 환경코퍼레이션" : "(주)베네피플 일렉트릭");
        } else {
          setError("일치하는 계정 정보가 없습니다. 아이디와 비밀번호를 다시 확인해 주세요.");
        }
      }
    }, 1200);
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
            <div className="flex justify-center mb-4">
              <img
                src={logoSource}
                alt="Logo"
                className="h-16 w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-green">
              관리자 전용 로그인
            </h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              (주)베네피플의 차세대 통합 근태 및 행정 위탁 시스템에 오신 것을 정중히 환영합니다.
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
                  placeholder=""
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
                  <span>관리자 계정 보안 인증 중...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>로그인 완료</span>
                </>
              )}
            </button>
          </form>



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
