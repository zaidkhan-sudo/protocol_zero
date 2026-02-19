"use client";

/**
 * ============================================================================
 * SELF-HEALING - MAIN DASHBOARD PAGE (ANALYTICAL)
 * ============================================================================
 * Premium dashboard with:
 * - Animated stat cards with sparkline-style indicators
 * - Success rate ring visualization
 * - Session history with progress bars, duration, and score
 * - Status breakdown
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
    Sparkles,
    Bug,
    CheckCircle2,
    Zap,
    Loader2,
    ArrowRight,
    Clock,
    GitBranch,
    XCircle,
    TrendingUp,
    Shield,
    Activity,
    Timer,
    Target,
} from "lucide-react";
import { HealingForm } from "@/components/self-healing/HealingForm";
import { StatusBadge } from "@/components/self-healing/StatusBadge";
import type { HealingStatus } from "@/types";

interface SessionData {
    id: string;
    repoUrl: string;
    repoOwner: string;
    repoName: string;
    branchName: string;
    status: HealingStatus;
    currentAttempt: number;
    maxAttempts: number;
    bugs?: Array<{ fixed: boolean }>;
    score?: { finalScore: number; bugsFixed: number; totalBugs: number } | null;
    startedAt: string;
    completedAt?: string;
}

// ── Circular progress ring ──────────────────────────────────────────────
function ProgressRing({
    value,
    max,
    size = 80,
    strokeWidth = 6,
    color = "#34d399",
    label,
}: {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = max > 0 ? value / max : 0;
    const offset = circumference * (1 - pct);

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-zinc-100">{max > 0 ? Math.round(pct * 100) : 0}%</span>
                {label && <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{label}</span>}
            </div>
        </div>
    );
}

// ── Mini progress bar ───────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: color }}
            />
        </div>
    );
}

export default function SelfHealingPage() {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await fetch("/api/self-healing/sessions");
            if (res.ok) {
                const data = await res.json();
                setSessions(data.sessions || []);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isSignedIn) fetchSessions();
    }, [isSignedIn, fetchSessions]);

    const handleSubmit = async (repoUrl: string) => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/self-healing/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to start healing");
            router.push(`/dashboard/self-healing/${data.sessionId}`);
        } catch (error) {
            setSubmitting(false);
            throw error;
        }
    };

    // ── Analytics ──────────────────────────────────────────────────────
    const analytics = useMemo(() => {
        const total = sessions.length;
        const completed = sessions.filter((s) => s.status === "completed").length;
        const failed = sessions.filter((s) => s.status === "failed").length;
        const active = sessions.filter((s) => !["completed", "failed"].includes(s.status)).length;
        const bugsFixed = sessions.reduce(
            (sum, s) => sum + (s.score?.bugsFixed || s.bugs?.filter((b) => b.fixed).length || 0), 0
        );
        const totalBugs = sessions.reduce(
            (sum, s) => sum + (s.score?.totalBugs || s.bugs?.length || 0), 0
        );
        const scores = sessions.filter((s) => s.score).map((s) => s.score!.finalScore);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const avgAttempts = total > 0
            ? (sessions.reduce((sum, s) => sum + s.currentAttempt, 0) / total).toFixed(1)
            : "0";
        const avgDuration = (() => {
            const durSessions = sessions.filter((s) => s.completedAt && s.startedAt);
            if (durSessions.length === 0) return "—";
            const avgSec = durSessions.reduce((sum, s) => {
                return sum + (new Date(s.completedAt!).getTime() - new Date(s.startedAt).getTime()) / 1000;
            }, 0) / durSessions.length;
            if (avgSec < 60) return `${Math.round(avgSec)}s`;
            return `${Math.floor(avgSec / 60)}m ${Math.round(avgSec % 60)}s`;
        })();

        return { total, completed, failed, active, bugsFixed, totalBugs, avgScore, bestScore, avgAttempts, avgDuration };
    }, [sessions]);

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            });
        } catch { return "—"; }
    };

    const getDuration = (s: SessionData) => {
        if (!s.completedAt || !s.startedAt) return null;
        try {
            const sec = Math.round((new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 1000);
            return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`;
        } catch { return null; }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
            {/* ── HEADER ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/10">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-100">Self-Healing Code</h1>
                    </div>
                    <p className="text-zinc-500 text-sm ml-[52px]">
                        AI-powered autonomous bug detection, fixing, and verification
                    </p>
                </div>
                {analytics.active > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">{analytics.active} Active</span>
                    </div>
                )}
            </div>

            {/* ── FORM ────────────────────────────────────────────────── */}
            <HealingForm onSubmit={handleSubmit} isLoading={submitting} />

            {/* ── ANALYTICS GRID ──────────────────────────────────────── */}
            {analytics.total > 0 && (
                <div className="space-y-6">
                    {/* Row 1: Key metrics + success ring */}
                    <div className="grid grid-cols-12 gap-4">
                        {/* Success rate ring */}
                        <div className="col-span-12 md:col-span-3 bg-neutral-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center">
                            <ProgressRing value={analytics.completed} max={analytics.total} size={100} strokeWidth={7} label="success" />
                            <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />{analytics.completed}</span>
                                <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" />{analytics.failed}</span>
                                <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-yellow-400" />{analytics.active}</span>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: Zap, label: "Total Sessions", value: analytics.total, color: "text-violet-400", bg: "bg-violet-500/10" },
                                { icon: Bug, label: "Bugs Fixed", value: analytics.bugsFixed, sub: `of ${analytics.totalBugs}`, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                                { icon: TrendingUp, label: "Avg Score", value: analytics.avgScore, sub: "/100", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                { icon: Target, label: "Best Score", value: analytics.bestScore, sub: "/100", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                                { icon: Timer, label: "Avg Duration", value: analytics.avgDuration, color: "text-orange-400", bg: "bg-orange-500/10" },
                                { icon: GitBranch, label: "Avg Attempts", value: analytics.avgAttempts, sub: "/5", color: "text-pink-400", bg: "bg-pink-500/10" },
                                { icon: Shield, label: "Fix Rate", value: analytics.totalBugs > 0 ? `${Math.round((analytics.bugsFixed / analytics.totalBugs) * 100)}%` : "—", color: "text-teal-400", bg: "bg-teal-500/10" },
                                { icon: CheckCircle2, label: "Completion", value: `${Math.round((analytics.completed / analytics.total) * 100)}%`, color: "text-lime-400", bg: "bg-lime-500/10" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="group bg-neutral-900/60 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                                            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{stat.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-zinc-100">{stat.value}</span>
                                        {stat.sub && <span className="text-xs text-zinc-600">{stat.sub}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SESSION LIST ────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <h2 className="text-sm font-semibold text-zinc-300">Session History</h2>
                        {sessions.length > 0 && (
                            <span className="text-xs text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">{sessions.length}</span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                        <div className="p-4 bg-white/5 rounded-2xl inline-block mb-1">
                            <Sparkles className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 text-sm">No healing sessions yet. Enter a GitHub URL above to begin.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((session) => {
                            const bugsFixed = session.score?.bugsFixed || session.bugs?.filter((b) => b.fixed).length || 0;
                            const totalBugs = session.score?.totalBugs || session.bugs?.length || 0;
                            const duration = getDuration(session);
                            const score = session.score?.finalScore;
                            const isActive = !["completed", "failed"].includes(session.status);

                            return (
                                <Link key={session.id} href={`/dashboard/self-healing/${session.id}`}>
                                    <div className="group relative bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer">
                                        {/* Active glow */}
                                        {isActive && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />}
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center gap-4">
                                            {/* Score circle */}
                                            <div className="flex-shrink-0">
                                                {score !== undefined && score !== null ? (
                                                    <ProgressRing
                                                        value={score}
                                                        max={100}
                                                        size={52}
                                                        strokeWidth={4}
                                                        color={score >= 80 ? "#34d399" : score >= 50 ? "#facc15" : "#f87171"}
                                                    />
                                                ) : isActive ? (
                                                    <div className="w-[52px] h-[52px] rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center">
                                                        <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                                                    </div>
                                                ) : (
                                                    <div className="w-[52px] h-[52px] rounded-full border border-white/5 flex items-center justify-center">
                                                        <span className="text-xs text-zinc-600">—</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-300 transition-colors truncate">
                                                            {session.repoOwner}/{session.repoName}
                                                        </h3>
                                                        <StatusBadge status={session.status} />
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />{formatTime(session.startedAt)}
                                                    </span>
                                                    {duration && (
                                                        <span className="flex items-center gap-1">
                                                            <Timer className="w-3 h-3" />{duration}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <GitBranch className="w-3 h-3" />
                                                        {session.currentAttempt}/{session.maxAttempts}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Bug className="w-3 h-3" />
                                                        <span className="text-emerald-400">{bugsFixed}</span>/{totalBugs} fixed
                                                    </span>
                                                </div>

                                                {/* Bug fix progress bar */}
                                                <MiniBar value={bugsFixed} max={totalBugs || 1} color={bugsFixed === totalBugs && totalBugs > 0 ? "#34d399" : "#facc15"} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
