import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard, ShieldCheck, Loader2, Calendar, Lock } from 'lucide-react';
import { Button } from '../UI/Button';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const StripeModal = ({ isOpen, onClose, amount, invoiceId, onPaymentSuccess, gateway = 'stripe1' }) => {
    if (!isOpen) return null;

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const fetchIntent = async () => {
            try {
                const { data } = await api.post('payments/stripe/create-intent', { 
                    invoice_id: invoiceId,
                    gateway: gateway
                });
                if (data && data.clientSecret) {
                    setClientSecret(data.clientSecret);
                }
            } catch (err) {
                console.error(err);
                toast.error('Network error. Check backend connection.');
            }
        };

        if (isOpen) fetchIntent();
    }, [isOpen, invoiceId, gateway]);

    const handleStripePayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
            },
        });

        if (error) {
            toast.error(error.message);
            setIsProcessing(false);
        } else if (paymentIntent.status === 'succeeded') {
            toast.success('Payment Received Successfully!');
            onPaymentSuccess('Stripe (Card)');
            onClose();
        }
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#9ca3af' },
            },
            invalid: {
                color: '#ef4444',
            },
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Secure Payment</h3>
                                <p className="text-sm text-gray-500 font-medium">Stripe Encrypted Terminal</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-indigo-500/30 transition-all duration-700" />
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Due</p>
                                <span className="text-3xl font-black tracking-tighter">${Number(amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleStripePayment} className="space-y-5 text-black">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                            <div className="p-4 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <CardNumberElement options={elementOptions} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-black">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                <div className="p-4 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                    <CardExpiryElement options={elementOptions} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                                <div className="p-4 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                    <CardCvcElement options={elementOptions} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-base"
                                disabled={!stripe || isProcessing || !clientSecret}
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Authorize Payment</>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StripeModal;

