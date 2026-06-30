import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, ShieldCheck, FileText, Lock, ChevronRight, Scale } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy";
}

export default function TermsModal({ isOpen, onClose, initialTab = "terms" }: TermsModalProps) {
  const [currentTab, setCurrentTab] = useState<"terms" | "privacy">(initialTab);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Synchronize initial tab when opened
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div 
      id="terms-modal-overlay" 
      className="fixed inset-0 bg-slate-950 z-[100] flex flex-col w-screen h-screen overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="text-slate-100 w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Top Header Navigation */}
        <header className="px-6 py-5 sm:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-brand-lightgreen border border-emerald-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-lightgreen font-bold tracking-wider uppercase">
                <span>(주)베네피플 법무 지원</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-400 font-medium">약관 및 정책</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-xl text-white mt-0.5">
                {currentTab === "terms" ? "서비스 이용약관" : "개인정보처리방침"}
              </h3>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="group p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
            aria-label="닫기"
          >
            <span className="hidden sm:inline">닫기</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </header>

        {/* Dynamic Tab Selector */}
        <div className="bg-slate-950/40 border-b border-slate-800/40 px-6 sm:px-8 flex">
          <div className="max-w-4xl mx-auto w-full flex gap-1 pt-2">
            <button
              onClick={() => setCurrentTab("terms")}
              className={`pb-3.5 pt-3 text-sm sm:text-base font-bold px-5 transition-all duration-200 cursor-pointer relative focus:outline-none ${
                currentTab === "terms"
                  ? "text-brand-lightgreen font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>서비스 이용약관</span>
              </div>
              {currentTab === "terms" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-lightgreen rounded-t-full"
                />
              )}
            </button>
            
            <button
              onClick={() => setCurrentTab("privacy")}
              className={`pb-3.5 pt-3 text-sm sm:text-base font-bold px-5 transition-all duration-200 cursor-pointer relative focus:outline-none ${
                currentTab === "privacy"
                  ? "text-brand-lightgreen font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>개인정보처리방침</span>
              </div>
              {currentTab === "privacy" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-lightgreen rounded-t-full"
                />
              )}
            </button>
          </div>
        </div>

        {/* Content Body with Centered Max-Width */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10 sm:py-12 md:py-16 space-y-10 text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
            {currentTab === "terms" ? (
              <div className="space-y-8">
                <div className="border-l-4 border-brand-lightgreen pl-4 py-1.5 bg-brand-lightgreen/5 rounded-r-xl">
                  <p className="text-xs sm:text-sm text-slate-300">
                    본 약관은 (주)베네피플 플랫폼 및 통합 관리시스템을 활용하여 장애인 근로자 채용 및 관리를 위탁하는 회원사와 서비스 제공사 간의 공정하고 투명한 권리 의무 관계를 다룹니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 1 조</span>
                    목적
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    본 약관은 <strong>(주)베네피플</strong>(이하 &quot;회사&quot;)이 제공하는 온·오프라인 하이브리드 장애인 고용 지원 플랫폼, 통합 근태관리 웹/앱 서비스 및 부속 행정 위탁 시스템(이하 &quot;서비스&quot;)의 이용 조건, 회원사 및 이용자의 권리와 의무, 책임 범위와 기타 필요한 사항을 규정하는 것을 목적으로 합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 2 조</span>
                    용어의 정의
                  </h4>
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex gap-2.5">
                      <span className="text-brand-lightgreen font-bold">●</span>
                      <p className="text-slate-300">
                        <strong>&quot;서비스&quot;</strong>라 함은 회사가 자체 개발하여 회원사 및 근로자에게 제공하는 장애인 채용 매칭 솔루션, 지능형 모바일 근태관리 시스템, 고용부담금 실시간 시뮬레이터 및 관련 행정 대행업무 일체를 의미합니다.
                      </p>
                    </div>
                    <div className="flex gap-2.5 border-t border-slate-800/40 pt-3">
                      <span className="text-brand-lightgreen font-bold">●</span>
                      <p className="text-slate-300">
                        <strong>&quot;회원사&quot;</strong>라 함은 본 약관에 동의하고 회사에 장애인 고용 위탁 및 통합 관리시스템 사용을 승인받은 기업고객을 말합니다.
                      </p>
                    </div>
                    <div className="flex gap-2.5 border-t border-slate-800/40 pt-3">
                      <span className="text-brand-lightgreen font-bold">●</span>
                      <p className="text-slate-300">
                        <strong>&quot;근로자&quot;</strong>라 함은 회원사에 채용되어 회사의 출퇴근 관리 서비스를 통해 출퇴근을 인증하고 근태 관리를 받는 장애인 임직원을 말합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 3 조</span>
                    약관의 효력 및 변경
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    본 약관은 플랫폼 화면에 공지하거나 전자우편 등 기타의 방법으로 회원사에 공시함으로써 효력이 발생합니다. 회사는 관계 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있으며, 변경된 약관은 적용일자 7일 전(중요한 사항의 변경인 경우 30일 전)부터 공지합니다. 회원사가 개정 약관 적용일 이후에도 거부 의사 없이 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 4 조</span>
                    회사의 서비스 제공 및 제한
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    회사는 회원사에게 다음과 같은 원스톱 장애인 고용 서비스를 연중무휴 제공하는 것을 원칙으로 합니다.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 bg-slate-900/40 p-4 sm:p-5 rounded-xl border border-slate-800/50">
                    <li>장애인 근로자 1:1 매칭 및 추천</li>
                    <li>지능형 이중 보안(얼굴인식, GPS, 지정 IP) 통합 근태 모니터링 시스템 지원</li>
                    <li>공인노무사가 검수하는 법적 무결점 노무 계약 지원 및 부담금 감면 행정 대행</li>
                    <li>장애유형별 최적 직무 설계 및 주기적 사후 관리 보고서 발행</li>
                  </ol>
                  <p className="text-slate-400 pl-1 text-[11px] sm:text-xs">
                    단, 국가 비상사태, 천재지변, 정기 점검, 기간통신사업자의 회선 장애 등 불가항력적인 원인으로 정상적인 서비스 제공이 불가능한 경우 서비스의 일부 또는 전부가 일시적으로 제한될 수 있습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 5 조</span>
                    회원사의 의무 및 준수사항
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    회원사는 실제 근로의사가 없는 가짜 고용, 명의 대여, 허위 근태 기록 등 고용부담금 부정수급 목적의 부정행위를 하거나 이를 방조해서는 안 됩니다. 회사에서 무상으로 제공하는 근태관리 시스템을 복제, 양도, 해킹하거나 상업적으로 재판매하는 행위는 엄격히 금지되며, 위반 시 서비스 해지 및 민형사상 법적 책임이 부과될 수 있습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 6 조</span>
                    면책 조항
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    회사는 회원사 또는 근로자가 고의로 부정확한 정보나 허위 근태 기록을 전송하여 발생한 불이익 및 고용공단 점검 결과에 대해 민·형사상 책임을 지지 않습니다. 또한, 개별 회원사의 보안 인프라 미비로 인한 정보 노출에 대해서도 책임을 지지 않습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#EBB63F] flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EBB63F]/10 text-[#EBB63F] font-bold">제 7 조</span>
                    관할 법원
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    서비스 이용과 관련하여 회사와 회원사 간에 분쟁이 발생한 경우, 양사 간 상호 합의에 따라 원만히 해결하되 합의가 이루어지지 않을 경우 회사의 본사 소재지를 관할하는 법원을 전합의 관할 법원으로 합니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-l-4 border-brand-lightgreen pl-4 py-1.5 bg-brand-lightgreen/5 rounded-r-xl">
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong>(주)베네피플</strong>은 개인정보 보호법 제30조에 의거하여, 회원사와 근로자의 소중한 생체 인식(안면인식 대조값) 및 개인 식별 정보를 엄격하게 보관·파기하고 법적 테두리 내에서 소중히 다룰 것을 약속합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">1</span>
                    수집하는 개인정보 항목 및 수집 방법
                  </h4>
                  <p className="text-slate-300/90">회사는 서비스 상담 신청, 고용 부담금 계산기 시뮬레이션, 회원사 가입 및 근태관리 시스템 연동 시 다음과 같은 최소한의 개인정보를 수집합니다.</p>
                  
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="space-y-1">
                      <p className="font-extrabold text-white text-xs sm:text-sm">■ 간편 도입문의 및 AI 진단 신청</p>
                      <p className="text-slate-300 pl-3">기업명, 상시 근로자 수, 현재 장애인 고용 수, 담당자 성명, 직책, 연락처, 이메일 주소</p>
                    </div>
                    <div className="space-y-1 border-t border-slate-800/40 pt-3">
                      <p className="font-extrabold text-white text-xs sm:text-sm">■ 회원사 가입 및 관리자 계정</p>
                      <p className="text-slate-300 pl-3">관리자 ID/이메일, 비밀번호, 담당 연락처, 회사 주소, 사업자등록번호</p>
                    </div>
                    <div className="space-y-1 border-t border-slate-800/40 pt-3">
                      <p className="font-extrabold text-white text-xs sm:text-sm">■ 장애인 근로자 근태관리 시스템</p>
                      <p className="text-slate-300 pl-3">근로자 성명, 생년월일, 소속, 직무, 출퇴근 위치 정보(GPS 및 네트워크 지정 IP 수집 정보), 안면인식 암호화 템플릿 정보(원본 이미지는 기기 내 즉시 파기 및 템플릿 대조값만 활용)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">2</span>
                    개인정보의 수집 및 이용 목적
                  </h4>
                  <p className="text-slate-300/90 pl-1">수집된 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구합니다.</p>
                  <ol className="list-decimal pl-5 space-y-2 bg-slate-900/40 p-4 sm:p-5 rounded-xl border border-slate-800/50">
                    <li>상담 신청 기업별 맞춤형 고용부담금 감면 리포트 제공 및 유선 컨설팅</li>
                    <li>회원사 식별 및 통합 출퇴근 현장 원격 근태관리 솔루션 제공</li>
                    <li>의무 고용 적합도 판정 및 공단 서류 제출을 위한 법적 행정 서류 대행</li>
                    <li>불법/허위 고용 방지 목적의 출퇴근 IP/GPS 진위 대조 검증</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">3</span>
                    개인정보의 보유 및 이용 기간
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 아래와 같이 법정 기간 동안 보관합니다.
                  </p>
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">계약 또는 청약철회 등에 관한 기록</span>
                      <span className="text-brand-lightgreen font-bold">5년 (전자상거래법)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-2 pt-1">
                      <span className="text-slate-400">소비자의 불만 또는 분쟁처리에 관한 기록</span>
                      <span className="text-brand-lightgreen font-bold">3년 (전자상거래법)</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">근로계약 및 근태 증빙에 관한 기초 문서</span>
                      <span className="text-brand-lightgreen font-bold">3년 (근로기준법)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">4</span>
                    개인정보의 파기 절차 및 방법
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    개인정보의 파기는 종이에 출력된 경우 분쇄기로 분쇄하거나 소각하여 파기하고, 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법(Low Level Format 등)을 사용하여 영구 삭제합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">5</span>
                    이용자 및 법정대리인의 권리와 그 행사방법
                  </h4>
                  <p className="text-slate-300/90 pl-1">
                    이용자 및 소속 근로자는 언제든지 회사에 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다. 개인정보 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-extrabold text-brand-lightgreen flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-lightgreen/10 text-brand-lightgreen font-bold">6</span>
                    개인정보 보호책임자 및 고충 상담
                  </h4>
                  <p className="text-slate-300/90 pl-1">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 고충처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                  <div className="bg-slate-950/80 p-5 border border-slate-800 rounded-2xl space-y-2.5 font-mono text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">● 개인정보 보호 책임부서</span>
                      <span className="text-white font-medium">(주)베네피플 고객지원팀</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">● 대표전화</span>
                      <span className="text-white font-medium">02-1234-5678</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">● 이메일</span>
                      <span className="text-brand-lightgreen font-bold">info@benepeople.com</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-slate-400">● 주소</span>
                      <span className="text-white font-medium text-right sm:max-w-md">경기도 고양시 행신동 948-1 엘지프라자 7층</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <footer className="px-6 py-5 sm:px-8 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-50">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-lightgreen shrink-0" />
            <span>본 정보는 2026년 6월 29일부터 현행 시행 기준으로 안전하게 관리되고 있습니다.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-brand-lightgreen hover:bg-brand-green text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02] cursor-pointer focus:outline-none"
          >
            확인 및 닫기
          </button>
        </footer>
      </motion.div>
    </div>
  );
}
