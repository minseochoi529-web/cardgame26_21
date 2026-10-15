"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface FruitItem {
  name: string;
  svg: React.ReactNode;
}

const FRUITS: FruitItem[] = [
  {
    name: "사과",
    svg: (
      <>
        <path
          d="M50 30C25 12 9 37 19 65S43 89 50 81C62 92 80 76 84 54S67 15 50 30"
          fill="#ed615b"
        />
        <path d="M50 31L53 14" stroke="#79543c" strokeWidth="5" />
        <path d="M54 23Q72 22 72 9Q56 8 54 23" fill="#548747" />
        <path
          d="M29 42Q23 50 28 60"
          fill="none"
          stroke="#ffb8a3"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    name: "오렌지",
    svg: (
      <>
        <circle cx="50" cy="55" r="33" fill="#f7a52b" />
        <path d="M49 25Q55 7 73 15Q68 32 49 25" fill="#548747" />
        <path
          d="M28 42Q24 50 26 57"
          fill="none"
          stroke="#ffe1a2"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    name: "딸기",
    svg: (
      <>
        <path
          d="M18 39Q20 19 50 30Q80 19 82 39Q75 71 50 89Q24 70 18 39"
          fill="#ed5d71"
        />
        <path
          d="M50 35L25 20L41 21L50 10L58 23L77 21L63 36Z"
          fill="#538747"
        />
        <g fill="#ffe0a1">
          <ellipse cx="34" cy="45" rx="2" ry="4" />
          <ellipse cx="53" cy="49" rx="2" ry="4" />
          <ellipse cx="68" cy="44" rx="2" ry="4" />
          <ellipse cx="42" cy="63" rx="2" ry="4" />
          <ellipse cx="60" cy="65" rx="2" ry="4" />
          <ellipse cx="51" cy="77" rx="2" ry="3" />
        </g>
      </>
    ),
  },
  {
    name: "포도",
    svg: (
      <>
        <g fill="#8863b5">
          <circle cx="35" cy="36" r="13" />
          <circle cx="61" cy="36" r="13" />
          <circle cx="26" cy="55" r="13" />
          <circle cx="50" cy="55" r="13" />
          <circle cx="73" cy="55" r="13" />
          <circle cx="38" cy="74" r="13" />
          <circle cx="62" cy="74" r="13" />
          <circle cx="50" cy="87" r="10" />
        </g>
        <path d="M47 28L53 9" stroke="#79543c" strokeWidth="5" />
        <path d="M51 19Q71 26 77 9Q58 3 51 19" fill="#548747" />
      </>
    ),
  },
  {
    name: "바나나",
    svg: (
      <>
        <path
          d="M19 24Q24 74 76 41L86 25Q93 67 57 82Q19 95 10 49Z"
          fill="#f3cc45"
        />
        <path
          d="M22 44Q35 82 78 48"
          fill="none"
          stroke="#dcae31"
          strokeWidth="3"
        />
        <path d="M81 29L87 18" stroke="#79543c" strokeWidth="7" />
      </>
    ),
  },
  {
    name: "배",
    svg: (
      <>
        <path
          d="M39 27Q50 16 61 27L65 44Q93 66 74 83Q50 99 26 83Q8 66 35 44Z"
          fill="#b8ce60"
        />
        <path
          d="M49 23Q46 12 55 7"
          fill="none"
          stroke="#79543c"
          strokeWidth="5"
        />
        <path d="M51 19Q70 21 71 7Q55 4 51 19" fill="#548747" />
        <path
          d="M30 62Q25 72 34 77"
          fill="none"
          stroke="#e1ebac"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    name: "체리",
    svg: (
      <>
        <path
          d="M28 57Q46 39 55 13Q61 42 74 58"
          fill="none"
          stroke="#548747"
          strokeWidth="4"
        />
        <circle cx="28" cy="68" r="20" fill="#d44760" />
        <circle cx="73" cy="68" r="20" fill="#b9324c" />
        <path d="M53 20Q74 22 77 8Q59 3 53 20" fill="#548747" />
        <g fill="#f798a0">
          <ellipse cx="22" cy="62" rx="4" ry="6" />
          <ellipse cx="67" cy="62" rx="4" ry="6" />
        </g>
      </>
    ),
  },
  {
    name: "수박",
    svg: (
      <>
        <path
          d="M8 36L92 36Q87 91 50 93Q13 91 8 36"
          fill="#568954"
        />
        <path
          d="M15 36L85 36Q79 83 50 85Q21 83 15 36"
          fill="#d4e6a2"
        />
        <path
          d="M21 36L79 36Q73 76 50 78Q27 76 21 36"
          fill="#ed6b70"
        />
        <g fill="#664338">
          <ellipse cx="36" cy="48" rx="2" ry="4" />
          <ellipse cx="63" cy="48" rx="2" ry="4" />
          <ellipse cx="49" cy="63" rx="2" ry="4" />
        </g>
      </>
    ),
  },
];

type GameState = "welcome" | "ready" | "playing" | "paused" | "done";

function formatTime(ms: number) {
  const tenths = Math.floor(ms / 100);
  const minutes = String(Math.floor(tenths / 600)).padStart(2, "0");
  const seconds = String(Math.floor(tenths / 10) % 60).padStart(2, "0");
  const decimal = tenths % 10;
  return `${minutes}:${seconds}.${decimal}`;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CardGamePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [state, setState] = useState<GameState>("welcome");
  const [player, setPlayer] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");

  const [deck, setDeck] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [firstChoice, setFirstChoice] = useState<number | null>(null);

  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState("같은 과일 카드 두 장을 찾아주세요.");
  const [myRank, setMyRank] = useState<number | null>(null);
  const [top3List, setTop3List] = useState<
    Array<{ rank: number; name: string; finishtime: string; score: number }>
  >([]);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const sendScoreToGoogleSheet = async (
    playerName: string,
    scoreValue: number,
    finishTimeStr: string
  ) => {
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName,
          score: scoreValue,
          finishtime: finishTimeStr,
        }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      if (data && data.result === "success") {
        if (data.top3 && Array.isArray(data.top3)) {
          setTop3List(data.top3);
        }
        if (typeof data.myRank === "number") {
          setMyRank(data.myRank);
          // 1, 2, 3위 안에 진입했을 때 순위 경신 알림
          if (data.myRank <= 3) {
            setIsNewRecord(true);
          }
        }
      }
    } catch (err) {
      console.error("구글 시트 연동 오류:", err);
    }
  };

  // 시간 및 타이머 관련 상태
  const [elapsed, setElapsed] = useState(0);
  const [displayTime, setDisplayTime] = useState("00:00.0");
  const startedAtRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const lockedRef = useRef(false);
  const resolveAtRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);
  const stateRef = useRef<GameState>("welcome");

  stateRef.current = state;
  elapsedRef.current = elapsed;

  // 로컬 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem("cardgame-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("cardgame-theme", nextTheme);
  };

  const prepareGame = useCallback(() => {
    setState("ready");
    setFlippedIndices([]);
    setMatchedIndices([]);
    setFirstChoice(null);
    setMoves(0);
    setElapsed(0);
    setDisplayTime("00:00.0");
    lockedRef.current = false;
    resolveAtRef.current = 0;
    remainingRef.current = 0;
    setStatusMessage("같은 과일 카드 두 장을 찾아주세요.");
    setMyRank(null);
    setIsNewRecord(false);

    const indices = Array.from({ length: 8 }, (_, i) => i);
    setDeck(shuffle([...indices, ...indices]));
  }, []);

  const startGame = useCallback(() => {
    setState("playing");
    startedAtRef.current = performance.now();
  }, []);

  const togglePause = useCallback(() => {
    if (stateRef.current === "playing") {
      const now = performance.now();
      const currentElapsed = elapsedRef.current + (now - startedAtRef.current);
      setElapsed(currentElapsed);
      if (lockedRef.current) {
        remainingRef.current = Math.max(0, resolveAtRef.current - now);
      }
      setState("paused");
    } else if (stateRef.current === "paused") {
      const now = performance.now();
      startedAtRef.current = now;
      if (lockedRef.current) {
        resolveAtRef.current = now + remainingRef.current;
      }
      setState("playing");
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (stateRef.current === "playing") {
        const now = performance.now();
        const currentMs = elapsedRef.current + (now - startedAtRef.current);
        setDisplayTime(formatTime(currentMs));

        if (lockedRef.current && now >= resolveAtRef.current) {
          setFlippedIndices([]);
          setFirstChoice(null);
          lockedRef.current = false;
          resolveAtRef.current = 0;
          remainingRef.current = 0;
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && stateRef.current === "playing") {
        togglePause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [togglePause]);

  const handleCardClick = (index: number) => {
    if (
      state !== "playing" ||
      lockedRef.current ||
      matchedIndices.includes(index) ||
      flippedIndices.includes(index)
    ) {
      return;
    }

    if (firstChoice === null) {
      setFirstChoice(index);
      setFlippedIndices([index]);
    } else {
      setMoves((prev) => prev + 1);
      setFlippedIndices([firstChoice, index]);

      if (deck[firstChoice] === deck[index]) {
        const newMatched = [...matchedIndices, firstChoice, index];
        setMatchedIndices(newMatched);
        setFirstChoice(null);
        setFlippedIndices([]);
        const matchedPairs = newMatched.length / 2;
        setStatusMessage(`성공! ${matchedPairs}쌍을 찾았어요.`);

        if (newMatched.length === 16) {
          const finalTime = elapsedRef.current + (performance.now() - startedAtRef.current);
          const finalTimeFormatted = formatTime(finalTime);
          setElapsed(finalTime);
          setDisplayTime(finalTimeFormatted);
          setState("done");
          setStatusMessage("축하합니다! 과일 8쌍을 모두 찾았습니다.");

          // 게임 성공 완료 시에만 구글 시트에 데이터 저장 (moves + 1 반영)
          const finalMoves = moves + 1;
          // 점수 계산: 시도 횟수와 완료 시간을 바탕으로 점수 산출 (기본: 1000 - (시도횟수 * 15 + 초 * 5), 최소 100)
          const totalSeconds = Math.floor(finalTime / 1000);
          const calculatedScore = Math.max(100, 1000 - (finalMoves * 15 + totalSeconds * 5));
          sendScoreToGoogleSheet(player, calculatedScore, finalTimeFormatted);
        }
      } else {
        lockedRef.current = true;
        resolveAtRef.current = performance.now() + 850;
        setStatusMessage("다른 과일이에요. 위치를 기억해 보세요.");
      }
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("공백이 아닌 이름을 입력해주세요.");
      return;
    }
    setNameError("");
    setPlayer(trimmed);
    prepareGame();
  };

  const goHome = () => {
    setState("welcome");
    setFirstChoice(null);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setNameInput("");
    setPlayer("");
    setMyRank(null);
    setIsNewRecord(false);
  };

  const matchedPairsCount = matchedIndices.length / 2;

  return (
    <div className={`app-wrapper ${theme}`}>
      <style jsx global>{`
        :root {
          --font-family: "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        .app-wrapper.light {
          --bg-main: #f5f7fa;
          --bg-gradient: radial-gradient(circle at 10% 20%, rgba(220, 235, 245, 0.7) 0%, rgba(245, 247, 250, 0.9) 90%);
          --ink: #1e293b;
          --ink-muted: #64748b;
          --primary-color: #2e7d5a;
          --primary-hover: #246548;
          --panel-bg: rgba(255, 255, 255, 0.75);
          --panel-border: rgba(255, 255, 255, 0.9);
          --panel-shadow: 0 16px 36px rgba(31, 41, 55, 0.06);

          /* 글래스모피즘 카드 스타일 */
          --card-bg: rgba(255, 255, 255, 0.55);
          --card-border: rgba(255, 255, 255, 0.85);
          --card-shadow: 0 8px 24px rgba(30, 41, 59, 0.05);
          --card-hover-border: #48bb78;
          --card-pattern: rgba(100, 116, 139, 0.2);

          --stat-bg: rgba(255, 255, 255, 0.75);
          --stat-border: rgba(255, 255, 255, 0.9);

          --btn-secondary-bg: rgba(226, 232, 240, 0.8);
          --btn-secondary-color: #334155;
          --input-bg: rgba(255, 255, 255, 0.8);
          --input-border: #cbd5e1;

          --overlay-bg: rgba(245, 247, 250, 0.85);
          --matched-border: #38a169;
          --matched-front-bg: rgba(240, 253, 244, 0.85);
        }

        .app-wrapper.dark {
          --bg-main: #0f172a;
          --bg-gradient: radial-gradient(circle at 20% 30%, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%);
          --ink: #f1f5f9;
          --ink-muted: #94a3b8;
          --primary-color: #34d399;
          --primary-hover: #10b981;
          --panel-bg: rgba(30, 41, 59, 0.65);
          --panel-border: rgba(255, 255, 255, 0.1);
          --panel-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);

          /* 글래스모피즘 카드 스타일 */
          --card-bg: rgba(30, 41, 59, 0.45);
          --card-border: rgba(255, 255, 255, 0.15);
          --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          --card-hover-border: #34d399;
          --card-pattern: rgba(148, 163, 184, 0.25);

          --stat-bg: rgba(30, 41, 59, 0.65);
          --stat-border: rgba(255, 255, 255, 0.1);

          --btn-secondary-bg: rgba(51, 65, 85, 0.8);
          --btn-secondary-color: #f1f5f9;
          --input-bg: rgba(15, 23, 42, 0.7);
          --input-border: #475569;

          --overlay-bg: rgba(15, 23, 42, 0.88);
          --matched-border: #34d399;
          --matched-front-bg: rgba(6, 78, 59, 0.35);
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: var(--font-family);
          transition: background 0.3s ease, color 0.3s ease;
        }

        .app-wrapper {
          min-height: 100vh;
          background: var(--bg-main);
          background-image: var(--bg-gradient);
          color: var(--ink);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px;
          transition: background 0.3s ease, color 0.3s ease;
        }

        button, input {
          font-family: var(--font-family);
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
          opacity: 0.45;
        }
        button:focus-visible, input:focus-visible {
          outline: 3px solid var(--primary-color);
          outline-offset: 3px;
        }

        .shell {
          width: 100%;
          max-width: 660px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* 헤더 영역 */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .brand {
          font-weight: 800;
          letter-spacing: -0.5px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 1.15rem;
        }

        .brand span {
          background: var(--primary-color);
          color: white;
          border-radius: 10px;
          padding: 5px 10px;
          font-size: 0.95rem;
        }

        .theme-toggle {
          background: var(--btn-secondary-bg);
          color: var(--btn-secondary-color);
          border: 1px solid var(--panel-border);
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .theme-toggle:hover {
          transform: translateY(-1px);
        }

        /* 웰컴 섹션 */
        .welcome {
          width: 100%;
          max-width: 480px;
          margin: 36px auto 0;
          text-align: center;
        }

        .fruitline {
          font-size: 42px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.08));
        }

        .tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--ink-muted);
          margin: 0 0 12px;
        }

        h1 {
          font-size: clamp(26px, 6vw, 42px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -1.5px;
          margin: 0 0 16px;
          color: var(--ink);
        }

        p {
          line-height: 1.7;
          color: var(--ink-muted);
          margin: 0 0 20px;
          font-size: 0.95rem;
        }

        .panel {
          background: var(--panel-bg);
          border: 1px solid var(--panel-border);
          border-radius: 22px;
          padding: 24px;
          box-shadow: var(--panel-shadow);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        label {
          display: block;
          text-align: left;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        input {
          width: 100%;
          border: 1px solid var(--input-border);
          background: var(--input-bg);
          border-radius: 12px;
          padding: 14px;
          color: var(--ink);
          font-size: 15px;
          outline: none;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s;
        }
        input:focus {
          border-color: var(--primary-color);
        }

        .primary, .secondary {
          border: 0;
          border-radius: 12px;
          padding: 13px 20px;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .primary {
          background: var(--primary-color);
          color: white;
        }
        .primary:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .secondary {
          background: var(--btn-secondary-bg);
          color: var(--btn-secondary-color);
          backdrop-filter: blur(8px);
        }
        .secondary:hover:not(:disabled) {
          filter: brightness(0.95);
        }

        .full {
          width: 100%;
          margin-top: 14px;
        }

        .hint {
          font-size: 12px;
          margin-top: 14px;
          color: var(--ink-muted);
        }

        .error {
          color: #ef4444;
          min-height: 20px;
          font-size: 13px;
          margin: 6px 0 0;
          text-align: left;
        }

        /* 게임 보드 섹션 */
        .game {
          width: 100%;
          margin: 12px auto 0;
        }

        .heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .heading h1 {
          font-size: clamp(20px, 4vw, 28px);
          letter-spacing: -0.5px;
          margin: 0;
        }

        .home {
          border: 0;
          background: none;
          color: var(--ink-muted);
          text-decoration: underline;
          padding: 8px 12px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .home:hover {
          color: var(--ink);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 18px 0;
        }

        .stat {
          background: var(--stat-bg);
          border: 1px solid var(--stat-border);
          border-radius: 16px;
          padding: 12px 14px;
          text-align: center;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: var(--card-shadow);
        }

        .stat small {
          display: block;
          color: var(--ink-muted);
          font-size: 12px;
          margin-bottom: 4px;
        }

        .stat strong {
          font-size: 21px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }

        .boardwrap {
          position: relative;
        }

        .board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        /* 글래스모피즘 반투명 카드 */
        .card {
          border: 1.5px solid var(--card-border);
          border-radius: 18px;
          aspect-ratio: 1;
          background: var(--card-bg);
          position: relative;
          padding: 0;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--card-shadow);
        }

        .card:not(:disabled):hover {
          transform: translateY(-4px) scale(1.02);
          border-color: var(--card-hover-border);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .back {
          display: grid;
          place-items: center;
          height: 100%;
          color: var(--ink-muted);
          font-size: 28px;
          background: radial-gradient(var(--card-pattern) 1.5px, transparent 1.5px);
          background-size: 14px 14px;
        }

        .front {
          display: none;
          height: 100%;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
        }
        .app-wrapper.dark .front {
          background: rgba(15, 23, 42, 0.95);
        }

        .front svg {
          width: 68%;
          height: 68%;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1));
        }

        .card.open .back,
        .card.matched .back {
          display: none;
        }
        .card.open .front,
        .card.matched .front {
          display: flex;
        }

        .card.matched {
          border: 2px solid var(--matched-border);
        }
        .card.matched .front {
          background: var(--matched-front-bg);
        }

        /* 오버레이 */
        .overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: 18px;
          background: var(--overlay-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .overlay h2 {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 800;
        }
        .overlay p {
          margin: 0 0 16px;
        }

        @keyframes pulseBadge {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .controls {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .controls button {
          flex: 1;
        }

        .status {
          text-align: center;
          min-height: 24px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-muted);
          margin-top: 14px;
        }

        /* 푸터 영역 */
        .footer-wrap {
          margin-top: auto;
          padding-top: 36px;
          text-align: center;
        }

        .footer-note {
          color: var(--ink-muted);
          font-size: 13px;
          margin-bottom: 6px;
        }

        .copyright {
          color: var(--ink-muted);
          font-size: 12px;
          font-weight: 600;
          opacity: 0.85;
          letter-spacing: 0.2px;
        }

        @media (max-width: 480px) {
          .app-wrapper {
            padding: 16px 12px;
          }
          .welcome {
            margin-top: 20px;
          }
          .board {
            gap: 7px;
          }
          .card {
            border-radius: 13px;
          }
          .stat {
            padding: 10px 8px;
            border-radius: 12px;
          }
          .stat strong {
            font-size: 18px;
          }
          .panel {
            padding: 18px 16px;
            border-radius: 18px;
          }
          .controls button {
            padding: 12px 6px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <main className="shell">
        {/* 상단 네비게이션 & 테마 스위치 */}
        <header className="top-nav">
          <div className="brand">
            <span>✿</span> 카드 맞추기 게임
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="라이트/다크 모드 변경"
          >
            {theme === "light" ? "🌙 다크모드" : "☀️ 라이트모드"}
          </button>
        </header>

        {state === "welcome" && (
          <section className="welcome">
            <div className="fruitline" aria-hidden="true">
              🍊 🍓 🍐
            </div>
            <p className="tag">CARD MATCHING MEMORY GAME</p>
            <h1>
              기억력 한 조각,
              <br />
              과일 한 바구니.
            </h1>
            <p>
              뒤집힌 투명 카드 속 같은 과일을 찾아보세요.
              <br />
              8쌍의 상큼한 과일이 기다리고 있어요.
            </p>
            <form onSubmit={handleNameSubmit} className="panel">
              <label htmlFor="playerName">어떤 이름으로 시작할까요?</label>
              <input
                id="playerName"
                autoComplete="nickname"
                maxLength={20}
                placeholder="이름 또는 닉네임을 입력해주세요"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
              <div className="error" role="alert">
                {nameError}
              </div>
              <button className="primary full" type="submit">
                게임 준비하기 →
              </button>
            </form>
            <p className="hint">4 × 4 카드 · 과일 8쌍 · 시간 제한 없음</p>
          </section>
        )}

        {state !== "welcome" && (
          <section className="game">
            <div className="heading">
              <div>
                <p className="tag">{player}님의 과일 정원</p>
                <h1>같은 과일을 찾아요</h1>
              </div>
              <button onClick={goHome} className="home">
                처음으로
              </button>
            </div>

            <div className="stats">
              <div className="stat">
                <small>진행 시간</small>
                <strong>{displayTime}</strong>
              </div>
              <div className="stat">
                <small>찾은 과일</small>
                <strong>{matchedPairsCount} / 8</strong>
              </div>
              <div className="stat">
                <small>시도 횟수</small>
                <strong>{moves}</strong>
              </div>
            </div>

            <div className="boardwrap">
              <div
                className="board"
                aria-label="4행 4열 과일 카드"
                style={{
                  visibility: state === "paused" ? "hidden" : "visible",
                }}
              >
                {deck.map((fruitIdx, i) => {
                  const isOpen =
                    flippedIndices.includes(i) || matchedIndices.includes(i);
                  const isMatched = matchedIndices.includes(i);
                  const fruit = FRUITS[fruitIdx];

                  return (
                    <button
                      key={i}
                      className={`card ${isOpen ? "open" : ""} ${
                        isMatched ? "matched" : ""
                      }`}
                      type="button"
                      disabled={isMatched}
                      aria-label={
                        isOpen
                          ? `${i + 1}번 카드, ${fruit.name}`
                          : `${i + 1}번 카드, 뒤집힘`
                      }
                      onClick={() => handleCardClick(i)}
                    >
                      <span className="back" aria-hidden="true">
                        ✿
                      </span>
                      <span className="front">
                        <svg
                          role="img"
                          aria-label={fruit.name}
                          viewBox="0 0 100 100"
                        >
                          {fruit.svg}
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>

              {state === "ready" && (
                <div className="overlay">
                  <div>
                    <h2>준비되셨나요?</h2>
                    <p>시작 버튼을 누르면 시간이 측정됩니다.</p>
                    <button onClick={startGame} className="primary">
                      게임 시작
                    </button>
                  </div>
                </div>
              )}

              {state === "paused" && (
                <div className="overlay">
                  <div>
                    <h2>잠깐 쉬어가요</h2>
                    <p>일시정지 중에는 시간이 흐르지 않아요.</p>
                    <button onClick={togglePause} className="primary">
                      이어하기
                    </button>
                  </div>
                </div>
              )}

              {state === "done" && (
                <div className="overlay">
                  <div style={{ maxWidth: "340px", width: "100%" }}>
                    <h2>모든 과일을 찾았어요! 🎉</h2>
                    <p style={{ margin: "0 0 10px" }}>
                      {player}님, 완료 시간 {displayTime} · {moves}번 시도
                    </p>

                    {/* 1, 2, 3위 순위 경신 시 강조 표시 */}
                    {isNewRecord && myRank !== null && myRank <= 3 && (
                      <div
                        style={{
                          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          fontWeight: 800,
                          fontSize: "14px",
                          margin: "0 auto 14px",
                          boxShadow: "0 4px 16px rgba(239, 68, 68, 0.4)",
                          display: "inline-block",
                          animation: "pulseBadge 1.2s infinite ease-in-out",
                        }}
                      >
                        🏆 명예의 전당 경신! 현재 {myRank}위 등극! 🏆
                      </div>
                    )}

                    {/* 실시간 Top 3 랭킹 리스트 */}
                    {top3List.length > 0 && (
                      <div
                        style={{
                          background: "var(--panel-bg)",
                          border: "1px solid var(--panel-border)",
                          borderRadius: "14px",
                          padding: "10px 14px",
                          margin: "10px 0 16px",
                          fontSize: "13px",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: "6px",
                            color: "var(--ink)",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>🏅 최고 기록 TOP 3</span>
                          <span style={{ fontSize: "11px", color: "var(--ink-muted)", fontWeight: 400 }}>
                            (시간순)
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {top3List.map((item, idx) => {
                            const isMe = item.name === player;
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "3px 6px",
                                  borderRadius: "6px",
                                  background: isMe ? "rgba(52, 211, 153, 0.2)" : "transparent",
                                  fontWeight: isMe ? 700 : 500,
                                }}
                              >
                                <span>
                                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}{" "}
                                  {item.name}
                                </span>
                                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                  {item.finishtime}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        prepareGame();
                        startGame();
                      }}
                      className="primary"
                    >
                      한 번 더 도전
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="controls">
              <button
                className="secondary"
                disabled={state !== "playing" && state !== "paused"}
                onClick={togglePause}
              >
                {state === "paused" ? "이어하기" : "일시정지"}
              </button>
              <button className="secondary" onClick={prepareGame}>
                다시 시작
              </button>
            </div>

            <div className="status" role="status" aria-live="polite">
              {statusMessage}
            </div>
          </section>
        )}

        <footer className="footer-wrap">
          <div className="footer-note">천천히 뒤집고, 즐겁게 기억하세요.</div>
          <div className="copyright">
            Copyright INU 카드 맞추기 게임 by 최민서
          </div>
        </footer>
      </main>
    </div>
  );
}
