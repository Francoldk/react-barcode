'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function LabelGenerator() {
  const [customerId, setCustomerId] = useState('A-1-800214147374');
  const [trackingNumber, setTrackingNumber] = useState('SF13489201948');
  const [totalCartons, setTotalCartons] = useState(1);
  const [qrPrefix, setQrPrefix] = useState('https://dechinaalmundo.com/track?id=');

  const total = Math.max(1, Number(totalCartons) || 1);
  const cartons = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
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

      {/* PANEL DE CONTROL */}
      <div style={styles.controlPanel} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '36px', objectFit: 'contain' }} />
          <div>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Generador de Etiquetas DCAM</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Warehouse Shipping Label oficial</p>
          </div>
        </div>

        <div style={styles.gridInputs}>
          <div>
            <label style={styles.label}>Customer ID:</label>
            <input
              style={styles.input}
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Ej: A-1-800214147374"
            />
          </div>

          <div>
            <label style={styles.label}>N° Seguimiento Origen (Tracking):</label>
            <input
              style={styles.input}
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ej: SF13489201948 / YT2049..."
            />
          </div>

          <div>
            <label style={styles.label}>Cantidad de Cajas / Bultos:</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="300"
              value={totalCartons}
              onChange={(e) => setTotalCartons(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div>
            <label style={styles.label}>Prefijo / URL del QR:</label>
            <input
              style={styles.input}
              type="text"
              value={qrPrefix}
              onChange={(e) => setQrPrefix(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <button style={styles.printBtn} onClick={() => window.print()}>
          🖨️ Imprimir Etiquetas ({total} {total === 1 ? 'bulto' : 'bultos'}) / Guardar PDF
        </button>
      </div>

      {/* GRILLA DE ETIQUETAS */}
      <div style={styles.labelsGrid} className="print-area">
        {cartons.map((num) => {
          // Si es 1 sola caja se formatea directo, si son varias se agrega el índice de bulto
          const isMultiple = total > 1;
          const cartonSuffix = String(num).padStart(3, '0');
          const totalSuffix = String(total).padStart(3, '0');
          
          const barcodeValue = isMultiple
            ? `${customerId}-${cartonSuffix}-${totalSuffix}`
            : customerId;

          const qrDataValue = isMultiple
            ? `${qrPrefix}${customerId}?track=${trackingNumber}&box=${num}_${total}`
            : `${qrPrefix}${customerId}?track=${trackingNumber}`;

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
                    <div style={styles.headerTitle}>WAREHOUSE</div>
                    <div style={styles.headerTitle}>SHIPPING LABEL</div>
                    {trackingNumber && (
                      <div style={styles.trackingText}>
                        TRACK: <strong>{trackingNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. CUERPO (3 COLUMNAS) */}
                <div style={styles.labelBody}>
                  {/* COLUMNA 1: CARTON NO */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• CARTON NO.</div>
                    <div style={styles.cartonNumber}>
                      {num} OF {total}
                    </div>
                  </div>

                  {/* COLUMNA 2: QR CODE */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• QR CODE</div>
                    <div style={styles.qrWrapper}>
                      <QRCodeSVG value={qrDataValue} size={68} level="M" />
                    </div>
                  </div>

                  {/* COLUMNA 3: CUSTOMER ID & BARCODE */}
                  <div style={{ ...styles.sectionCol, flex: 1.45 }}>
                    <div style={styles.badgeHeader}>• CUSTOMER ID</div>
                    <div style={styles.customerIdText}>{customerId}</div>
                    <div style={styles.barcodeWrapper}>
                      <Barcode
                        value={barcodeValue}
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
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
    paddingBottom: '8px',
    marginBottom: '8px'
  },
  logoBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImg: {
    maxHeight: '46px',
    maxWidth: '125px',
    objectFit: 'contain'
  },
  dividerVertical: {
    width: '1.5px',
    height: '46px',
    background: '#881337',
    margin: '0 10px'
  },
  headerTitleBox: {
    flex: 1.3,
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: '13px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '0.5px'
  },
  trackingText: {
    fontSize: '8px',
    color: '#475569',
    marginTop: '2px',
    wordBreak: 'break-all'
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