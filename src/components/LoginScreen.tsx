import React, { useState } from 'react';
import { Grade } from '../types/mathverse';
import { useMathVerse } from '../context/MathVerseContext';
import { Sparkles, Compass, Rocket, BookOpen, ChevronRight, Sun, Moon } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

const AVATARS = [
  { icon: '👨‍🚀', label: 'Phi hành gia' },
  { icon: '👩‍🚀', label: 'Nhà thám hiểm' },
  { icon: '🦉', label: 'Cú thông thái' },
  { icon: '🤖', label: 'Robot MathBot' },
  { icon: '🦊', label: 'Cáo nhanh nhẹn' },
  { icon: '⭐', label: 'Ngôi sao nhỏ' },
];

const GRADES: { grade: Grade; title: string; subtitle: string; icon: string; bgGrad: string }[] = [
  { grade: 6, title: 'Lớp 6', subtitle: 'Số tự nhiên, Số nguyên, Phân số & Hình trực quan', icon: '🌱', bgGrad: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
  { grade: 7, title: 'Lớp 7', subtitle: 'Số hữu tỉ, Tỉ lệ thức, Tam giác & Định lý Pythagore', icon: '📐', bgGrad: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' },
  { grade: 8, title: 'Lớp 8', subtitle: 'Hằng đẳng thức, Phương trình & Định lý Thalès', icon: '⚡', bgGrad: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30' },
  { grade: 9, title: 'Lớp 9', subtitle: 'Căn bậc hai, Hệ phương trình, Vi-ét & Đường tròn', icon: '👑', bgGrad: 'from-purple-500/20 to-pink-500/10 border-purple-500/30' },
];

export const LoginScreen: React.FC = () => {
  const { login, theme, toggleTheme } = useMathVerse();
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(6);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].icon);
  const [errorMessage, setErrorMessage] = useState('');

  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên của em để bắt đầu nhé!');
      soundManager.playWrongSound();
      return;
    }
    soundManager.playClickSound();
    login(name.trim(), selectedGrade, selectedAvatar);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 ${
        isLight
          ? 'theme-light bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 text-slate-800'
          : 'theme-dark bg-slate-950 text-slate-100'
      }`}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isLight ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-200/30 rounded-full blur-[96px]" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-600/15 rounded-full blur-[96px]" />
          </>
        )}

        {/* Floating math symbols in cosmic background */}
        <span className="absolute top-16 left-12 text-cyan-500/20 text-4xl select-none font-mono font-bold animate-bounce">π</span>
        <span className="absolute top-28 right-24 text-indigo-400/20 text-5xl select-none font-mono font-bold">∑</span>
        <span className="absolute bottom-24 left-20 text-purple-400/20 text-5xl select-none font-mono font-bold">√</span>
        <span className="absolute bottom-32 right-16 text-pink-400/20 text-4xl select-none font-mono font-bold">∞</span>
        <span className="absolute top-2/3 left-1/3 text-emerald-400/15 text-3xl select-none font-mono font-bold">Δ</span>
      </div>

      <div
        className={`relative z-10 w-full max-w-xl backdrop-blur-xl border rounded-3xl p-6 sm:p-8 transition-all ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-2xl shadow-indigo-100 text-slate-800'
            : 'bg-slate-900/80 border-slate-800/80 shadow-2xl shadow-indigo-950/50 text-slate-100'
        }`}
      >
        {/* Top bar with theme toggle */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClickSound();
              toggleTheme();
            }}
            title={isLight ? 'Chuyển sang Chế độ Tối' : 'Chuyển sang Chế độ Sáng'}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
            }`}
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            <span className="text-[11px]">{isLight ? 'Giao diện Sáng' : 'Giao diện Tối'}</span>
          </button>
        </div>

        {/* Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-2xl shadow-lg shadow-indigo-500/30 mb-3 transform hover:scale-105 transition-transform duration-300">
            <Rocket className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${
              isLight
                ? 'from-indigo-600 via-purple-600 to-pink-600'
                : 'from-cyan-300 via-indigo-200 to-purple-400'
            } tracking-tight`}
          >
            MathVerse
          </h1>
          <p className={`text-sm sm:text-base mt-1 flex items-center justify-center gap-1.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <Sparkles className="w-4 h-4 text-cyan-500" />
            Vũ trụ Toán học THCS • Bộ sách Kết nối tri thức
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Tên học sinh
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Nhập họ và tên hoặc biệt danh của em..."
              className={`w-full px-4 py-3.5 border rounded-xl transition-all text-base focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-indigo-500'
                  : 'bg-slate-950/70 border-slate-700/80 text-white placeholder-slate-500 focus:ring-cyan-500 focus:border-transparent'
              }`}
              maxLength={30}
              autoFocus
            />
            {errorMessage && (
              <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                ⚠️ {errorMessage}
              </p>
            )}
          </div>

          {/* Avatar Selector */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Chọn nhân vật đại diện
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.label}
                  onClick={() => {
                    setSelectedAvatar(av.icon);
                    soundManager.playClickSound();
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-2xl transition-all duration-200 cursor-pointer ${
                    selectedAvatar === av.icon
                      ? isLight
                        ? 'bg-indigo-50 border-indigo-500 scale-105 shadow-sm'
                        : 'bg-indigo-600/30 border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                  title={av.label}
                >
                  <span>{av.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selector */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Chọn lớp học của em
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g.grade}
                  onClick={() => {
                    setSelectedGrade(g.grade);
                    soundManager.playClickSound();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    selectedGrade === g.grade
                      ? isLight
                        ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-400 shadow-sm text-slate-900'
                        : `bg-gradient-to-b ${g.bgGrad} ring-2 ring-cyan-400 shadow-md`
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xl">{g.icon}</span>
                    {selectedGrade === g.grade && (
                      <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-indigo-600' : 'bg-cyan-400 shadow-sm shadow-cyan-400'}`} />
                    )}
                  </div>
                  <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{g.title}</div>
                  <div className={`text-[11px] line-clamp-1 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{g.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-500 hover:via-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer text-base"
          >
            <span>Bắt đầu học ngay</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer highlights */}
        <div className={`mt-6 pt-5 border-t grid grid-cols-3 gap-2 text-center text-[12px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'}`}>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-semibold flex items-center gap-1 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
              <BookOpen className="w-3.5 h-3.5" /> Chuẩn THCS
            </span>
            <span>Lớp 6, 7, 8, 9</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-semibold flex items-center gap-1 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
              <Sparkles className="w-3.5 h-3.5" /> MathBot AI
            </span>
            <span>Gia sư giải thích</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-semibold flex items-center gap-1 ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>
              <Compass className="w-3.5 h-3.5" /> Ôn tập thông minh
            </span>
            <span>Tự chữa điểm yếu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
