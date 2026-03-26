import React, { useState, useEffect } from 'react';

import { PayPalButtons } from "@paypal/react-paypal-js";
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const PayPalModal = ({ isOpen, onClose, amount, invoiceId, onPaymentSuccess }) => {
    if (!isOpen) return null;

    const [isProcessing, setIsProcessing] = useState(false);

    const createPayPalOrder = async () => {
        try {
            const { data, error } = await api.post('payments/paypal/create-order', { invoice_id: invoiceId });
            if (data && data.id) return data.id;
            throw new Error(error?.message || 'Order creation failed');
        } catch (err) {
            toast.error("Could not initiate PayPal order.");
            return null;
        }
    };

    const onApprove = async (paypalData) => {
        setIsProcessing(true);
        try {
            const { data, error } = await api.post('payments/paypal/capture-order', { 
                orderID: paypalData.orderID,
                invoice_id: invoiceId 
            });
            if (data && data.status === "COMPLETED") {
                toast.success("Payment Received Successfully!");
                onPaymentSuccess('PayPal');
                onClose();
            } else {
                toast.error(error?.message || "Capture failed.");
            }
        } catch (err) {
            toast.error("Capture failed. Contact support.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="w-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">PayPal Checkout</h3>
                                <p className="text-sm text-gray-500">Fast and secure payment via PayPal</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Payable Amount</span>
                            <span className="text-2xl font-black text-gray-900">${Number(amount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {isProcessing ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Processing Payment...</p>
                            </div>
                        ) : (
                            <PayPalButtons 
                                style={{ layout: "vertical", shape: "rect", label: "pay" }}
                                createOrder={createPayPalOrder}
                                onApprove={onApprove}
                            />
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center mt-6">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Secured by PayPal Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayPalModal;
