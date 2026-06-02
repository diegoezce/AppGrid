'use client'

import { useLanguage } from '@/app/i18n/useLanguage'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="ag-language-toggle">
      <button
        className={`ag-lang-btn ${language === 'es' ? 'active' : ''}`}
        onClick={() => setLanguage('es')}
        title="Español"
      >
        ES
      </button>
      <button
        className={`ag-lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        EN
      </button>
    </div>
  )
}
