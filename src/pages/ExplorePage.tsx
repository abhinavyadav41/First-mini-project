import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  X,
  Sparkles,
} from 'lucide-react';
import { Note, FilterOptions } from '../types';
import { NoteCard } from '../components/NoteCard';
import { FilterPanel } from '../components/FilterPanel';
import { api } from '../services/api';

interface ExplorePageProps {
  initialFilter?: string;
  onNavigate: (view: string, param?: string) => void;
  onAuthorClick: (authorId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  initialFilter,
  onNavigate,
  onAuthorClick,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const defaultFilters: FilterOptions = {
      page: 1,
      limit: 12,
      sortBy: 'newest',
    };
    if (initialFilter) {
      if (initialFilter === 'trending') {
        defaultFilters.sortBy = 'downloads';
      } else if (initialFilter === 'newest') {
        defaultFilters.sortBy = 'newest';
      } else if (initialFilter === 'subjects') {
        // Just general
      } else {
        // Assume initialFilter is a subject or tag
        defaultFilters.subject = initialFilter;
      }
    }
    return defaultFilters;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notes whenever filters or search changes
  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.getNotes(filters);
      setNotes(res.notes);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchQuery.trim() || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'newest',
    });
  };

  const activeFilterCount = [
    filters.subject && filters.subject !== 'All',
    filters.university && filters.university !== 'All',
    filters.course && filters.course !== 'All',
    filters.semester && filters.semester !== 'All',
    filters.tag,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or course code..."
              className="w-full px-3 py-3 text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilters(prev => ({ ...prev, search: undefined, page: 1 }));
                }}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 mr-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* View Mode & Filter Toggle Button for Mobile */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid / List view toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold">Active:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Query: "{filters.search}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters(p => ({ ...p, search: undefined, page: 1 }));
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.subject && filters.subject !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Subject: {filters.subject}
              <button onClick={() => setFilters(p => ({ ...p, subject: undefined, page: 1 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.university && filters.university !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              University: {filters.university}
              <button onClick={() => setFilters(p => ({ ...p, university: undefined, page: 1 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.semester && filters.semester !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Semester: {filters.semester}
              <button onClick={() => setFilters(p => ({ ...p, semester: undefined, page: 1 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.tag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Tag: #{filters.tag}
              <button onClick={() => setFilters(p => ({ ...p, tag: undefined, page: 1 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Filter rail + Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Panel */}
        <aside className="hidden md:block col-span-1 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm sticky top-24">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm md:hidden">
            <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Filter Documents</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={f => {
                  handleFilterChange(f);
                  setIsMobileFiltersOpen(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFiltersOpen(false);
                }}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Notes Grid / List */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              Showing {notes.length} of {total} notes
            </span>
            <span className="capitalize">
              Sorted by: {filters.sortBy === 'downloads' ? 'Most Popular' : filters.sortBy === 'likes' ? 'Most Liked' : 'Newest First'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching study materials found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                Try searching with a broader keyword, different subject discipline, or reset your active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onSelect={id => onNavigate('note-detail', id)}
                  onAuthorClick={authorId => onAuthorClick(authorId)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  layout="list"
                  onSelect={id => onNavigate('note-detail', id)}
                  onAuthorClick={authorId => onAuthorClick(authorId)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setFilters(p => ({ ...p, page: Math.max(1, page - 1) }))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                <button
                  key={pNum}
                  onClick={() => setFilters(p => ({ ...p, page: pNum }))}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    page === pNum
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                onClick={() => setFilters(p => ({ ...p, page: Math.min(totalPages, page + 1) }))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
