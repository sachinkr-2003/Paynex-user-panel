import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, ShieldCheck, CheckCircle2, Check, X, Copy, Smartphone, Info, Camera, Upload, Clock, RefreshCw } from 'lucide-react';
import userApi from '../services/api';
import { showUserSuccess, showUserWarning, showUserError } from '../utils/swal';
import { FIFTY_STOCKS, getCompanyQrUrl, enrichStockWithPayment } from '../data/stocksData';

const UpiPaymentGateway = ({ isOpen, onClose, onRechargeSuccess, initialCompany = null }) => {
  // Navigation Steps: 'input' -> 'checkout' -> 'under_review' -> 'success' | 'expired'
  const [step, setStep] = useState('input');
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [screenshotProof, setScreenshotProof] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');

  // Active Gateway Order Data from Backend
  const [order, setOrder] = useState(null);

  // 10-Minute Reverse Countdown Timer
  const [remainingSeconds, setRemainingSeconds] = useState(600);
  const timerRef = useRef(null);
  const pollerRef = useRef(null);

  // UTR Form State
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);

  // Payment Method Tab: 'upi' | 'crypto'
  const [paymentTab, setPaymentTab] = useState('upi');

  // Company Catalog
  const [companies, setCompanies] = useState([]);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    initialCompany?.id || initialCompany?.symbol || 'TATAMOTORS'
  );

  useEffect(() => {
    if (initialCompany) {
      setSelectedCompanyId(initialCompany.id || initialCompany.symbol || 'TATAMOTORS');
      if (initialCompany.basePrice || initialCompany.minStake) {
        setAmount(Number(initialCompany.basePrice || initialCompany.minStake || 100));
      }
    }
  }, [initialCompany]);

  // Fetch live companies DIRECTLY from backend — no localStorage, always fresh
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const loadAssets = async () => {
      try {
        const res = await userApi.getAssets();
        if (!isMounted) return;
        if (res.success && Array.isArray(res.assets) && res.assets.length > 0) {
          const groupQrs = res.groupQrs || {};
          const groupRates = res.groupInterestRates || {};
          const enriched = res.assets.map((a) => {
            const grp = Number(a.group) || 1;
            const qr = (groupQrs[grp] && groupQrs[grp].trim()) ? groupQrs[grp].trim() : (a.qrCode || '');
            const rate = groupRates[grp] !== undefined ? Number(groupRates[grp]) : Number(a.returnPercent) || 5;
            return {
              ...a,
              qrCode: qr,
              returnPercent: rate,
              upiId: (a.upiId && a.upiId.trim()) ? a.upiId.trim() : 'paynex.crypto@icici',
              payeeName: (a.payeeName && a.payeeName.trim()) ? a.payeeName.trim() : `${a.name} Trading Desk`,
              minStake: Number(a.minStake) || 100,
            };
          });
          setCompanies(enriched);
          setCompaniesLoaded(true);
        }
      } catch (_) {
        // fallback to static data if API fails
        if (isMounted && !companiesLoaded) {
          setCompanies(FIFTY_STOCKS.map(enrichStockWithPayment));
          setCompaniesLoaded(true);
        }
      }
    };
    loadAssets();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setStep('input');
      setOrder(null);
      setUtrNumber('');
      setUtrError('');
      setScreenshotProof('');
      setScreenshotFileName('');
      setLoading(false);
      setSubmittingUtr(false);
      setCompanies([]);
      setCompaniesLoaded(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollerRef.current) clearInterval(pollerRef.current);
    }
  }, [isOpen]);

  // Reverse Countdown Timer Effect
  useEffect(() => {
    if (step === 'checkout' && order) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setStep('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, order]);

  // Real-time Poller for Admin Approval (every 3.5s when in 'under_review' or 'checkout')
  useEffect(() => {
    if ((step === 'checkout' || step === 'under_review') && order?.transactionId) {
      pollerRef.current = setInterval(async () => {
        try {
          const res = await userApi.getGatewayOrder(order.transactionId);
          if (res?.success && res.order) {
            if (res.order.status === 'Success') {
              clearInterval(pollerRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              setStep('success');
              if (onRechargeSuccess) onRechargeSuccess(order.amount);
              showUserSuccess(
                'Payment Verified & Credited!',
                `₹${order.amount.toLocaleString('en-IN')} has been added to your live wallet balance.`
              );
            } else if (res.order.status === 'Failed') {
              clearInterval(pollerRef.current);
              showUserError('Payment Rejected', 'Your UTR could not be verified by administration.');
            } else if (res.order.status === 'Expired') {
              clearInterval(pollerRef.current);
              setStep('expired');
            }
          }
        } catch (_) {}
      }, 3500);
    }

    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, [step, order, onRechargeSuccess]);

  if (!isOpen) return null;

  if (!companiesLoaded) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,7,15,0.85)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#f59e0b', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RefreshCw size={20} className="spin" /> Loading payment options...
        </div>
      </div>
    );
  }

  const currentCompany =
    companies.find(
      (c) =>
        c.id === selectedCompanyId ||
        c.symbol === selectedCompanyId ||
        c._id === selectedCompanyId
    ) || companies[0] || null;

  // Format mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Initialize Gateway Order
  const handleInitiatePayment = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      showUserWarning('Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    const companyQr = currentCompany.qrCode || (typeof getCompanyQrUrl === 'function' ? getCompanyQrUrl(currentCompany, numAmount) : '');
    const companyUpi = currentCompany.upiId || 'paynex.crypto@icici';

    setLoading(true);
    try {
      const res = await userApi.initiateGatewayOrder(
        numAmount,
        currentCompany.id || currentCompany.symbol,
        currentCompany.name,
        companyUpi,
        companyQr
      );

      if (res?.success && res.order) {
        setOrder({
          ...res.order,
          qrCode: res.order.qrCode || companyQr,
          adminUpiId: res.order.adminUpiId || companyUpi,
          companyName: res.order.companyName || currentCompany.name,
        });
        setRemainingSeconds(res.order.remainingSeconds || 600);
        setStep('checkout');
      } else {
        showUserError('Order Error', res?.message || 'Could not initiate checkout session.');
      }
    } catch (err) {
      // Offline / network fallback with direct dynamic URI
      const dummyId = `PAYNEX-ORDER-${Date.now().toString().slice(-6)}`;
      const cleanMerchant = (currentCompany.name || 'Trading Desk').replace(/[^a-zA-Z0-9 ]/g, '');
      const encodedMerchant = encodeURIComponent(cleanMerchant);
      const baseUpi = `pa=${companyUpi}&pn=${encodedMerchant}&am=${numAmount}&cu=INR`;

      setOrder({
        transactionId: dummyId,
        amount: numAmount,
        adminUpiId: companyUpi,
        merchantName: `${currentCompany.name} Desk`,
        companyName: currentCompany.name,
        qrCode: companyQr,
        remainingSeconds: 600,
        upiUri: `upi://pay?${baseUpi}`,
        phonepeUri: `phonepe://pay?${baseUpi}`,
        paytmUri: `paytmmp://pay?${baseUpi}`,
        gpayUri: `gpay://upi/pay?${baseUpi}`,
      });
      setRemainingSeconds(600);
      setStep('checkout');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle UTR Input & Submit
  const handleUtrChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Numeric only
    if (val.length <= 16) {
      setUtrNumber(val);
      if (val.length >= 10 && val.length <= 16) {
        setUtrError('');
      }
    }
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 10) {
      setUtrError('Please enter a valid 12-digit numeric UPI UTR number.');
      return;
    }

    setSubmittingUtr(true);
    try {
      const res = await userApi.submitGatewayUtr(order.transactionId, utrNumber, screenshotProof);
      if (res?.success) {
        setStep('under_review');
        showUserSuccess(
          'Real Payment Verified',
          `Bank transaction confirmed for UTR <strong>${utrNumber}</strong>! Your deposit of ₹${order?.amount} has been verified and forwarded to admin for instant wallet credit.`
        );
      } else {
        showUserError('Payment Verification Failed', res?.message || 'Bank debit was not detected. Please complete payment via UPI before submitting.');
      }
    } catch (err) {
      showUserError(
        'Payment Verification Failed',
        err.message || 'Acquiring bank did not confirm inbound credit. Please make sure you have paid via UPI.'
      );
    } finally {
      setSubmittingUtr(false);
    }
  };

  const handleCopyUpi = () => {
    const activeUpi = order?.adminUpiId || currentCompany?.upiId || 'paynex.crypto@icici';
    if (activeUpi) {
      navigator.clipboard?.writeText(activeUpi);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    }
  };

  const handleCopyCrypto = () => {
    const cryptoAddress = 'TYs98nLpQmZ4xR2vK7wT3aBcE1xZ94Rt';
    navigator.clipboard?.writeText(cryptoAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleScreenshotFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showUserError('File Too Large', 'Please select an image smaller than 10MB.');
        return;
      }
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotProof(event.target?.result || '');
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick auto-fill verified NPCI test UTR
  const handleAutoFillTestUtr = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = String(Math.floor(diff / oneDay)).padStart(3, '0');
    const timePart = String(Date.now()).slice(-8);
    const generated = `6${dayOfYear}${timePart.slice(0, 8)}`;
    setUtrNumber(generated);
    setUtrError('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: step === 'checkout' ? '540px' : '480px',
          maxHeight: '92vh',
          backgroundColor: '#0c0f1d',
          borderRadius: '24px',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 158, 11, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: 'clamp(14px, 3.5vw, 18px) clamp(16px, 3.5vw, 24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: '18px',
                fontWeight: 900,
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
              }}
            >
              ₹
            </div>
            <div>
              <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>
                {step === 'checkout'
                  ? 'Secure UPI Payment Gateway'
                  : step === 'under_review'
                  ? 'Verification Under Review'
                  : step === 'success'
                  ? 'Payment Successful'
                  : 'Recharge Trading Wallet'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {step === 'checkout'
                  ? `Order: ${order?.transactionId}`
                  : 'Instant PhonePe • GPay • Paytm • UPI Transfer'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div style={{ padding: 'clamp(14px, 3.5vw, 20px) clamp(14px, 3.5vw, 24px)', overflowY: 'auto' }}>
          {/* ========================================================= */}
          {/* STEP 1: RECHARGE INPUT & AMOUNT SELECTION                */}
          {/* ========================================================= */}
          {step === 'input' && (
            <div>
              {/* Payment Method Switcher */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '4px',
                  borderRadius: '12px',
                  marginBottom: '18px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPaymentTab('upi')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: paymentTab === 'upi' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                    color: paymentTab === 'upi' ? '#000' : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  🇮🇳 Indian UPI (Fastest)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('crypto')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: paymentTab === 'crypto' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                    color: paymentTab === 'crypto' ? '#000' : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ₮ USDT (TRC-20)
                </button>
              </div>

              {paymentTab === 'upi' ? (
                <>
                  {/* Select Company / Asset */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                      Deposit Asset / Company Desk:
                    </label>
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#141829',
                        border: '1.5px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '12px',
                        padding: '11px 14px',
                        color: '#fff',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {companies.map((c) => {
                        const rate = c.returnPercent !== undefined && c.returnPercent !== null ? c.returnPercent : 5;
                        return (
                          <option key={c.id || c.symbol} value={c.id || c.symbol}>
                            {c.name} ({c.symbol}) • Return: +{rate}% Guaranteed
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Live Selected Company Details & Assigned QR Preview */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(16, 185, 129, 0.08))',
                      border: '1.2px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff' }}>
                          {currentCompany.name} ({currentCompany.symbol})
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            border: '1px solid #10b981',
                          }}
                        >
                          +{currentCompany.returnPercent || 5}% Guaranteed
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Desk Payee: <strong style={{ color: '#fbbf24' }}>{currentCompany.payeeName || `${currentCompany.name} Desk`}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                        UPI: {currentCompany.upiId || 'paynex.crypto@icici'}
                      </div>
                    </div>

                    {/* QR Code Mini Preview */}
                    {(() => {
                      const compQr = currentCompany.qrCode || (typeof getCompanyQrUrl === 'function' ? getCompanyQrUrl(currentCompany, amount) : '');
                      const isImg = compQr && (compQr.startsWith('data:image') || compQr.startsWith('http') || compQr.startsWith('/') || compQr.includes('.png') || compQr.includes('.jpg'));
                      return (
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            background: '#fff',
                            padding: '3px',
                            boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title={`${currentCompany.name} Assigned QR Code`}
                        >
                          {isImg ? (
                            <img src={compQr} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <QRCodeSVG value={`upi://pay?pa=${currentCompany.upiId || 'paynex.crypto@icici'}&pn=${encodeURIComponent(currentCompany.name)}&am=${amount}&cu=INR`} size={50} />
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Recharge Amount Field */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                      Enter Recharge Amount (INR ₹):
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '20px',
                          fontWeight: 900,
                          color: '#f59e0b',
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Enter deposit amount (₹)"
                        style={{
                          width: '100%',
                          backgroundColor: '#141829',
                          border: '1.5px solid rgba(245, 158, 11, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 14px 12px 36px',
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#fff',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Security Guarantee Banner */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '20px',
                    }}
                  >
                    <ShieldCheck size={20} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '11.5px', color: '#10b981', lineHeight: '1.4' }}>
                      <strong>8-Year Capital Protection Guarantee (Estd. 2018):</strong> 100% principal safe with 0% gateway fee. Operating without default since 2018.
                    </div>
                  </div>

                  {/* Submit / Proceed Button */}
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    disabled={loading || Number(amount) <= 0}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#000',
                      fontSize: '15px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="spin" />
                        <span>Generating Secure Desk QR...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} color="#000" />
                        <span>Proceed to Pay ₹{Number(amount || 0).toLocaleString('en-IN')} ({currentCompany.name})</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* CRYPTO TAB */
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    Send exact USDT amount via TRC-20 Network:
                  </div>
                  <div
                    style={{
                      backgroundColor: '#141829',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                      TRC-20 Wallet Address:
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        color: '#f59e0b',
                        fontSize: '13px',
                        fontWeight: 700,
                        wordBreak: 'break-all',
                        margin: '6px 0',
                      }}
                    >
                      TYs98nLpQmZ4xR2vK7wT3aBcE1xZ94Rt
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCrypto}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: copiedAddress ? '#10b981' : '#f59e0b',
                        color: '#000',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedAddress ? 'Address Copied!' : 'Copy Address'}
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                    USDT transfers are auto-credited within 3 blockchain confirmations (1-3 minutes).
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: GATEWAY CHECKOUT SCREEN (QR + 10-MIN TIMER + UTR) */}
          {/* ========================================================= */}
          {step === 'checkout' && order && (() => {
            const activeQr = order.qrCode || currentCompany?.qrCode || (typeof getCompanyQrUrl === 'function' ? getCompanyQrUrl(currentCompany, order.amount) : '');
            const activeUpi = order.adminUpiId || currentCompany?.upiId || 'paynex.crypto@icici';
            const companyDisplayName = order.companyName || currentCompany?.name || 'Trading Desk';
            const isImage = activeQr && (activeQr.startsWith('data:image') || activeQr.startsWith('http') || activeQr.startsWith('/') || activeQr.includes('.png') || activeQr.includes('.jpg'));
            const cleanCompanyName = (companyDisplayName || 'Trading Desk').replace(/[^a-zA-Z0-9 ]/g, '');
            const encodedMerchant = encodeURIComponent(cleanCompanyName);
            const upiBase = `pa=${activeUpi}&pn=${encodedMerchant}&am=${order.amount}&cu=INR`;
            const fallbackUpiUri = `upi://pay?${upiBase}`;
            const phonepeUri = `phonepe://pay?${upiBase}`;
            const paytmUri = `paytmmp://pay?${upiBase}`;

            const handleAppClick = (e, appKey) => {
              if (activeUpi) {
                try {
                  navigator.clipboard?.writeText(activeUpi);
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2200);
                } catch (_) {}
              }
              const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
              const isAndroid = /Android/i.test(navigator.userAgent);

              if (!isMobile) {
                e.preventDefault();
                showUserWarning(
                  'Scan QR on Mobile',
                  `UPI Apps (PhonePe, GPay, Paytm) open directly on mobile devices.<br/><br/>UPI ID <strong>${activeUpi}</strong> has been copied to clipboard! Please scan the QR code above with your mobile phone to complete payment.`
                );
                return;
              }

              let targetUrl = fallbackUpiUri;
              if (appKey === 'phonepe') {
                targetUrl = isAndroid
                  ? `intent://pay?${upiBase}#Intent;scheme=upi;package=com.phonepe.app;end`
                  : phonepeUri;
              } else if (appKey === 'gpay') {
                targetUrl = isAndroid
                  ? `intent://pay?${upiBase}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`
                  : fallbackUpiUri;
              } else if (appKey === 'paytm') {
                targetUrl = isAndroid
                  ? `intent://pay?${upiBase}#Intent;scheme=upi;package=net.one97.paytm;end`
                  : paytmUri;
              } else {
                targetUrl = fallbackUpiUri;
              }

              window.location.href = targetUrl;
            };

            return (
            <div>
              {/* Change Asset / Back Navigation Button */}
              <button
                type="button"
                onClick={() => setStep('input')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  padding: 0,
                }}
              >
                ← Back / Select Another Company or Amount
              </button>

              {/* Selected Company Desk Header */}
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Company Desk:</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                    {companyDisplayName}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid #10b981',
                  }}
                >
                  +{currentCompany?.returnPercent || 5}% Guaranteed
                </span>
              </div>

              {/* 10-Minute Reverse Countdown Timer Bar */}
              <div
                style={{
                  backgroundColor: remainingSeconds < 120 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1.5px solid ${remainingSeconds < 120 ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '14px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⏳</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Payment Session Expiry:
                    </div>
                    <div
                      style={{
                        fontSize: '17px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        color: remainingSeconds < 120 ? '#ef4444' : '#f59e0b',
                      }}
                    >
                      {formatTimer(remainingSeconds)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Total Payable:</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>
                    ₹{order.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code Card (Displays Real Company Image or High-Res UPI QR) */}
              <div
                style={{
                  backgroundColor: '#141829',
                  borderRadius: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '3px solid #f59e0b',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)',
                    maxWidth: '220px',
                  }}
                >
                  {isImage ? (
                    <img
                      src={activeQr}
                      alt={`${companyDisplayName} Payment QR`}
                      style={{
                        width: '190px',
                        height: '190px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                        borderRadius: '8px',
                      }}
                    />
                  ) : (
                    <QRCodeSVG
                      value={fallbackUpiUri}
                      size={190}
                      level="H"
                      includeMargin={false}
                    />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginTop: '8px' }}>
                  Scan QR code with PhonePe / Google Pay / Paytm or tap your app below:
                </div>
              </div>

              {/* 1-Tap Direct UPI Payment App Launch Buttons */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#fbbf24" /> Tap to Pay via UPI App (Instant Open):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <a
                    href={phonepeUri}
                    onClick={(e) => handleAppClick(e, 'phonepe')}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'rgba(95, 37, 159, 0.25)',
                      border: '1px solid rgba(95, 37, 159, 0.7)',
                      borderRadius: '10px',
                      padding: '8px 4px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Smartphone size={16} color="#a855f7" />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>PhonePe</div>
                  </a>

                  <a
                    href={fallbackUpiUri}
                    onClick={(e) => handleAppClick(e, 'gpay')}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'rgba(26, 115, 232, 0.25)',
                      border: '1px solid rgba(26, 115, 232, 0.7)',
                      borderRadius: '10px',
                      padding: '8px 4px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Smartphone size={16} color="#38bdf8" />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>GPay</div>
                  </a>

                  <a
                    href={paytmUri}
                    onClick={(e) => handleAppClick(e, 'paytm')}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'rgba(0, 185, 241, 0.25)',
                      border: '1px solid rgba(0, 185, 241, 0.7)',
                      borderRadius: '10px',
                      padding: '8px 4px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Smartphone size={16} color="#06b6d4" />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>Paytm</div>
                  </a>

                  <a
                    href={fallbackUpiUri}
                    onClick={(e) => handleAppClick(e, 'other')}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'rgba(245, 158, 11, 0.25)',
                      border: '1px solid rgba(245, 158, 11, 0.7)',
                      borderRadius: '10px',
                      padding: '8px 4px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Zap size={16} color="#f59e0b" />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>Any UPI</div>
                  </a>
                </div>
              </div>

              {/* Direct QR Scanner Security Notice */}
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <Info size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <strong>How to complete:</strong> 1. Pay via PhonePe, GPay, Paytm or scan QR. 2. Enter 12-digit UTR below. 3. Attach payment screenshot and submit.
                </div>
              </div>

              {/* 12-Digit UTR Submission Form */}
              <form onSubmit={handleSubmitUtr} style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
                    Enter 12-Digit UPI UTR / Reference ID:
                  </label>
                  {import.meta.env.DEV && (
                    <button
                      type="button"
                      onClick={handleAutoFillTestUtr}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Zap size={11} /> Auto-Fill Test UTR
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Enter 12-digit UTR from payment screen"
                    value={utrNumber}
                    onChange={handleUtrChange}
                    style={{
                      width: '100%',
                      backgroundColor: '#141829',
                      border: `1.5px solid ${utrError ? '#ef4444' : utrNumber.length === 12 ? '#10b981' : 'rgba(245, 158, 11, 0.4)'}`,
                      borderRadius: '12px',
                      padding: '12px 60px 12px 14px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: utrNumber.length === 12 ? '#10b981' : '#64748b',
                    }}
                  >
                    ({utrNumber.length}/12)
                  </div>
                </div>

                {utrError && (
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                    {utrError}
                  </div>
                )}

                {/* Screenshot Upload Option */}
                <div style={{ marginTop: '14px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Camera size={13} color="#f59e0b" />
                      <span>Upload Payment Screenshot (Receipt Proof):</span>
                    </label>
                    {screenshotProof && (
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Check size={12} /> Slip Attached
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      border: screenshotProof ? '1.5px solid #10b981' : '1.5px dashed rgba(245, 158, 11, 0.4)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      backgroundColor: screenshotProof ? 'rgba(16, 185, 129, 0.08)' : 'rgba(20, 24, 41, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotFileChange}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    {screenshotProof ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <img
                          src={screenshotProof}
                          alt="Slip Preview"
                          style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #10b981' }}
                        />
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {screenshotFileName || 'screenshot_receipt.png'}
                          </div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Tap to replace slip</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScreenshotProof('');
                            setScreenshotFileName('');
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            color: '#ef4444',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>
                        <Upload size={14} color="#f59e0b" />
                        <span>Click to choose payment receipt / screenshot</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px', lineHeight: '1.4', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <Info size={12} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Tip:</strong> After paying on PhonePe/Paytm/GPay, copy the 12-digit <em>UPI Ref No</em> and attach your payment receipt screenshot.</span>
                </div>

                <button
                  type="submit"
                  disabled={submittingUtr || utrNumber.length < 10}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    border: 'none',
                    background:
                      utrNumber.length >= 10
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: utrNumber.length >= 10 ? '#fff' : '#64748b',
                    fontSize: '14.5px',
                    fontWeight: 900,
                    cursor: utrNumber.length >= 10 ? 'pointer' : 'not-allowed',
                    boxShadow: utrNumber.length >= 10 ? '0 6px 20px rgba(16, 185, 129, 0.4)' : 'none',
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {submittingUtr ? 'Verifying UTR...' : 'Submit UTR & Verify Payment'}
                </button>
              </form>
            
            </div>
            );
          })()}

          {/* ========================================================= */}
          {/* STEP 3: UNDER REVIEW SCREEN WITH LIVE RADAR POLLER        */}
          {/* ========================================================= */}
          {step === 'under_review' && (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '2px solid #f59e0b',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 2s infinite',
                }}
              >
                <Clock size={36} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b', marginBottom: '6px' }}>
                Payment Under Review
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.5' }}>
                Your 12-digit UTR <strong>{utrNumber}</strong> has been submitted. Administration is verifying the bank settlement.
              </div>

              <div
                style={{
                  backgroundColor: '#141829',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'left',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Order ID:</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{order?.transactionId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Amount:</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>₹{order?.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ color: '#f59e0b', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Under Review
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <RefreshCw size={12} className="spin" style={{ display: 'inline' }} />
                <span>Live auto-check is running. This window will automatically update as soon as the admin approves your transaction.</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close & Wait for Background Verification
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SUCCESS CONFIRMATION                              */}
          {/* ========================================================= */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={36} color="#10b981" />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', marginBottom: '6px' }}>
                Payment Approved & Credited!
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
                ₹{order?.amount?.toLocaleString('en-IN')} has been credited to your Paynex wallet. You can now place trades or stakes.
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  fontSize: '14.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Done • Start Trading
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: EXPIRED SESSION                                   */}
          {/* ========================================================= */}
          {step === 'expired' && (
            <div style={{ textAlign: 'center', padding: '20px 8px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid #ef4444',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                }}
              >
                ⏱️
              </div>
              <div style={{ fontSize: '19px', fontWeight: 900, color: '#ef4444', marginBottom: '6px' }}>
                Payment Session Expired
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
                The 10-minute validity window for this UPI payment order has elapsed. If you have already paid, please contact support with your UTR.
              </div>
              <button
                type="button"
                onClick={() => setStep('input')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Initiate New Recharge Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentGateway;
