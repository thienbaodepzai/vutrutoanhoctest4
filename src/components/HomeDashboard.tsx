import React from 'react';
import { useMathVerse } from '../context/MathVerseContext';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { getUserLevel } from '../data/badgesData';
import { isGradeUnlocked, PROMOTION_EXAMS } from '../data/promotionExamsData';
import {
  BookOpen,
  PenTool,
  Clock,
  Target,
  Award,
  BarChart3,
  Bot,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  TrendingUp,
  Lock,
  Trophy,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    cloudResults,
    cloudProgress,
    loadingCloud,
    setActiveTab,
    setSelectedLessonId,
    setActivePromotionExamGrade,
    theme,
  } = useMathVerse();

  if (!user) return null;

  const isLight = theme === 'light';

  // Grade-filtered lessons synced with Supabase
  const gradeLessons = CURRICULUM_DATA.filter((l) => l.grade === user.grade);
  const matchedInGrade = gradeLessons.filter((l) =>
    user.completedLessons.includes(l.id)
  ).length;
  const cloudInGrade = cloudResults.filter(
    (r) =>
      Number(r.grade_level) === user.grade &&
      !String(r.lesson_id).startsWith('practice-session-') &&
      !String(r.lesson_id).startsWith('quiz-exam-') &&
      !String(r.lesson_id).startsWith('challenge-') &&
      !String(r.lesson_id).startsWith('survey-') &&
      !String(r.lesson_id).startsWith('promotion-grade-')
  ).length;
  const completedInGrade = Math.min(
    gradeLessons.length,
    Math.max(matchedInGrade, cloudInGrade)
  );
  const totalCompletedLessons = Math.max(
    user.completedLessons.length,
    completedInGrade
  );
  const inProgressInGrade = cloudProgress.filter(
    (p) => p.status === 'in_progress' && Number(p.grade_level || user.grade) === user.grade
  );
  const progressPercent =
    gradeLessons.length > 0
      ? Math.min(
          100,
          Math.round(
            ((completedInGrade +
              inProgressInGrade.reduce((acc, p) => acc + Math.min(0.9, (Number(p.progress_percent) || 0) / 100), 0)) /
              gradeLessons.length) *
              100
          )
        )
      : 0;

  const currentLevel = getUserLevel(user.xp);

  // Recommendations: pick in-progress lesson first, or first uncompleted lesson in current grade
  const resumeProgress = inProgressInGrade[0];
  const nextLesson =
    (resumeProgress && gradeLessons.find((l) => l.id === resumeProgress.lesson_id)) ||
    gradeLessons.find((l) => !user.completedLessons.includes(l.id)) ||
    gradeLessons[0];
  const nextGrade = (user.grade < 9 ? user.grade + 1 : 9) as 6 | 7 | 8 | 9;
  const isNextGradeUnlocked = isGradeUnlocked(user, nextGrade);

  const handleNav = (tab: string) => {
    soundManager.playClickSound();
    setActiveTab(tab);
  };

  const menuCards = [
    {
      id: 'lessons',
      title: 'Học bài',
      desc: 'Lý thuyết trực quan, công thức quan trọng và ví dụ từng bước',
      icon: BookOpen,
      darkColor: 'from-blue-600/30 to-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
      lightColor: 'bg-white hover:bg-blue-50/50 border-slate-200/90 hover:border-blue-300 text-blue-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: `${completedInGrade}/${gradeLessons.length} bài xong`,
      glow: 'shadow-cyan-500/10',
    },
    {
      id: 'practice',
      title: 'Luyện tập',
      desc: 'Trắc nghiệm, điền đáp án, Đúng/Sai, tìm lỗi sai & ghép công thức',
      icon: PenTool,
      darkColor: 'from-emerald-600/30 to-teal-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
      lightColor: 'bg-white hover:bg-emerald-50/50 border-slate-200/90 hover:border-emerald-300 text-emerald-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: `${user.answeredQuestionsCount} câu đã làm`,
      glow: 'shadow-emerald-500/10',
    },
    {
      id: 'quiz',
      title: 'Trắc nghiệm',
      desc: 'Đề thi 10, 20 hoặc 30 câu có đồng hồ đếm ngược và phân tích điểm yếu',
      icon: Clock,
      darkColor: 'from-amber-600/30 to-orange-500/20 text-amber-400 border-amber-500/30 hover:border-amber-400',
      lightColor: 'bg-white hover:bg-amber-50/50 border-slate-200/90 hover:border-amber-300 text-amber-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Tính giờ & Chấm điểm',
      glow: 'shadow-amber-500/10',
    },
    {
      id: 'challenges',
      title: 'Thử thách',
      desc: 'Giải nhanh, tìm quy luật, toán logic, số bí ẩn và thử thách 60 giây',
      icon: Target,
      darkColor: 'from-rose-600/30 to-pink-500/20 text-pink-400 border-rose-500/30 hover:border-rose-400',
      lightColor: 'bg-white hover:bg-rose-50/50 border-slate-200/90 hover:border-rose-300 text-rose-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: '+100 XP / Thử thách',
      glow: 'shadow-rose-500/10',
    },
    {
      id: 'leaderboard',
      title: '🏆 Bảng xếp hạng',
      desc: 'Bảng xếp hạng học sinh & thống kê số người tham gia thực tế trên hệ thống',
      icon: Trophy,
      darkColor: 'from-amber-500/30 to-yellow-600/20 text-amber-300 border-amber-500/40 hover:border-amber-400',
      lightColor: 'bg-white hover:bg-amber-50/60 border-slate-200/90 hover:border-amber-300 text-amber-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Dữ liệu thực tế',
      glow: 'shadow-amber-500/15',
    },
    {
      id: 'mathbot',
      title: 'MathBot AI',
      desc: 'Trợ lý gia sư AI giải đáp từng bước bài toán THCS bằng tiếng Việt',
      icon: Bot,
      darkColor: 'from-indigo-600/30 to-purple-500/20 text-indigo-400 border-indigo-500/30 hover:border-indigo-400',
      lightColor: 'bg-white hover:bg-indigo-50/50 border-slate-200/90 hover:border-indigo-300 text-indigo-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Hỏi đáp 24/7',
      glow: 'shadow-indigo-500/10',
    },
    {
      id: 'smart_review',
      title: 'Ôn tập thông minh',
      desc: 'Tự động phát hiện các dạng câu hỏi em hay sai và tạo bài ôn bù đắp',
      icon: RotateCcw,
      darkColor: 'from-violet-600/30 to-purple-500/20 text-violet-400 border-violet-500/30 hover:border-violet-400',
      lightColor: 'bg-white hover:bg-purple-50/50 border-slate-200/90 hover:border-purple-300 text-purple-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: `${user.recentMistakes.length} câu cần ôn`,
      glow: 'shadow-violet-500/10',
    },
    {
      id: 'analytics',
      title: 'Tiến độ & Báo cáo',
      desc: 'Biểu đồ chi tiết tỉ lệ đúng, lịch sử Supabase và chủ đề cần cải thiện',
      icon: BarChart3,
      darkColor: 'from-cyan-600/30 to-blue-500/20 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
      lightColor: 'bg-white hover:bg-cyan-50/50 border-slate-200/90 hover:border-cyan-300 text-cyan-600 shadow-xs hover:shadow-md',
      lightIcon: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      badge: loadingCloud ? 'Đang đồng bộ...' : 'Đồng bộ Cloud',
      glow: 'shadow-cyan-500/10',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-r from-indigo-50/90 via-white to-sky-50/90 border border-indigo-200/80 shadow-indigo-100/50'
            : 'bg-gradient-to-r from-indigo-900/50 via-slate-900/70 to-purple-950/50 border border-indigo-500/30 shadow-indigo-950/30'
        }`}
      >
        <div
          className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isLight ? 'bg-cyan-200/30' : 'bg-cyan-500/15'
          }`}
        />
        <div
          className={`absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isLight ? 'bg-purple-200/30' : 'bg-purple-500/15'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{user.avatar}</span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isLight
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Chương trình Toán Lớp {user.grade}
              </div>
            </div>
            <h1
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Xin chào,{' '}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isLight
                    ? 'from-indigo-600 via-purple-600 to-pink-600'
                    : 'from-cyan-300 via-indigo-200 to-pink-300'
                }`}
              >
                {user.name}
              </span>
              ! 🚀
            </h1>
            <p className={`text-sm sm:text-base mt-1.5 max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Hôm nay em đã sẵn sàng khám phá thêm những định lý và chinh phục đỉnh cao Toán học chưa?
            </p>
          </div>

          {/* Quick Action: Continue Next Lesson */}
          {nextLesson && (
            <button
              onClick={() => {
                setSelectedLessonId(nextLesson.id);
                setActiveTab('lessons');
                soundManager.playClickSound();
              }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 active:scale-100 cursor-pointer text-sm shrink-0"
            >
              <div className="text-left">
                <div className="text-[11px] text-cyan-100 font-normal">Bài học tiếp theo:</div>
                <div className="font-extrabold text-sm max-w-[200px] truncate">{nextLesson.title}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Progress */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-white/95 border-slate-200/90 shadow-xs' : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className={`flex items-center justify-between text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Tiến độ Lớp {user.grade}</span>
              <TrendingUp className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`} />
            </div>
            <div className={`text-2xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {progressPercent}%
            </div>
            <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* XP */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-white/95 border-slate-200/90 shadow-xs' : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className={`flex items-center justify-between text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Tổng điểm thưởng</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <div className={`text-2xl font-extrabold font-mono ${isLight ? 'text-amber-600' : 'text-yellow-300'}`}>
              {user.xp} XP
            </div>
            <div className={`text-[11px] mt-1 flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>{currentLevel.icon} {currentLevel.title}</span>
            </div>
          </div>

          {/* Streak */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-white/95 border-slate-200/90 shadow-xs' : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className={`flex items-center justify-between text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Chuỗi học liên tiếp</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            </div>
            <div className="text-2xl font-extrabold text-orange-500 font-mono">{user.streak} ngày</div>
            <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Duy trì mỗi ngày</div>
          </div>

          {/* Completed Lessons */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-white/95 border-slate-200/90 shadow-xs' : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className={`flex items-center justify-between text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Bài đã hoàn thành</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {totalCompletedLessons} bài
            </div>
            <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Lớp {user.grade}: {completedInGrade}/{gradeLessons.length}
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Exam Milestone Card */}
      {user.grade < 9 && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
            isLight
              ? 'bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-white border-amber-200 shadow-xs'
              : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/50 border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
                isLight ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Mục tiêu mở khóa Lớp {nextGrade} (Bộ sách Kết nối tri thức)
                </span>
                {isNextGradeUnlocked ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Đã mở khóa
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isLight ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    <Lock className="w-3 h-3" /> Đang khóa
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {isNextGradeUnlocked
                  ? `Lớp ${nextGrade} đã sẵn sàng! Em có thể chuyển sang học bất cứ lúc nào.`
                  : `Cần vượt qua Bài tập tổng hợp Toán ${user.grade} (KNTT) đạt từ 70% trở lên để lên Lớp ${nextGrade}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {!isNextGradeUnlocked ? (
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setActivePromotionExamGrade(user.grade);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Thi vượt cấp lên Lớp {nextGrade}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setActiveTab('lessons');
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                Vào học Lớp {nextGrade}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Grid (Large Interactive Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>Khu vực Học tập & Rèn luyện</span>
          </h2>
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Chọn một mục để bắt đầu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => handleNav(card.id)}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                  isLight ? card.lightColor : `bg-gradient-to-b ${card.darkColor} backdrop-blur-md ${card.glow}`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-3 rounded-xl border group-hover:scale-110 transition-transform ${
                        isLight ? card.lightIcon : 'bg-slate-950/60 border-slate-800/60'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-600'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-bold mb-1.5 transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-cyan-300'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300/90'}`}>
                    {card.desc}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                    isLight
                      ? 'border-slate-100 text-slate-500 group-hover:text-indigo-600'
                      : 'border-slate-800/50 text-slate-300 group-hover:text-cyan-300'
                  }`}
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MathBot AI Highlight Banner */}
      <div
        className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-white border-indigo-200/90 shadow-xs'
            : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border-indigo-500/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
              isLight ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-indigo-600/40 border-indigo-400/40 text-indigo-300'
            }`}
          >
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h4 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              MathBot – Gia sư Toán AI 24/7
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isLight ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                MỚI
              </span>
            </h4>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Gặp bài toán khó chưa hiểu? Đừng lo, MathBot sẽ giải thích từng bước rõ ràng bằng tiếng Việt!
            </p>
          </div>
        </div>
        <button
          onClick={() => handleNav('mathbot')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
        >
          Trò chuyện với MathBot
        </button>
      </div>
    </div>
  );
};
