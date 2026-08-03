import React, { useEffect, useState } from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Calendar, FileText, Building2 } from 'lucide-react';
import { verifyPaymentOrder } from '../services/api';

interface InvoiceData {
  id?: number;
  order_number?: string;
  external_id?: string;
  description?: string;
  original_amount?: number;
  discount_amount?: number;
  amount?: number;
  status?: string;
  paid_at?: string;
  created_at?: string;
  user_name?: string;
  user_email?: string;
  merchant?: string;
  product_type?: string;
}

interface PaymentInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string | null;
  userName?: string;
  userEmail?: string;
}

export const PaymentInvoiceModal: React.FC<PaymentInvoiceModalProps> = ({
  isOpen,
  onClose,
  orderId,
  userName,
  userEmail,
}) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      verifyPaymentOrder(orderId).then((res) => {
        setLoading(false);
        const data = res as unknown as { data?: InvoiceData };
        if (data && data.data) {
          setInvoice(data.data);
        } else {
          // Fallback invoice metadata
          setInvoice({
            order_number: orderId,
            description: 'Upgrade Paket AI Navigator',
            amount: 49500,
            status: res.isPaid ? 'paid' : 'pending',
            paid_at: new Date().toLocaleString('id-ID'),
            user_name: userName || 'Siswa AI Navigator',
            user_email: userEmail || '-',
            merchant: 'Maxy Academy',
          });
        }
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [isOpen, orderId, userName, userEmail]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice?.status === 'paid' || invoice?.status === 'PAID' || invoice?.status === 'SETTLED';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Print Styles Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-invoice"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Header Actions (hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Kwitansi / Invoice Pembayaran Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm">Memuat Rincian Invoice Pembayaran...</p>
            </div>
          ) : (
            <>
              {/* Brand & Invoice Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cms.maxy.academy/uploads/LogoMaxy.png"
                    alt="Maxy Academy Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h2 className="font-black text-lg text-slate-900 dark:text-white leading-tight">MAXY ACADEMY</h2>
                    <p className="text-xs text-amber-500 font-semibold">AI Navigator Digital Learning Platform</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black text-xs uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isPaid ? 'LUNAS / PAID' : 'PENDING'}</span>
                  </div>
                  <p className="text-xs font-monospace text-slate-500 dark:text-slate-400">
                    No: <strong className="text-slate-800 dark:text-slate-200">{invoice?.order_number || orderId || 'ORDER/OFFICIAL'}</strong>
                  </p>
                </div>
              </div>

              {/* Metadata Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-200/80 dark:border-slate-800">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Penerbit / Merchant:
                  </p>
                  <strong className="text-slate-800 dark:text-slate-200">PT. Linkdataku Solusi Indonesia (Maxy Academy)</strong>
                  <p className="text-slate-400 mt-0.5">Surabaya & Jakarta, Indonesia</p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ditagihkan Kepada (Siswa):
                  </p>
                  <strong className="text-slate-800 dark:text-slate-200">{invoice?.user_name || userName || 'Siswa AI Navigator'}</strong>
                  <p className="text-slate-400 mt-0.5">{invoice?.user_email || userEmail || '-'}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rincian Pembelian</h4>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="py-3 px-4">Deskripsi Produk</th>
                        <th className="py-3 px-4 text-center">Tipe</th>
                        <th className="py-3 px-4 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      <tr>
                        <td className="py-3.5 px-4 font-bold">
                          {invoice?.description || 'Upgrade Paket AI Navigator'}
                          <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                            Akses modul pembelajaran AI, kuis interaktif, sertifikasi & proyek capstone.
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-amber-500">Subscription Access</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          Rp {(invoice?.amount || 49500).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation & Payment Method */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Diverifikasi secara digital melalui Xendit Payment Gateway</span>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">Rp {((invoice?.original_amount || invoice?.amount || 49500)).toLocaleString('id-ID')}</span>
                  </div>
                  {Boolean(invoice?.discount_amount) && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Diskon Promo:</span>
                      <span className="font-mono">- Rp {(invoice?.discount_amount || 0).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Dibayar:</span>
                    <span className="font-mono text-amber-500">Rp {(invoice?.amount || 49500).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Verification Note */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
                <p>Kwitansi ini adalah bukti pembayaran sah yang dikeluarkan secara elektronik oleh Maxy Academy.</p>
                <p className="font-monospace text-[10px]">Waktu Pembayaran: {invoice?.paid_at || new Date().toLocaleString('id-ID')}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
