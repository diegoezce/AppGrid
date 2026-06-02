'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { useLanguage } from '@/app/i18n/useLanguage'
import './pago-exitoso.css'

function SuccessContent() {
  const { t } = useLanguage()
  const params = useSearchParams()
  const status = params.get('status')
  const failed = status && status !== 'approved'

  return (
    <div className="ag-success-page">
      <div className="ag-success-card">
        <Link href="/" className="ag-logo ag-success-logo">
          <span className="ag-logo-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="ag-logo-word">AppGrid</span>
        </Link>

        {failed ? (
          <>
            <div className="ag-success-icon ag-success-icon--fail">✕</div>
            <h1 className="ag-success-title">{t('success.failed')}</h1>
            <p className="ag-success-sub">
              {t('success.failedMessage')}
            </p>
            <Link href="/marketplace" className="ag-btn ag-btn-primary ag-success-btn">
              {t('success.backMarketplace')}
            </Link>
          </>
        ) : (
          <>
            <div className="ag-success-icon">✓</div>
            <h1 className="ag-success-title">{t('success.paymentReceived')}</h1>
            <p className="ag-success-sub">
              {t('success.paymentReceivedMessage')}
            </p>
            <div className="ag-success-steps">
              <div className="ag-success-step">
                <span className="ag-success-step-num">1</span>
                <span>{t('success.step1')}</span>
              </div>
              <div className="ag-success-step">
                <span className="ag-success-step-num">2</span>
                <span>{t('success.step2')}</span>
              </div>
              <div className="ag-success-step">
                <span className="ag-success-step-num">3</span>
                <span>{t('success.step3')}</span>
              </div>
            </div>
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-success-btn">
              {t('success.exploreApps')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PagoExitosoPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
