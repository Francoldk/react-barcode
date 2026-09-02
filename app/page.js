'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function LabelGenerator() {
  const [shippingMarkCode, setShippingMarkCode] = useState('836');
  const [clientName, setClientName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [totalCartons, setTotalCartons] = useState('');

  // Formatear identificador para asegurar sufijo -ARG
  const formattedId = customerId.trim()
    ? customerId.trim().toUpperCase().endsWith('-ARG')
      ? customerId.trim().toUpperCase()
      : `${customerId.trim().toUpperCase()}-ARG`
    : '';

  const parsedTotal = Math.max(1, parseInt(totalCartons, 10) || 1);
  const cartons = Array.from({ length: parsedTotal }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      {/* PANEL DE CONTROL (Oculto al imprimir) */}
      <div style={styles.controlPanel} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={styles.shipIconHeader}>🚢</div>
          <div>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Generador Universal de Shipping Marks</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Etiquetas neutras para consolidación marítima y contenedores</p>
          </div>
        </div>

        <div style={styles.gridInputs}>
          <div>
            <label style={styles.label}>Código Shipping Mark (船標):</label>
            <input
              style={styles.input}
              type="text"
              value={shippingMarkCode}
              onChange={(e) => setShippingMarkCode(e.target.value)}
              placeholder="Ej: 836"
            />
          </div>

          <div>
            <label style={styles.label}>Nombre / Vendedor / Cliente:</label>
            <input
              style={styles.input}
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej: Global Imports"
            />
          </div>

          <div>
            <label style={styles.label}>ID / Tracking:</label>
            <input
              style={styles.input}
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Ej: DC-80021 (agrega -ARG)"
            />
          </div>

          <div>
            <label style={styles.label}>Producto / Mercadería:</label>
            <input
              style={styles.input}
              type="text"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Ej: Auto Parts / Repuestos"
            />
          </div>

          <div>
            <label style={styles.label}>Cantidad de Bultos / Cajas:</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="500"
              value={totalCartons}
              onChange={(e) => setTotalCartons(e.target.value)}
              placeholder="Ej: 10"
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
          const uniqueBarcodeValue = formattedId
            ? `${formattedId}-${cartonSuffix}-${totalSuffix}`
            : `SHIP-${shippingMarkCode}-${cartonSuffix}-${totalSuffix}`;

          // Contenido técnico del QR sin marcas comerciales
          const qrTextData = [
            `SHIPPING MARK: 船標 ${shippingMarkCode || 'N/A'}`,
            `NAME / VENDOR: ${clientName || 'N/A'}`,
            `CARGO ID: ${formattedId || 'N/A'}`,
            `PRODUCT: ${productDesc || 'GENERAL CARGO'}`,
            `CARTON: ${num} / ${parsedTotal}`
          ].join('\n');

          return (
            <div key={num} style={styles.labelCard}>
              <div style={styles.labelInnerBorder}>
                
                {/* 1. ENCABEZADO NEUTRAL MARÍTIMO */}
                <div style={styles.labelHeader}>
                  <div style={styles.iconBox}>
                    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {/* Barco portacontenedores técnico */}
                      <path d="M2 19c2 1 4 1 6 0 2-1 4-1 6 0 2 1 4 1 6 0" />
                      <path d="M3 15l2-6h14l2 6H3z" />
                      <path d="M6 9V5h12v4" />
                      <line x1="10" y1="5" x2="10" y2="9" />
                      <line x1="14" y1="5" x2="14" y2="9" />
                      <circle cx="12" cy="12" r="1" fill="#881337" />
                    </svg>
                    <span style={styles.oceanTag}>OCEAN FREIGHT</span>
                  </div>

                  <div style={styles.dividerVertical}></div>

                  <div style={styles.headerTitleBox}>
                    <div style={styles.chineseTitle}>
                      船標 <span style={styles.markCode}>{shippingMarkCode || '---'}</span>
                    </div>
                    <div style={styles.subShippingMark}>SHIPPING MARK / MARCA DE EMBARQUE</div>
                  </div>
                </div>

                {/* FILA DE DATOS ESPECÍFICOS: NOMBRE / ID / PRODUCTO */}
                <div style={styles.dataMetaRow}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>NAME:</span>
                    <span style={styles.metaValue}>{clientName || '---'}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>ID:</span>
                    <span style={styles.metaValue}>{formattedId || '---'}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>PROD:</span>
                    <span style={styles.metaValue}>{productDesc || 'GENERAL CARGO'}</span>
                  </div>
                </div>

                {/* 2. CUERPO: CARTON NO, QR Y CÓDIGO DE BARRAS */}
                <div style={styles.labelBody}>
                  {/* COLUMNA 1: CARTON NO */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• CARTON NO.</div>
                    <div style={styles.cartonNumber}>
                      {num} OF {parsedTotal}
                    </div>
                  </div>

                  {/* COLUMNA 2: QR CODE */}
                  <div style={styles.sectionCol}>
                    <div style={styles.badgeHeader}>• QR CODE</div>
                    <div style={styles.qrWrapper}>
                      <QRCodeSVG value={qrTextData} size={64} level="M" />
                    </div>
                  </div>

                  {/* COLUMNA 3: BARCODE ID */}
                  <div style={{ ...styles.sectionCol, flex: 1.45 }}>
                    <div style={styles.badgeHeader}>• CARGO TRACK ID</div>
                    <div style={styles.customerIdText}>{formattedId || `SHIP-${shippingMarkCode}`}</div>
                    <div style={styles.barcodeWrapper}>
                      <Barcode
                        value={uniqueBarcodeValue}
                        width={0.75}
                        height={22}
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

      {/* ESTILOS DE IMPRESIÓN */}
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
    maxWidth: '900px',
    margin: '0 auto 28px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  shipIconHeader: {
    fontSize: '32px',
    lineHeight: 1
  },
  gridInputs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '11px',
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
    background: '#881337',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 430px))',
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
    border: '1.5px solid #ca8a04',
    borderRadius: '12px',
    padding: '8px'
  },
  labelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '4px',
    marginBottom: '4px',
    borderBottom: '1px solid #f1f5f9'
  },
  iconBox: {
    flex: 0.8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  oceanTag: {
    fontSize: '7px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '1px',
    marginTop: '2px'
  },
  dividerVertical: {
    width: '1.5px',
    height: '46px',
    background: '#881337',
    margin: '0 10px'
  },
  headerTitleBox: {
    flex: 2,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  chineseTitle: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '2px',
    lineHeight: '1.1'
  },
  markCode: {
    color: '#0f172a',
    fontWeight: '900'
  },
  subShippingMark: {
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: '0.5px',
    marginTop: '2px'
  },
  dataMetaRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr 1fr',
    gap: '6px',
    backgroundColor: '#f8fafc',
    padding: '4px 6px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    marginBottom: '6px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  metaLabel: {
    fontSize: '8px',
    fontWeight: '900',
    color: '#881337'
  },
  metaValue: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#0f172a',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  labelBody: {
    display: 'flex',
    gap: '6px'
  },
  sectionCol: {
    flex: 1,
    border: '1.5px solid #881337',
    borderRadius: '8px',
    padding: '4px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '94px',
    boxSizing: 'border-box'
  },
  badgeHeader: {
    fontSize: '7.5px',
    fontWeight: 'bold',
    color: '#881337',
    textTransform: 'uppercase',
    borderBottom: '1px solid #f1f5f9',
    width: '100%',
    paddingBottom: '2px',
    marginBottom: '2px'
  },
  cartonNumber: {
    fontSize: '17px',
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
    fontSize: '8.5px',
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