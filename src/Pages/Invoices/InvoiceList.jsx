import React, { useState } from 'react';
import { Plus, Search, Filter, Download, CheckCircle, Copy, CheckCircle2, CreditCard, Wallet, Banknote, Trash2 } from 'lucide-react';

import { Card, CardHeader, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const InvoiceList = () => {
    const { invoices, updateInvoiceStatus, deleteInvoice } = useCRM();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const filteredInvoices = invoices.filter(inv => {
        const clientName = inv.clients?.name || 'Unknown Client';
        return inv.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

    const stats = {
        collected: invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + Number(b.total || 0), 0),
        outstanding: invoices.filter(i => i.status === 'Pending').reduce((a, b) => a + Number(b.total || 0), 0),
        overdue: invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + Number(b.total || 0), 0),
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                    <p className="text-gray-500">Track billing history and payment statuses.</p>
                </div>
                <Button onClick={() => navigate('/invoices/new')} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C] shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Collected</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.collected.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[70%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C]  shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-amber-500/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Outstanding Balance</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.outstanding.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[45%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C]  shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-red-600/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overdue Receivables</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.overdue.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 w-[20%]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="border-b-0 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto text-black">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Via</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 italic">No invoices found matching your criteria.</TableCell>
                                </TableRow>
                            ) : (
                                currentInvoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-semibold text-secondary">{(1010 + Number(inv.id))}</TableCell>
                                        <TableCell>{inv.clients?.name || 'Unknown Client'}</TableCell>
                                        <TableCell className="text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">${Number(inv.total || 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                inv.status === 'Paid' ? 'success' :
                                                    inv.status === 'Pending' ? 'warning' : 'danger'
                                            }>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const method = inv.payment_method || inv.paymentMethod;
                                                if (!method || inv.status !== 'Paid') {
                                                    return <span className="text-gray-300 text-sm">—</span>;
                                                }
                                                const isPayPal = method.toLowerCase().includes('paypal');
                                                const isStripe = method.toLowerCase().includes('stripe') || method.toLowerCase().includes('card');
                                                const isManual = method.toLowerCase().includes('manual');
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                                        isPayPal  ? 'bg-blue-50 text-blue-700' :
                                                        isStripe  ? 'bg-indigo-50 text-indigo-700' :
                                                        isManual  ? 'bg-gray-100 text-gray-600' :
                                                                    'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                        {isPayPal  ? <Wallet className="w-3 h-3" /> :
                                                         isStripe  ? <CreditCard className="w-3 h-3" /> :
                                                                     <Banknote className="w-3 h-3" />}
                                                        {method}
                                                    </span>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inv.status !== 'Paid' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-indigo-500 hover:bg-indigo-50"
                                                            title="Copy Payment Link"
                                                            onClick={() => {
                                                                const link = `${window.location.protocol}//${window.location.host}/pay/${inv.uuid || inv.id}`;
                                                                navigator.clipboard.writeText(link);
                                                                toast.success('Payment link copied to clipboard!');
                                                            }}
                                                        >
                                                            <Copy className="w-8 h-8" />
                                                        </Button>
                                                        <Button onClick={() => updateInvoiceStatus(inv.id, 'Paid', 'Manual')} variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50 gap-1 h-8">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Mark as Paid
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                                    title="Delete Invoice"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
                                                            deleteInvoice(inv.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                            <p className="text-xs text-slate-500 font-medium tracking-tight">
                                Showing <span className="text-slate-900 font-bold">{indexOfFirstItem + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredInvoices.length)}</span> of <span className="text-slate-900 font-bold">{filteredInvoices.length}</span> invoices
                            </p>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 px-3 text-xs font-bold"
                                >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={currentPage === i + 1 ? 'luxury' : 'ghost'}
                                        size="sm"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`h-8 w-8 p-0 text-xs font-bold transition-all duration-300 ${currentPage === i + 1 ? 'shadow-lg shadow-indigo-500/20' : ''}`}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 px-3 text-xs font-bold"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

    );
};

export default InvoiceList;
