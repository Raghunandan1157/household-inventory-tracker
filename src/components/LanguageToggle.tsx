'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide hidden sm:inline">
        {t('language')}
      </span>
      <div className="flex bg-amber-100 rounded-full p-0.5 border-2 border-amber-200">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
            lang === 'en'
              ? 'bg-amber-400 text-amber-900 shadow-sm'
              : 'text-amber-700 hover:text-amber-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('kn')}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
            lang === 'kn'
              ? 'bg-amber-400 text-amber-900 shadow-sm'
              : 'text-amber-700 hover:text-amber-900'
          }`}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </div>
  );
}
