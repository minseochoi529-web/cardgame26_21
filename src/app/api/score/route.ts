import { NextResponse } from "next/server";

// AI 테스트 계정/이름 판별 함수
function isAiTestUser(name: string): boolean {
  if (!name) return true;
  const lower = name.toLowerCase().trim();
  const testKeywords = [
    "ai",
    "test",
    "테스트",
    "순위테스터",
    "최고속플레이어",
    "testplayer",
    "bot",
    "봇",
  ];
  return testKeywords.some((keyword) => lower.includes(keyword));
}

// 'mm:ss.s' 또는 문자열 시간을 초 단위 숫자로 변환하는 헬퍼 함수
function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 9999999;
  const clean = timeStr.replace(/"/g, "").trim();
  const parts = clean.split(":");
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  const val = parseFloat(clean);
  return isNaN(val) ? 9999999 : val;
}

// 구글 스프레드시트 CSV 데이터를 파싱하는 함수
async function fetchSheetRankings(
  playerName: string,
  currentFinishTime: string,
  currentScore: number
) {
  const SPREADSHEET_ID = "1GNbLtSBg3CMgFxx0VzKjQds9WYLCUu_F0Gwvwcut2cw";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

  try {
    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`CSV Fetch failed with status ${res.status}`);
    }
    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    const records: Array<{
      name: string;
      score: number;
      finishtime: string;
      seconds: number;
    }> = [];

    // 첫 행(헤더) 제외하고 행 파싱
    for (let i = 1; i < lines.length; i++) {
      // CSV 단순 분리 (큰따옴표 감싼 값 처리)
      const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      const cols = matches
        ? matches.map((m) => m.replace(/^"|"$/g, "").trim())
        : lines[i].split(",").map((s) => s.replace(/^"|"$/g, "").trim());

      if (cols.length >= 4) {
        const rName = cols[1];
        const rScore = parseFloat(cols[2]) || 0;
        const rFinishtime = cols[3];
        const sec = parseTimeToSeconds(rFinishtime);

        // AI 테스트 데이터가 시트에 남아있더라도 랭킹 목록에서 제외
        if (rName && rFinishtime && !isAiTestUser(rName)) {
          records.push({
            name: rName,
            score: rScore,
            finishtime: rFinishtime,
            seconds: sec,
          });
        }
      }
    }

    // 종료시간 오름차순(가장 빠른 시간 우선) 정렬
    records.sort((a, b) => a.seconds - b.seconds);

    // 현재 플레이어가 실제 사용자인 경우 순위 계산
    const currentSeconds = parseTimeToSeconds(currentFinishTime);
    let myRank: number | null = null;

    if (!isAiTestUser(playerName)) {
      for (let i = 0; i < records.length; i++) {
        if (
          records[i].name === playerName &&
          Math.abs(records[i].seconds - currentSeconds) < 0.2
        ) {
          myRank = i + 1;
          break;
        }
      }

      // 시트에 아직 방금 기록이 반영 안 되었을 경우 가상 순위 계산
      if (myRank === null) {
        let virtualRank = 1;
        for (let i = 0; i < records.length; i++) {
          if (currentSeconds < records[i].seconds) {
            break;
          }
          virtualRank++;
        }
        myRank = virtualRank;

        records.push({
          name: playerName,
          score: currentScore,
          finishtime: currentFinishTime,
          seconds: currentSeconds,
        });
        records.sort((a, b) => a.seconds - b.seconds);
      }
    }

    // 실제 사용자 상위 3명 추출
    const top3 = records.slice(0, 3).map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      finishtime: item.finishtime,
      score: item.score,
    }));

    return { myRank, top3 };
  } catch (error) {
    console.error("fetchSheetRankings error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, score, finishtime } = body;
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    // AI 테스트 플레이어 판별
    const isAi = isAiTestUser(name);

    // 1. AI 테스트가 아닐 때만 구글 스프레드시트에 저장 요청 전송!
    if (!isAi && scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch (postErr) {
        console.error("구글 스크립트 전송 실패:", postErr);
      }
    } else if (isAi) {
      console.log(`[AI 테스트 감지] '${name}' 데이터는 구글 시트에 저장하지 않습니다.`);
    }

    // 2. 구글 스프레드시트의 실시간 CSV 데이터를 읽어와 실제 유저 기준 Top 3 및 myRank 계산
    const rankingData = await fetchSheetRankings(name, finishtime, score);

    if (rankingData) {
      return NextResponse.json({
        result: "success",
        myRank: rankingData.myRank,
        top3: rankingData.top3,
      });
    }

    return NextResponse.json({
      result: "success",
      myRank: 1,
      top3: [{ rank: 1, name, finishtime, score }],
    });
  } catch (error: any) {
    console.error("Score proxy error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit score" },
      { status: 500 }
    );
  }
}
