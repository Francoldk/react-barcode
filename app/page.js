'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function LabelGenerator() {
  // Selector de Tipo de Etiqueta: 'maritimo_dcam' | 'aereo_dcam' | 'partner'
  const [labelType, setLabelType] = useState('maritimo_dcam');

  // Campos de formulario
  const [shippingMarkCode, setShippingMarkCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [totalCartons, setTotalCartons] = useState('');

  // Formatear ID asegurando el sufijo -ARG
  const formattedId = trackingId.trim()
    ? trackingId.trim().toUpperCase().endsWith('-ARG')
      ? trackingId.trim().toUpperCase()
      : `${trackingId.trim().toUpperCase()}-ARG`
    : '';

  const parsedTotal = Math.max(1, parseInt(totalCartons, 10) || 1);
  const cartons = Array.from({ length: parsedTotal }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      {/* PANEL DE CONTROL (Oculto al imprimir) */}
      <div style={styles.controlPanel} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {labelType === 'partner' ? (
              <span style={{ fontSize: '28px' }}>🚢</span>
            ) : (
              <img src="/logo.png" alt="Logo" style={{ height: '36px', objectFit: 'contain' }} />
            )}
            <div>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>
                {labelType === 'maritimo_dcam' && 'Etiqueta Marítima Oficial DCAM'}
                {labelType === 'aereo_dcam' && 'Etiqueta Aérea Oficial DCAM (唛头)'}
                {labelType === 'partner' && 'Etiqueta Partner / Alquiler Contenedor'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                {labelType === 'maritimo_dcam' && 'Formato marítimo con identidad De China al Mundo (船標)'}
                {labelType === 'aereo_dcam' && 'Formato aéreo oficial con control de peso y producto (唛头)'}
                {labelType === 'partner' && 'Marca blanca neutral con código fijo de bodega (船標 836)'}
              </p>
            </div>
          </div>

          {/* Selector de 3 Modos */}
          <div style={styles.toggleContainer}>
            <button
              type="button"
              style={labelType === 'maritimo_dcam' ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setLabelType('maritimo_dcam')}
            >
              🚢 Marítimo DCAM
            </button>
            <button
              type="button"
              style={labelType === 'aereo_dcam' ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setLabelType('aereo_dcam')}
            >
              ✈️ Aéreo DCAM
            </button>
            <button
              type="button"
              style={labelType === 'partner' ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setLabelType('partner')}
            >
              🤝 Partner Neutral
            </button>
          </div>
        </div>

        {/* Inputs del formulario */}
        <div style={styles.gridInputs}>
          {labelType === 'partner' && (
            <div>
              <label style={styles.label}>Sufijo Shipping Mark (船標 836 - ...):</label>
              <input
                style={styles.input}
                type="text"
                value={shippingMarkCode}
                onChange={(e) => setShippingMarkCode(e.target.value)}
                placeholder="Ej: B01 o CONT-2"
              />
            </div>
          )}

          <div>
            <label style={styles.label}>Nombre Cliente / Vendedor:</label>
            <input
              style={styles.input}
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label style={styles.label}>Customer ID / Tracking:</label>
            <input
              style={styles.input}
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Ej: A-1-800214147374 (agrega -ARG)"
            />
          </div>

          {(labelType === 'aereo_dcam' || labelType === 'partner') && (
            <div>
              <label style={styles.label}>Producto / Mercadería:</label>
              <input
                style={styles.input}
                type="text"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="Ej: Baterías / Repuestos"
              />
            </div>
          )}

          {labelType === 'aereo_dcam' && (
            <div>
              <label style={styles.label}>Peso por Bulto o Total (Kg):</label>
              <input
                style={styles.input}
                type="text"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Ej: 15.5 kg"
              />
            </div>
          )}

          <div>
            <label style={styles.label}>Cantidad de Bultos / Cajas:</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="500"
              value={totalCartons}
              onChange={(e) => setTotalCartons(e.target.value)}
              placeholder="Ej: 5"
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
            : labelType === 'partner'
              ? `SHIP-836-${shippingMarkCode || 'X'}-${cartonSuffix}-${totalSuffix}`
              : `DCAM-${cartonSuffix}-${totalSuffix}`;

          // Contenido del QR según el modo seleccionado
          let qrTextData = '';
          if (labelType === 'maritimo_dcam') {
            qrTextData = [
              '📦 DE CHINA AL MUNDO (MARÍTIMO)',
              'Control de Carga / Cargo Control',
              `Guía/Tracking: #DCAM ${formattedId || 'N/A'}`,
              `Cliente/Client: ${clientName || 'N/A'}`,
              `Bultos/Cartons: ${num} / ${parsedTotal}`
            ].join('\n');
          } else if (labelType === 'aereo_dcam') {
            qrTextData = [
              '✈️ DE CHINA AL MUNDO (AÉREO)',
              '唛头 / AIR CARGO SHIPPING MARK',
              `Tracking ID: ${formattedId || 'N/A'}`,
              `Cliente/Client: ${clientName || 'N/A'}`,
              `Producto/Product: ${productDesc || 'GENERAL CARGO'}`,
              `Peso/Weight: ${weightKg ? `${weightKg} KG` : 'N/A'}`,
              `Bultos/Cartons: ${num} / ${parsedTotal}`
            ].join('\n');
          } else {
            qrTextData = [
              `SHIPPING MARK: 船標 836 ${shippingMarkCode ? `- ${shippingMarkCode}` : ''}`,
              `NAME: ${clientName || 'N/A'}`,
              `CARGO ID: ${formattedId || 'N/A'}`,
              `PRODUCT: ${productDesc || 'GENERAL CARGO'}`,
              `CARTON: ${num} / ${parsedTotal}`
            ].join('\n');
          }

          return (
            <div key={num} style={styles.labelCard}>
              <div style={styles.labelInnerBorder}>

                {/* --- MODO 1: MARÍTIMO DCAM --- */}
                {labelType === 'maritimo_dcam' && (
                  <div style={styles.labelHeaderDcam}>
                    <div style={styles.logoBox}>
                      <img src="/logo.png" alt="De China Al Mundo" style={styles.logoImg} />
                    </div>
                    <div style={styles.dividerVertical}></div>
                    <div style={styles.headerTitleBox}>
                      <div style={styles.chineseTitle}>船標</div>
                      <div style={styles.companySubTitle}>DE CHINA AL MUNDO</div>
                      {formattedId && <div style={styles.trackingHeader}>TRACK: {formattedId}</div>}
                    </div>
                  </div>
                )}

                {/* --- MODO 2: AÉREO DCAM (唛头) --- */}
                {labelType === 'aereo_dcam' && (
                  <>
                    <div style={styles.labelHeaderAereo}>
                      <div style={styles.logoBox}>
                        <img src="/logo.png" alt="De China Al Mundo" style={styles.logoImg} />
                      </div>
                      <div style={styles.dividerVertical}></div>
                      <div style={styles.headerTitleBox}>
                        <div style={styles.chineseTitleAereo}>
                          唛头：<span style={{ color: '#881337' }}>DE CHINA AL MUNDO</span>
                        </div>
                        <div style={styles.airTag}>AIR CARGO / SERVICIO AÉREO</div>
                        {formattedId && <div style={styles.trackingHeader}>TRACK: {formattedId}</div>}
                      </div>
                    </div>

                    {/* Fila técnica Aérea: Producto y Kg */}
                    <div style={styles.dataMetaRow}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>PROD:</span>
                        <span style={styles.metaValue}>{productDesc || 'GENERAL CARGO'}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>PESO:</span>
                        <span style={styles.metaValue}>{weightKg ? `${weightKg} KG` : '---'}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>CLI:</span>
                        <span style={styles.metaValue}>{clientName || '---'}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* --- MODO 3: PARTNER NEUTRAL (船標 836 -) --- */}
                {labelType === 'partner' && (
                  <>
                    <div style={styles.labelHeaderPartner}>
                      <div style={styles.iconBox}>
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                        <div style={styles.chineseTitlePartner}>
                          船標 836 {shippingMarkCode ? `- ${shippingMarkCode}` : ''}
                        </div>
                      </div>
                    </div>

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
                  </>
                )}

                {/* 2. CUERPO DE 3 SECCIONES (Carton No, QR y Barcode) */}
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

                  {/* COLUMNA 3: CUSTOMER ID & BARCODE */}
                  <div style={{ ...styles.sectionCol, flex: 1.45 }}>
                    <div style={styles.badgeHeader}>
                      {labelType === 'partner' ? '• CARGO TRACK ID' : '• CUSTOMER ID'}
                    </div>
                    <div style={styles.customerIdText}>
                      {formattedId || (labelType === 'partner' ? 'SHIP-836' : 'SIN ASIGNAR')}
                    </div>
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
    maxWidth: '950px',
    margin: '0 auto 28px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  toggleContainer: {
    display: 'flex',
    gap: '6px',
    background: '#f1f5f9',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: 'bold',
    color: '#64748b',
    cursor: 'pointer'
  },
  toggleBtnActive: {
    background: '#881337',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: 'bold',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
  labelHeaderDcam: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '6px',
    marginBottom: '6px'
  },
  labelHeaderAereo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '4px',
    marginBottom: '4px'
  },
  labelHeaderPartner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '4px',
    marginBottom: '4px',
    borderBottom: '1px solid #f1f5f9'
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
  airTag: {
    fontSize: '7.5px',
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: '0.5px',
    marginTop: '1px'
  },
  dividerVertical: {
    width: '1.5px',
    height: '42px',
    background: '#881337',
    margin: '0 10px'
  },
  headerTitleBox: {
    flex: 1.5,
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
  chineseTitleAereo: {
    fontSize: '13px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '0.5px',
    lineHeight: '1.2'
  },
  chineseTitlePartner: {
    fontSize: '20px',
    fontWeight: '900',
    color: '#881337',
    letterSpacing: '2px',
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
  dataMetaRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 1fr',
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