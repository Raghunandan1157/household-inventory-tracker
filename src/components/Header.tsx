'use client';

import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-amber-400 rounded-2xl p-6 md:p-7 mb-6 shadow-lg shadow-amber-200/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 flex items-center gap-2">
            🛒 {t('title')}
          </h1>
          <p className="text-amber-800 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
