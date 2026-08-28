'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function LabelGenerator() {
  const [clientName, setClientName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [totalCartons, setTotalCartons] = useState('');

  // Formatear tracking para que termine siempre en -ARG si tiene valor
  const formattedTracking = trackingNumber.trim()
    ? trackingNumber.trim().toUpperCase().endsWith('-ARG')
      ? trackingNumber.trim().toUpperCase()
      : `${trackingNumber.trim().toUpperCase()}-ARG`
    : '';

  const parsedTotal = Math.max(1, parseInt(totalCartons, 10) || 1);
  const cartons = Array.from({ length: parsedTotal }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      {/* PANEL DE CONTROL (Oculto al imprimir) */}
      <div style={styles.controlPanel} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '36px' }} />
          <div>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Generador de Etiquetas DCAM</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Formato oficial Warehouse Shipping Label</p>
          </div>
        </div>

        <div style={styles.gridInputs}>
          <div>
            <label style={styles.label}>Nombre del Cliente / Client Name:</label>
            <input
              style={styles.input}
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label style={styles.label}>Customer ID / Envío:</label>
            <input
              style={styles.input}
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Ej: A-1-800214147374"
            />
          </div>

          <div>
            <label style={styles.label}>Nº Seguimiento Origen (Tracking):</label>
            <input
              style={styles.input}
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ej: SF13489201948 (se añade -ARG solo)"
            />
          </div>

          <div>
            <label style={styles.label}>Total de Cajas / Bultos:</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="500"
              value={totalCartons}
              onChange={(e) => setTotalCartons(e.target.value)}
              placeholder="Ej: 3"
            />
          </div>
        </div>

        <button style={styles.printBtn} onClick={() => window.print()}>
          🖨️ Imprimir Etiquetas ({totalCartons || 1} {totalCartons === '1' ? 'bulto' : 'bultos'}) / Guardar PDF
        </button>
      </div>

      {/* GRILLA DE ETIQUETAS */}
      <div style={styles.labelsGrid} className="print-area">
        {cartons.map((num) => {
          const cartonSuffix = String(num).padStart(3, '0');
          const totalSuffix = String(parsedTotal).padStart(3, '0');
          const uniqueBarcodeValue = customerId
            ? `${customerId}-${cartonSuffix}-${totalSuffix}`
            : `DCAM-${cartonSuffix}-${totalSuffix}`;

          // Estructura del QR bilingüe con datos reales
          const qrTextData = [
            '📦 DE CHINA AL MUNDO',
            'Control de Carga / Cargo Control',
            `Guía/Tracking: #DCAM ${customerId || 'N/A'}`,
            `Cliente/Client: ${clientName || 'N/A'}`,
            `Bultos/Cartons: ${num} / ${parsedTotal}`,
            formattedTracking ? `Nº Seguimiento/Tracking No: ${formattedTracking}` : null
          ].filter(Boolean).join('\n');

          return (
            <div key={num} style={styles.labelCard}>
              <div style={styles.labelInnerBorder}>
                {/* 1. ENCABEZADO */}
                <div style={styles.labelHeader}>
                  <div style={styles.logoBox}>
                    <img src="/logo.png" alt="De China Al Mundo" style={styles.logoImg} />
                  </div>

                  <div style={styles.dividerVertical}></div>

                  <div style={styles.headerTitleBox}>
                    <div style={styles.chineseTitle}>船標</div>
                    <div style={styles.companySubTitle}>DE CHINA AL MUNDO</div>
                    {formattedTracking && (
                      <div style={styles.trackingHeader}>TRACK: {formattedTracking}</div>
                    )}
                  </div>
                </div>

                {/* 2. CUERPO (3 SECCIONES) */}
                <div style={styles.labelBody}>
                  {/* COLUMNA 1: CARTON NO */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• CARTON NO.</div>
                    <div style={styles.cartonNumber}>
                      {num} OF {parsedTotal}
                    </div>
                  </div>

                  {/* COLUMNA 2: QR CODE DINÁMICO */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• QR CODE</div>
                    <div style={styles.qrWrapper}>
                      <QRCodeSVG value={qrTextData} size={68} level="M" />
                    </div>
                  </div>

                  {/* COLUMNA 3: CUSTOMER ID & BARCODE */}
                  <div style={{ ...styles.sectionCol, flex: 1.45 }}>
                    <div style={styles.badgeHeader}>• CUSTOMER ID</div>
                    <div style={styles.customerIdText}>{customerId || 'SIN ASIGNAR'}</div>
                    <div style={styles.barcodeWrapper}>
                      <Barcode
                        value={uniqueBarcodeValue}
                        width={0.75}
                        height={24}
                        fontSize={6}
                        margin={0}
                        displayValue={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ESTILOS DE IMPRESIÓN DIRECTA */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
            width: 100% !important;
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '24px',
    fontFamily: '"Helvetica Neue", Arial, sans-serif'
  },
  controlPanel: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '850px',
    margin: '0 auto 28px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  gridInputs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '9px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '13px'
  },
  printBtn: {
    background: '#b91c1c',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%'
  },
  labelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 420px))',
    gap: '16px',
    justifyContent: 'center'
  },
  labelCard: {
    background: '#ffffff',
    border: '2.5px solid #881337',
    borderRadius: '16px',
    padding: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
    pageBreakInside: 'avoid'
  },
  labelInnerBorder: {
    border: '1.5px solid #eab308',
    borderRadius: '12px',
    padding: '10px'
  },
  labelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '6px',
    marginBottom: '6px'
  },
  logoBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImg: {
    maxHeight: '44px',
    maxWidth: '120px',
    objectFit: 'contain'
  },
  dividerVertical: {
    width: '1.5px',
    height: '42px',
    background: '#881337',
    margin: '0 10px'
  },
  headerTitleBox: {
    flex: 1.3,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  chineseTitle: {
    fontSize: '16px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '3px',
    lineHeight: '1.1'
  },
  companySubTitle: {
    fontSize: '11px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '0.5px',
    marginTop: '1px'
  },
  trackingHeader: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#475569',
    marginTop: '2px'
  },
  labelBody: {
    display: 'flex',
    gap: '6px'
  },
  sectionCol: {
    flex: 1,
    border: '1.5px solid #881337',
    borderRadius: '8px',
    padding: '5px 4px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100px',
    boxSizing: 'border-box'
  },
  badgeHeader: {
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#881337',
    textTransform: 'uppercase',
    borderBottom: '1px solid #f1f5f9',
    width: '100%',
    paddingBottom: '3px',
    marginBottom: '3px'
  },
  cartonNumber: {
    fontSize: '18px',
    fontWeight: '900',
    color: '#0f172a',
    margin: 'auto 0'
  },
  qrWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto 0'
  },
  customerIdText: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '2px'
  },
  barcodeWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden'
  }
};