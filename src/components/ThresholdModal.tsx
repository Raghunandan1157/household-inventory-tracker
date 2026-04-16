'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ThresholdModalProps {
  isOpen: boolean;
  itemName: string;
  currentThreshold: number;
  onSave: (value: number) => void;
  onClose: () => void;
}

export default function ThresholdModal({
  isOpen,
  itemName,
  currentThreshold,
  onSave,
  onClose,
}: ThresholdModalProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState(currentThreshold);

  useEffect(() => {
    setValue(currentThreshold);
  }, [currentThreshold, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full border-3 border-amber-400 shadow-2xl">
        <h3 className="text-lg font-bold text-amber-900 mb-4">
          {t('editThreshold')} {itemName}
        </h3>
        <label className="block text-sm text-amber-800 mb-2 font-semibold">
          {t('alertBelow')}
        </label>
        <input
          type="number"
          min={0}
          step={1}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
          className="w-full p-3 border-2 border-amber-200 rounded-xl text-lg mb-4 focus:outline-none focus:border-amber-400 text-amber-900"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-amber-400 bg-white text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onSave(value)}
            className="px-5 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-400 text-amber-900 font-semibold hover:bg-amber-500 transition-colors"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
