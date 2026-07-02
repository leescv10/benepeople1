import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (aiApiKey) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined in environment variables. Gemini features will run in mock/fallback mode.");
}

// API Route for AI Diagnosis
app.post("/api/diagnose", async (req, res) => {
  try {
    const {
      companyName,
      totalEmployees,
      currentDisabledEmployees,
      managerName,
      managerContact,
      managerEmail,
      obligationRate,
      finePerMonth,
      beneCostPerMonth,
      savingsPercentFixed,
    } = req.body;

    const employees = parseInt(totalEmployees, 10) || 0;
    const current = parseInt(currentDisabledEmployees, 10) || 0;

    // Use customized parameters if present, otherwise fall back to standard defaults
    const oRate = obligationRate !== undefined ? parseFloat(obligationRate) : 0.031;
    const fPerMonth = finePerMonth !== undefined ? parseInt(finePerMonth, 10) : 2156880;
    const bCostPerMonth = beneCostPerMonth !== undefined ? parseInt(beneCostPerMonth, 10) : 663000;

    const requiredDisabledCount = Math.floor(employees * oRate);
    const shortage = Math.max(0, requiredDisabledCount - current);

    const pureFineMonthly = shortage * fPerMonth;
    const pureFineYearly = pureFineMonthly * 12;

    const benePeopleCostMonthly = shortage * bCostPerMonth;
    const benePeopleCostYearly = benePeopleCostMonthly * 12;

    const savingsYearly = pureFineYearly - benePeopleCostYearly;
    const savingsPercent = pureFineYearly > 0 
      ? (savingsPercentFixed !== undefined ? parseInt(savingsPercentFixed, 10) : Math.round((savingsYearly / pureFineYearly) * 100))
      : 0;

    let geminiReport = "";

    if (ai) {
      try {
        const prompt = `
          장애인 고용 컨설팅 전문 기업 '(주)베네피플'의 수석 컨설턴트로서, 아래 기업의 장애인 고용 실태와 벌금(부담금) 부담을 분석하고 맞춤형 제안서를 정중하고 아주 신뢰감 있는 톤(한국어)으로 작성해 주세요. 마크다운 형식을 사용하여 깔끔하게 서식을 지정해 주십시오.

          [분석 대상 기업 정보]
          - 회사명: ${companyName}
          - 상시 근로자 수: ${employees}명
          - 현재 장애인 고용 인원: ${current}명
          - 법정 의무 고용 인원: ${requiredDisabledCount}명 (3.1% 기준)
          - 미달 인원(부족분): ${shortage}명
          - 연간 예상 고용부담금 (벌금): ₩${pureFineYearly.toLocaleString()} 원
          - 베네피플 솔루션 도입 시 연간 비용: ₩${benePeopleCostYearly.toLocaleString()} 원
          - 연간 예상 절감액: ₩${savingsYearly.toLocaleString()} 원 (약 ${savingsPercent}% 절감)
          - 담당자명: ${managerName}님
          - 연락처: ${managerContact}
          - 이메일: ${managerEmail}

          [제안서 작성 가이드라인]
          1. **친근하고 신뢰감 주는 오프닝**: ${companyName}의 지속 가능한 성장과 ESG 경영을 응원하는 정중한 인사말 및 장애인 의무 고용 비율 강화(3.1%) 트렌드 소개.
          2. **정밀 부담금 분석**: 현재 부과되고 있는 ₩${pureFineYearly.toLocaleString()} 원의 연간 부담금 리스크가 기업 재정에 끼치는 영향을 짚어줌.
          3. **베네피플 3대 솔루션 제안**:
             - **비용 절감**: 연간 약 ₩${savingsYearly.toLocaleString()} 원을 아끼고 비용을 인재 매칭 및 실제 경영성과로 전환하는 구조.
             - **법적/노무 리스크 완벽 배제**: 베네피플의 전담 공인노무사 지원을 통한 4대 보험, 퇴직금, 계약 관리의 합법적 원스톱 처리.
             - **전용 ERP 무상 탑재**: 재택 장애인 근로자의 IP, 안면인식, GPS 기반의 완벽한 실시간 근태 및 업무 성과 증빙 시스템 제공.
          4. **맞춤형 직무 추천**: ${companyName}에 적합한 장애인 직무(친환경 탄소 데이터 수집, ESG 지표 리서치, 사무 지원, 미술/음악/체육 예술인 고용 등) 중 가장 매칭률이 높은 최적의 모델 2~3가지를 제안.
          5. **ESG 경영 임팩트**: 단순 비용 절감을 넘어 ESG 평가의 Social 부문 강화 및 사회적 장벽 극복에 기여하여 사회적 책임을 완벽 실현하는 비전 제시.
          6. **클로징**: ${managerName} 담당자님과의 무료 1:1 방문 상담/간이진단 상세 제안 안내.

          불필요한 인사말이나 서두 꼬리말 없이, 바로 격식 있고 세련된 마크다운 보고서 본문만 출력하세요.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        geminiReport = response.text || "";
      } catch (err: any) {
        console.error("Gemini API Error:", err);
        geminiReport = `### (주)베네피플 맞춤형 장애인 고용 분석 제안서

**귀사명**: ${companyName}  
**담당자**: ${managerName} 님 (${managerEmail})

현재 상시 근로자 ${employees}명 기준, 법정 장애인 의무 고용 인원은 **${requiredDisabledCount}명**입니다. 현재 고용 중이신 인원은 **${current}명**으로, 법정 기준 대비 **${shortage}명**의 장애인 근로자 충원이 긴급히 필요한 상황입니다.

#### 1. 재무 리스크 분석
- **현 상태 유지 시 (부담금 벌금 부과)**: 연간 약 **₩${pureFineYearly.toLocaleString()} 원**의 막대한 부담금이 세금 형태로 매달 누적 청구됩니다.
- **베네피플 솔루션 도입 시**: 연간 약 **₩${benePeopleCostYearly.toLocaleString()} 원**의 합리적인 임금 및 위탁 비용으로 대체 가능합니다.
- **예상 재무 절감 효과**: 연간 약 **₩${savingsYearly.toLocaleString()} 원 (${savingsPercent}% 절감)**을 온전히 절감하여 기업의 순수 경영성과 자원으로 환수하실 수 있습니다.

#### 2. 베네피플만의 핵심 가치
- **노무 리스크 제로**: 계약 체결부터 유관기관 승인, 퇴직 관리까지 전담 공인노무사를 통해 법적 보증을 완료합니다.
- **스마트 ERP 무상 탑재**: 자택 근태 및 업무 보고를 안면인식, IP, GPS로 완벽 보장합니다.
- **다양한 장애인 직무풀**: 문화 예술 체육 및 IT 탄소 배출 모니터링 등 귀사의 성격에 맞춤화된 전문 인재를 배칭합니다.

*본 메일/연락처로 베네피플 수석 컨설턴트가 영업일 기준 24시간 이내에 직접 유선 연락을 드려 1:1 방문 상세 브리핑을 지원해 드리겠습니다.*`;
      }
    } else {
      geminiReport = `### (주)베네피플 AI 시뮬레이션 진단 제안서

**귀사명**: ${companyName}  
**담당자**: ${managerName} 님 (${managerEmail})

현재 상시 근로자 ${employees}명 기준, 법정 장애인 의무 고용 인원은 **${requiredDisabledCount}명**입니다. 현재 고용 중이신 인원은 **${current}명**으로, 법정 기준 대비 **${shortage}명**의 장애인 근로자 충원이 필요한 상황입니다.

#### 1. 재무 리스크 분석
- **현 상태 유지 시 (부담금 벌금 부과)**: 연간 약 **₩${pureFineYearly.toLocaleString()} 원**의 막대한 부담금이 매달 누적 청구됩니다.
- **베네피플 솔루션 도입 시**: 연간 약 **₩${benePeopleCostYearly.toLocaleString()} 원**의 합리적인 비용으로 대체 가능합니다.
- **예상 재무 절감 효과**: 연간 약 **₩${savingsYearly.toLocaleString()} 원 (${savingsPercent}% 절감)**을 온전히 절감하여 기업의 순수 경영성과 자원으로 환수하실 수 있습니다.

#### 2. 베네피플의 원스톱 고용 솔루션
- **채용 및 면접 지원**: 음악, 미술, 체육 및 친환경 탄소 데이터 수집 등 최적의 직무를 매칭합니다.
- **노무 위탁대행**: 전담 공인노무사 배정으로 모든 노무 행정 완벽 처리.
- **전용 ERP 솔루션**: 안면인식, IP, GPS 위치기반을 통한 완벽한 투명한 근태관리.

*입력해 주신 연락처(${managerContact}) 및 이메일로 영업일 기준 24시간 내 전문 제안서 PDF 책자와 방문 상세 안내 일정을 공유드리겠습니다.*`;
    }

    res.json({
      requiredDisabledCount,
      shortage,
      pureFineYearly,
      benePeopleCostYearly,
      savingsYearly,
      savingsPercent,
      geminiReport,
    });
  } catch (error: any) {
    console.error("Diagnosis Route Error:", error);
    res.status(500).json({ error: "간이진단 처리 중 오류가 발생했습니다." });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL !== "1" && !process.env.VERCEL) {
  startServer();
}
