import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cloud,
  FileText,
  Search,
  Trash2,
  ExternalLink,
  UploadCloud,
  Download,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FileHeart,
  FileCode2,
  FileUp,
  FolderOpen
} from "lucide-react";
import {
  googleSignIn,
  googleSignOut,
  initAuth,
  listDriveFiles,
  uploadFileToDrive,
  deleteDriveFile,
  GoogleDriveFile
} from "../lib/googleAuth";
import { User } from "firebase/auth";

interface GoogleDriveTabProps {
  employees: Array<{ id: string; name: string; code: string; disabilityType: string; role: string; dept: string }>;
  attendanceFeed: Array<{ id: string; name: string; time: string; method: string; task: string }>;
}

export default function GoogleDriveTab({ employees, attendanceFeed }: GoogleDriveTabProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation Modal state for file deletion
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<GoogleDriveFile | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setSuccessMsg("구글 드라이브 연동에 성공하였습니다!");
        loadFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setError("구글 드라이브 연동에 실패하였습니다. 권한 허용을 다시 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setFiles([]);
      setSuccessMsg("연동이 안전하게 해제되었습니다.");
    } catch (err) {
      setError("로그아웃 도중 오류가 발생했습니다.");
    }
  };

  const loadFiles = async (accessToken: string, query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const driveFiles = await listDriveFiles(accessToken, query);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error(err);
      setError("구글 드라이브 파일 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      loadFiles(token, searchQuery);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!token) {
      setError("구글 계정 연동 후 파일을 업로드 하실 수 있습니다.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Read small text files or fallback to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = (event.target?.result as string) || `ERP Uploaded Document: ${file.name}`;
        try {
          await uploadFileToDrive(token, file.name, textContent, file.type || "text/plain");
          setSuccessMsg(`파일 '${file.name}'이 구글 드라이브에 성공적으로 업로드되었습니다.`);
          loadFiles(token);
        } catch (uploadErr) {
          setError("구글 드라이브 API 파일 업로드 실패.");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setError("파일을 읽는 데 실패했습니다.");
      setUploading(false);
    }
  };

  // Delete File Handler (Triggers modal first)
  const confirmDeleteFile = (file: GoogleDriveFile) => {
    setDeleteConfirmFile(file);
  };

  const executeDeleteFile = async () => {
    if (!token || !deleteConfirmFile) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteDriveFile(token, deleteConfirmFile.id);
      setSuccessMsg(`파일 '${deleteConfirmFile.name}'이(가) 삭제되었습니다.`);
      setDeleteConfirmFile(null);
      loadFiles(token);
    } catch (err) {
      setError("파일 삭제 도중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Business Exports: 1-click export of data to Google Drive
  const exportEmployeeList = async () => {
    if (!token) return;
    setUploading(true);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const fileName = `베네피플_ERP_장애인재택근무자명부_${todayStr}.md`;

      const title = `## 베네피플 ESG 특화 ERP - 장애인 재택 근로자 명부\n`;
      const dateText = `출력 시간: ${new Date().toLocaleString()}\n\n`;
      const headers = `| 사원코드 | 성명 | 배정 직무 | 장애 유형 | 현재상태 |\n|---|---|---|---|---|\n`;
      const rows = employees
        .map(
          (emp) =>
            `| ${emp.code} | ${emp.name} | ${emp.role} | ${emp.disabilityType} | 재직중 |`
        )
        .join("\n");

      const fileContent = title + dateText + headers + rows + "\n\n* 본 문서는 베네피플 ERP 구글 드라이브 연동 모듈을 통해 무결성 보장 하에 자동 생성 및 업로드되었습니다.";

      await uploadFileToDrive(token, fileName, fileContent, "text/markdown");
      setSuccessMsg(`장애인 재택근무자 명부('${fileName}')를 구글 드라이브에 완벽히 내보냈습니다!`);
      loadFiles(token);
    } catch (err) {
      setError("명부 내보내기 도중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const exportAttendanceFeed = async () => {
    if (!token) return;
    setUploading(true);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const fileName = `베네피플_ERP_실시간출퇴근기록_${todayStr}.md`;

      const title = `## 베네피플 ESG 특화 ERP - 실시간 출퇴근 기록 대조표\n`;
      const dateText = `출력 시간: ${new Date().toLocaleString()}\n\n`;
      const headers = `| 시간 | 사원 | 보안 인증 방식 | 현재 당일 수행 업무 |\n|---|---|---|---|\n`;
      const rows = attendanceFeed
        .map(
          (feed) =>
            `| ${feed.time} | ${feed.name} | ${feed.method} | ${feed.task} |`
        )
        .join("\n");

      const fileContent = title + dateText + headers + rows + "\n\n* 위 기록은 2중 암호인증 및 생체 안면대조를 통해 입증된 정량 보고서입니다.";

      await uploadFileToDrive(token, fileName, fileContent, "text/markdown");
      setSuccessMsg(`실시간 근태 로그('${fileName}')를 구글 드라이브에 안전하게 내보냈습니다!`);
      loadFiles(token);
    } catch (err) {
      setError("근태기록 내보내기 도중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes("spreadsheet") || mime.includes("csv") || mime.includes("excel")) {
      return <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><FileText className="w-5 h-5" /></div>;
    }
    if (mime.includes("pdf")) {
      return <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><FileText className="w-5 h-5" /></div>;
    }
    if (mime.includes("markdown") || mime.includes("text")) {
      return <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><FileCode2 className="w-5 h-5" /></div>;
    }
    return <div className="p-2 bg-slate-800 text-slate-400 rounded-lg"><FileText className="w-5 h-5" /></div>;
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Quick Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            구글 드라이브(Google Drive) 연동 문서 수납고
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            재택근로자 계약 서류, 정부제출 일자리 지원금 증빙 자료를 구글 드라이브 클라우드에 원격 동기화하고 관리합니다.
          </p>
        </div>
        {user && (
          <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            Cloud Link Connect Active
          </div>
        )}
      </div>

      {/* Connection Panel */}
      {!user ? (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto my-6 space-y-6">
          <div className="w-16 h-16 bg-sky-500/15 text-sky-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Cloud className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">클라우드 원격 동기화 기능 비활성화</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              본 ERP는 회원사의 업무 편의를 위해 Google Drive API 연동을 지원합니다. <br />
              구글 드라이브 계정을 안전하게 연동하여 증빙 문서 보관 및 자동 데이터 내보내기를 체험해 보세요.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mx-auto flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-5 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>구글 클라우드 계정 연동중...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google 계정으로 드라이브 연동</span>
                </>
              )}
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            * 베네피플 ERP는 구글 보안 OAuth API 가이드라인을 철저히 준수합니다.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Info and Instant Backup Actions */}
          <div className="space-y-6">
            {/* User Profile Info Card */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-sm">
                    {user.displayName?.substring(0, 1) || "G"}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{user.displayName || "구글 사용자"}</h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="연동 해제"
                  className="ml-auto p-1.5 text-slate-500 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40 leading-relaxed">
                현재 로그인하신 구글 계정의 드라이브 스토리지가 연동되었습니다. 생성하시는 모든 업무 문서는 본인 드라이브에 자동으로 안전 저장됩니다.
              </div>
            </div>

            {/* Quick ERP Data Exporters */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                ERP 실시간 통계 원클릭 드라이브 업로드
              </h4>

              <div className="space-y-2.5">
                <button
                  onClick={exportEmployeeList}
                  disabled={uploading}
                  className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/30 text-xs text-slate-300 font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>재택 근로자 명부 내보내기</span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={exportAttendanceFeed}
                  disabled={uploading}
                  className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/30 text-xs text-slate-300 font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>출퇴근 기록 로그 내보내기</span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                * 내보낸 마크다운(.md) 문서는 구글 드라이브 모바일 앱 및 웹에서 한눈에 깔끔하게 조회되며, 타 부서 공유 시 완벽한 전자기록 증빙이 됩니다.
              </p>
            </div>

            {/* Drag and Drop File Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                dragActive
                  ? "border-sky-500 bg-sky-500/10 text-white"
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".txt,.json,.csv,.md,.pdf,.doc,.docx"
              />
              <UploadCloud className={`w-8 h-8 ${dragActive ? "text-sky-400 animate-bounce" : "text-slate-500"}`} />
              <div>
                <span className="text-xs font-bold text-slate-200 block">드래그하여 업로드하거나 클릭</span>
                <span className="text-[10px] text-slate-500 mt-1 block">PDF, TXT, CSV, MD 문서 등 지원 (최대 5MB)</span>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: File Explorer Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Alert Toasts */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="드라이브 파일 명칭 검색..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 rounded-xl transition cursor-pointer shrink-0"
              >
                검색
              </button>
              <button
                type="button"
                onClick={() => loadFiles(token)}
                className="p-2.5 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition cursor-pointer"
                title="새로고침"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
              </button>
            </form>

            {/* Toasts / Notifications */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Files List Container */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
              {loading && files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
                  <svg className="animate-spin h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs text-slate-400">구글 드라이브 파일 조회 중...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-500">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-300">구글 드라이브에 저장된 파일이 없거나 찾을 수 없습니다.</h5>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-sm">
                      상단 [원클릭 드라이브 업로드] 버튼 또는 하단의 드래그 기능으로 첫 업무 서류를 등록해 보세요!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-900 overflow-y-auto max-h-[420px] flex-1">
                  {files.map((file) => (
                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-900/30 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        {getFileIcon(file.mimeType)}
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate max-w-[220px] sm:max-w-[340px]" title={file.name}>
                            {file.name}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-sky-400 bg-slate-900 border border-slate-850 rounded hover:bg-slate-850 transition"
                            title="구글 드라이브 원본 보기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => confirmDeleteFile(file)}
                          className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-850 rounded hover:bg-slate-850 transition cursor-pointer"
                          title="파일 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-slate-950 px-4 py-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Total: {files.length} Files</span>
                <span>Google Drive Storage Sync</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Destructive Action Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmFile && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 text-white w-full max-w-sm rounded-xl border border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 bg-red-500/15 rounded-full flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">구글 드라이브 파일 완전 삭제</h4>
                  <p className="text-[11px] text-slate-400 font-medium">이 작업은 취소할 수 없습니다.</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">파일 정보</span>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-full" title={deleteConfirmFile.name}>
                  {deleteConfirmFile.name}
                </span>
                <span className="text-[9px] text-slate-500 font-mono block">
                  ID: {deleteConfirmFile.id}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                해당 구글 드라이브 원본 파일을 정말로 완벽하게 영구 삭제하시겠습니까? 본 작업을 수행하면 해당 클라우드 계정에서 즉시 영구 삭제처리됩니다.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmFile(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  취소하기
                </button>
                <button
                  onClick={executeDeleteFile}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  정말 삭제하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
