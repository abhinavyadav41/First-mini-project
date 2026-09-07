import React from 'react';
import { BookOpen, Heart, Github, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                NoteNest
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "Share Knowledge. Learn Together." A modern open study hub engineered for university students to share verified, high-yield study materials.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              Academic Honor Code Verified
            </div>
          </div>

          {/* Quick Discover */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  All Study Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'trending')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Trending Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'newest')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Recently Uploaded
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Saved Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Top Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Computer Science')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Computer Science & AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Mathematics')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Mathematics & Calculus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Electrical Engineering')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Electrical Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Economics')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Economics & Finance
                </button>
              </li>
            </ul>
          </div>

          {/* University Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Partner Campuses
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['Stanford', 'MIT', 'UC Berkeley', 'Harvard', 'CMU', 'UW', 'Columbia'].map(uni => (
                <span
                  key={uni}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                >
                  {uni}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              Built with PostgreSQL schema, Prisma ORM specification, React 19, and Tailwind CSS.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} NoteNest Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Academic Integrity Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
