import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';
import { ClientModal } from '../../Components/Clients/ClientModal';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
    const { clients, addClient, updateClient, deleteClient } = useCRM();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

    const handleSaveClient = (data) => {
        if (editingClient) {
            updateClient(editingClient.id, data);
        } else {
            addClient(data);
        }
        setIsModalOpen(false);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Clients Management</h2>
                    <p className="text-gray-500">View and manage your client database and history.</p>
                </div>
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Client
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b-0 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        <div className="relative flex-1 max-w-md text-black">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, email or company..."
                                className=" text-black w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                                Filters
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 italic">No clients found matching your search.</TableCell>
                                </TableRow>
                            ) : (
                                currentClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900">{client.name}</div>
                                        </TableCell>
                                        <TableCell>{client.company}</TableCell>
                                        <TableCell className="text-gray-500">{client.email}</TableCell>
                                        <TableCell className="text-gray-500">{client.phone}</TableCell>
                                        <TableCell>
                                            <Badge variant={client.status === 'Active' ? 'success' : 'default'}>
                                                {client.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 text-black">
                                                <Button onClick={() => navigate(`/clients/${client.id}`)} variant="ghost" size="icon" className="text-gray-400 hover:text-secondary">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button onClick={() => deleteClient(client.id)} variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
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
                                Showing <span className="text-slate-900 font-bold">{indexOfFirstItem + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredClients.length)}</span> of <span className="text-slate-900 font-bold">{filteredClients.length}</span> clients
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


            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                client={editingClient}
            />
        </div>
    );
};

export default ClientList;
