import React from 'react';
import { Filter, RotateCcw, Tag, Building2, BookOpen, GraduationCap, ArrowUpDown } from 'lucide-react';
import { FilterOptions } from '../types';
import { SEED_SUBJECTS, SEED_UNIVERSITIES, SEED_SEMESTERS } from '../data/seedData';

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  isMobile?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  isMobile = false,
}) => {
  const POPULAR_TAGS = [
    'Algorithms', 'Databases', 'Calculus', 'Linear Algebra', 'Transformers',
    'Economics', 'Biochemistry', 'Operating Systems', 'Mechanisms', 'Quantum Mechanics'
  ];

  const hasActiveFilters = Boolean(
    (filters.subject && filters.subject !== 'All') ||
    (filters.university && filters.university !== 'All') ||
    (filters.course && filters.course !== 'All') ||
    (filters.semester && filters.semester !== 'All') ||
    filters.tag
  );

  return (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
          Sort By
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'newest', label: 'Newest' },
            { id: 'downloads', label: 'Popular' },
            { id: 'likes', label: 'Liked' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => onChange({ ...filters, sortBy: opt.id as any, page: 1 })}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                (filters.sortBy || 'newest') === opt.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          Subject Discipline
        </label>
        <select
          value={filters.subject || 'All'}
          onChange={e => onChange({ ...filters, subject: e.target.value, page: 1 })}
          className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="All">All Subjects</option>
          {SEED_SUBJECTS.map(sub => (
            <option key={sub.name} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* University Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          University Campus
        </label>
        <select
          value={filters.university || 'All'}
          onChange={e => onChange({ ...filters, university: e.target.value, page: 1 })}
          className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="All">All Universities</option>
          {SEED_UNIVERSITIES.map(uni => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
      </div>

      {/* Semester Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          Academic Semester
        </label>
        <select
          value={filters.semester || 'All'}
          onChange={e => onChange({ ...filters, semester: e.target.value, page: 1 })}
          className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="All">All Semesters</option>
          {SEED_SEMESTERS.map(sem => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Popular Tags */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-600" />
          Popular Topic Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map(tag => {
            const isSelected = filters.tag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => {
                  onChange({
                    ...filters,
                    tag: isSelected ? undefined : tag,
                    page: 1,
                  });
                }}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
