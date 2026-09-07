import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Download,
  Users,
  Building2,
  FileCheck,
  Sparkles,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  Code,
  Calculator,
  Cpu,
  Coins,
  Dna,
  Atom,
} from 'lucide-react';
import { Note } from '../types';
import { NoteCard } from '../components/NoteCard';
import { SEED_SUBJECTS } from '../data/seedData';

interface LandingPageProps {
  trendingNotes: Note[];
  onNavigate: (view: string, param?: string) => void;
  onOpenUpload: () => void;
  onSearchSubmit: (query: string) => void;
}

const getSubjectIcon = (name: string) => {
  switch (name) {
    case 'Computer Science':
      return <Code className="w-5 h-5" />;
    case 'Mathematics':
      return <Calculator className="w-5 h-5" />;
    case 'Electrical Engineering':
      return <Cpu className="w-5 h-5" />;
    case 'Economics & Finance':
      return <Coins className="w-5 h-5" />;
    case 'Biology & Life Sciences':
      return <Dna className="w-5 h-5" />;
    case 'Physics':
      return <Atom className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({
  trendingNotes,
  onNavigate,
  onOpenUpload,
  onSearchSubmit,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    } else {
      onNavigate('explore');
    }
  };

  const quickSearchTags = ['Algorithms', 'Linear Algebra', 'Microeconomics', 'Organic Chemistry', 'Calculus III'];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>NoteNest 2.0 • Share Knowledge. Learn Together.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            The open study hub for <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              university course notes.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover peer-reviewed lecture summaries, exam preparation sheets, and verified study guides shared by learners at top institutions worldwide.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-indigo-500/5 border border-slate-200/90 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by course code, topic, or university (e.g., CS106B, Calculus)..."
                className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-indigo-600/25 shrink-0 transition-all flex items-center gap-1.5"
              >
                <span>Find Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
              {quickSearchTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => onSearchSubmit(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => onNavigate('explore')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Notes</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-200/80 dark:border-indigo-800 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Contribute Your Notes</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">15,400+</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Downloads</p>
          </div>
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">2,800+</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Verified Notes</p>
          </div>
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">45+</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Top Campuses</p>
          </div>
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">99.4%</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Peer Approval Rate</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Explore Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Popular Academic Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View All Subjects</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SEED_SUBJECTS.map(subject => (
            <div
              key={subject.name}
              onClick={() => onNavigate('explore', subject.name)}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-700 cursor-pointer transition-all duration-200 group text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform">
                {getSubjectIcon(subject.name)}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {subject.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {subject.noteCount}+ Notes
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trending Notes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Study Resources</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Top Downloaded This Semester
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore', 'trending')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Explore All Trending</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNotes.slice(0, 6).map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onSelect={id => onNavigate('note-detail', id)}
              onAuthorClick={authorId => onNavigate('profile', authorId)}
            />
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For Scholars
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            How NoteNest Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            A frictionless ecosystem designed to bridge the gap between classroom lectures and exam mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-5">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Upload & Organize
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag-and-drop your lecture summaries, typed cheatsheets, and exam formula guides. Tag by university course and semester.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-5">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Preview & Discover
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Use high-precision search by course code, read peer comments, and preview pages instantly in our interactive document viewer.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-5">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Learn & Excel Together
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bookmark essential study materials to your private dashboard, download offline copies, and discuss concepts in peer threads.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Community Impact
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 leading-snug">
              "NoteNest cut my exam prep time in half. Seeing structured notes from top students made all the difference."
            </h3>
            <div className="flex items-center gap-3 mt-6">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
                alt="Jessica"
                className="w-10 h-10 rounded-full bg-white/20 ring-2 ring-indigo-400"
              />
              <div>
                <p className="text-sm font-bold">Jessica Vance</p>
                <p className="text-xs text-indigo-300">Computer Science Senior @ UC Berkeley</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
