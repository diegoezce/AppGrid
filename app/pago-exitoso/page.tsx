'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import './pago-exitoso.css'

function SuccessContent() {
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
            <h1 className="ag-success-title">Algo salió mal</h1>
            <p className="ag-success-sub">
              El pago no se completó. Podés intentarlo de nuevo desde el marketplace.
            </p>
            <Link href="/marketplace" className="ag-btn ag-btn-primary ag-success-btn">
              Volver al marketplace
            </Link>
          </>
        ) : (
          <>
            <div className="ag-success-icon">✓</div>
            <h1 className="ag-success-title">¡Pago recibido!</h1>
            <p className="ag-success-sub">
              Tu compra fue procesada correctamente. El desarrollador revisará el pago
              y se pondrá en contacto con vos a la brevedad con los detalles de acceso.
            </p>
            <div className="ag-success-steps">
              <div className="ag-success-step">
                <span className="ag-success-step-num">1</span>
                <span>El dev confirma el pago en MercadoPago</span>
              </div>
              <div className="ag-success-step">
                <span className="ag-success-step-num">2</span>
                <span>Te envía las credenciales de acceso por email</span>
              </div>
              <div className="ag-success-step">
                <span className="ag-success-step-num">3</span>
                <span>Empezás a usar la app</span>
              </div>
            </div>
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-success-btn">
              Explorar más apps
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
