'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Order } from '@/lib/mockData';
import { SwipeToCollect } from './SwipeToCollect';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Receipt,
  Ticket,
  Bike,
  UserCheck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartOffer, cartQuantity, checkoutOrder, user, verifyAndCollectQR } = useApp();
  
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET'>('MTN_MOMO');
  const [collectionType, setCollectionType] = useState<'SELF_PICKUP' | 'MOTARI_COURIER'>('SELF_PICKUP');
  const [momoNumber, setMomoNumber] = useState(user.phone || '+250 788 123 456');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [redemptionTab, setRedemptionTab] = useState<'SWIPE' | 'QR'>('SWIPE');
  const [isCollected, setIsCollected] = useState(false);

  if (!isOpen || (!cartOffer && !completedOrder)) return null;

  const subtotal = cartOffer ? cartOffer.discountedPrice * cartQuantity : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ECO20' || couponCode.toUpperCase() === 'FRESHFIND') {
      const discount = Math.round(subtotal * 0.2);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try 'ECO20' for 20% off!");
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      const newOrder = await checkoutOrder(paymentMethod, momoNumber);
      newOrder.collectionType = collectionType;
      newOrder.courierPin = collectionType === 'MOTARI_COURIER' ? `${Math.floor(1000 + Math.random() * 9000)}` : undefined;
      setCompletedOrder(newOrder);
      setIsProcessing(false);

      // Fire festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err: any) {
      alert(err.message || "Payment processing failed");
      setIsProcessing(false);
    }
  };

  const handleSwipeSuccess = async () => {
    setIsCollected(true);
    if (completedOrder) {
      await verifyAndCollectQR(completedOrder.qrToken);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-slate-100">
              {completedOrder ? 'Order Confirmed & Redemption Handshake' : 'Payment & Checkout'}
            </h3>
          </div>
          <button
            onClick={() => {
              setCompletedOrder(null);
              setIsCollected(false);
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS DISPLAY */}
        {completedOrder ? (
          <div className="p-6 space-y-5 text-center max-h-[75vh] overflow-y-auto">
            
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-1">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-100">Surprise Box Reserved!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Order <strong className="text-emerald-400">#{completedOrder.orderNumber}</strong> confirmed at <strong className="text-slate-200">{completedOrder.businessName}</strong>
              </p>
            </div>

            {/* Motari PIN Banner if selected */}
            {completedOrder.collectionType === 'MOTARI_COURIER' && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Bike className="w-4 h-4" />
                  <span>Motari / Courier Authorized Pickup</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Share this 4-digit PIN with your motorcycle rider to collect on your behalf:
                </p>
                <div className="inline-block bg-slate-900 px-4 py-1.5 rounded-xl border border-amber-500 font-mono text-base font-black text-amber-400">
                  PIN: {completedOrder.courierPin || '4892'}
                </div>
              </div>
            )}

            {/* Switch between TGTG Swipe & QR Code */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRedemptionTab('SWIPE')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                  redemptionTab === 'SWIPE'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✨ Swipe-to-Collect (Cashier)
              </button>
              <button
                onClick={() => setRedemptionTab('QR')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                  redemptionTab === 'QR'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📱 QR Code Scanner
              </button>
            </div>

            {/* TGTG SWIPE REDEMPTION */}
            {redemptionTab === 'SWIPE' ? (
              <SwipeToCollect
                orderNumber={completedOrder.orderNumber}
                businessName={completedOrder.businessName}
                isCollected={isCollected}
                onCollected={handleSwipeSuccess}
              />
            ) : (
              /* QR CODE TAB */
              <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500 max-w-xs mx-auto text-slate-950 space-y-2">
                <div className="flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    <path d="M10 10H40V40H10V10ZM15 15V35H35V15H15Z" fill="black" />
                    <path d="M60 10H90V40H60V10ZM65 15V35H85V15H65Z" fill="black" />
                    <path d="M10 60H40V90H10V60ZM15 65V85H35V65H15Z" fill="black" />
                    <rect x="20" y="20" width="10" height="10" fill="black" />
                    <rect x="70" y="20" width="10" height="10" fill="black" />
                    <rect x="20" y="70" width="10" height="10" fill="black" />
                    <rect x="50" y="50" width="15" height="15" fill="#10B981" />
                    <rect x="70" y="65" width="20" height="20" fill="black" />
                    <rect x="50" y="75" width="15" height="15" fill="black" />
                  </svg>
                </div>
                <p className="text-xs font-mono font-bold tracking-wider text-slate-800">
                  {completedOrder.qrToken}
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Pickup Window:</span>
                <span className="font-semibold text-amber-400">{completedOrder.pickupWindow}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Paid:</span>
                <span className="font-bold text-slate-100">{completedOrder.totalPrice.toLocaleString()} RWF</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedOrder(null);
                setIsCollected(false);
                onClose();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Done & Return to Deals
            </button>

          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Order Summary Header */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span className="uppercase tracking-wider">Surprise Box Summary</span>
                {cartOffer?.guaranteedValue && (
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Min. Value {cartOffer.guaranteedValue.toLocaleString()} RWF
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-100">
                <span>{cartQuantity}x {cartOffer?.title}</span>
                <span className="text-emerald-400">{(cartOffer!.discountedPrice * cartQuantity).toLocaleString()} RWF</span>
              </div>
              <p className="text-xs text-slate-400">{cartOffer?.businessName}</p>
            </div>

            {/* Collection Method (Self Pickup vs Motari / Courier) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Choose Collection Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCollectionType('SELF_PICKUP')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    collectionType === 'SELF_PICKUP'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold">Self Pickup</p>
                    <p className="text-[10px] text-slate-400">In person at store</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCollectionType('MOTARI_COURIER')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    collectionType === 'MOTARI_COURIER'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Bike className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold">Send a Motari</p>
                    <p className="text-[10px] text-slate-400">Rider PIN pickup</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Discount Coupon</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Ticket className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter ECO20 for 20% off"
                    disabled={couponApplied}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 uppercase focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {couponApplied ? 'Applied!' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Select Payment Gateway</label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MTN_MOMO')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    paymentMethod === 'MTN_MOMO'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xs">
                    MoMo
                  </div>
                  <div>
                    <p className="text-xs font-bold">MTN MoMo</p>
                    <p className="text-[10px] text-slate-400">Mobile Money</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    paymentMethod === 'AIRTEL_MONEY'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-black text-xs">
                    Airtel
                  </div>
                  <div>
                    <p className="text-xs font-bold">Airtel Money</p>
                    <p className="text-[10px] text-slate-400">Instant Pay</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('STRIPE_CARD')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    paymentMethod === 'STRIPE_CARD'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold">Credit / Debit</p>
                    <p className="text-[10px] text-slate-400">Stripe Card</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    paymentMethod === 'WALLET'
                      ? 'bg-teal-950/40 border-teal-500 text-teal-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-xs font-bold">Eco Wallet</p>
                    <p className="text-[10px] text-slate-400">{user.walletBalance.toLocaleString()} RWF</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Money Phone Input */}
            {(paymentMethod === 'MTN_MOMO' || paymentMethod === 'AIRTEL_MONEY') && (
              <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400">Mobile Money Phone Number</label>
                <input
                  type="text"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+250 788 123 456"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            )}

            {/* Total breakdown */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-{discountAmount.toLocaleString()} RWF</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-100 pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">{finalTotal.toLocaleString()} RWF</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Reserving Surprise Box...</span>
                </>
              ) : (
                <>
                  <span>Reserve & Pay {finalTotal.toLocaleString()} RWF</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
