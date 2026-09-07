import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  FileText,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { Note } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface DocumentViewerProps {
  note: Note;
  onDownloadSuccess?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  note,
  onDownloadSuccess,
}) => {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const pages = note.previewPages && note.previewPages.length > 0
    ? note.previewPages
    : [
        `# ${note.title}\n\nCourse: ${note.course} • ${note.subject}\nUniversity: ${note.university}\n\n${note.description}\n\n*Author: ${note.author.name}*`,
        `## Key Study Points & Exam Review\n\n1. Core architectural concepts and definitions.\n2. Mathematical derivations and proofs.\n3. Practical implementations and problem walkthroughs.\n\n*Page 2 of ${note.pageCount}*`,
      ];

  const totalPages = pages.length;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await api.recordDownload(note.id);
      onDownloadSuccess?.();

      // Create downloadable text/markdown file representing the note
      const documentContent = [
        `========================================================================`,
        `NOTE TITLE: ${note.title}`,
        `COURSE: ${note.course} (${note.subject})`,
        `UNIVERSITY: ${note.university} - ${note.semester}`,
        `AUTHOR: ${note.author.name}`,
        `DOWNLOADED VIA: NoteNest (Share Knowledge. Learn Together.)`,
        `========================================================================\n`,
        ...pages,
      ].join('\n\n------------------------------------------------------------------------\n\n');

      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = note.fileName.replace(/\.pdf$/i, '') + '_NoteNest.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Downloaded ${note.fileName} successfully!`, 'success');
    } catch {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-3 font-sans text-slate-800 dark:text-slate-200">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-300 mt-4 mb-2">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {line.replace(/^[*|-]\s+/, '')}
              </li>
            );
          }
          if (line.startsWith('$$') && line.endsWith('$$')) {
            return (
              <div key={idx} className="my-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 font-mono text-center text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 overflow-x-auto">
                {line.replace(/\$\$/g, '')}
              </div>
            );
          }
          if (line.startsWith('```')) {
            return null; // Handle code blocks cleanly
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full shadow-inner'
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Left: Document Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
              {note.fileName}
            </p>
            <p className="text-[10px] text-slate-500">
              {(note.fileSize / 1024 / 1024).toFixed(1)} MB • {note.pageCount} Pages Total
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & Download */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
              disabled={zoomLevel <= 75}
              aria-label="Zoom Out"
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-semibold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
              disabled={zoomLevel >= 150}
              aria-label="Zoom In"
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Main Preview Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[420px] max-h-[680px]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 min-h-[520px] transition-transform duration-150 flex flex-col justify-between"
        >
          {/* Header watermark */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            <span>{note.university} • {note.course}</span>
            <span>Verified Study Resource</span>
          </div>

          {/* Formatted Content */}
          <div className="flex-1">
            {renderFormattedContent(pages[currentPage - 1])}
          </div>

          {/* Page Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>NoteNest Academic Archive</span>
            <span>Page {currentPage} of {totalPages} (Sample Preview)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
