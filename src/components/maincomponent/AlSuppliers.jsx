import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

const AlSuppliers = () => {
  const { fetchSuppliers, suppliers, allProductLoading } =
    useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [ignoredSuppliers,setIgnoredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ignored, setIgnored] = useState(false);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchIgnoredSuppliers = async () => {
    setLoading(true);
    setIgnored(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ignored-suppliers`);
      if (!response.ok){
        setLoading(false);
         throw new Error('Failed to fetch ignored suppliers');
      }
      const data = await response.json();
      if (!data || !data.data) {
        setLoading(false);
        throw new Error('Unexpected API response structure');
      }
      setIgnoredSuppliers(data.data);
        setLoading(false);
    } catch (err) {
        setLoading(false);
      console.error('Error fetching ignored suppliers:', err);
    }
  };

  if (allProductLoading || loading)
    return (
      <div className='flex items-center justify-center mt-20'>
        <div className='w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin'></div>
        <p className='ml-4 text-lg font-semibold'>Loading Suppliers...</p>
      </div>
    );

  // Pagination logic
  const totalPages = Math.ceil((!ignored?suppliers.length:ignoredSuppliers.length>0?ignoredSuppliers.length:1) / (!ignored ? itemsPerPage:ignoredSuppliers.length>0?ignoredSuppliers.length:1));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = suppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewSupplier = (supplier) => {
    navigate(`/supplier/${supplier.id}`, { state: supplier });
  };
  const deactivateSupplier = async(supplier) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ignore-supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierId: supplier.id }),
      });
      if (response.ok) {
        toast.success("Supplier deactivated successfully!");
        fetchSuppliers()
      }
        else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
  }
  const activateSupplier = async(supplier) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/unignore-supplier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ supplierId: supplier.id }),
    });
    if (response.ok) {
      toast.success("Supplier activated successfully!");
      fetchIgnoredSuppliers()
    }
    else {
      const errorData = await response.json();
      toast.error(errorData.message);
  }
    // Logic to activate the supplier
  }

  return (
    <div className="px-4 pb-6 lg:pb-10 md:pb-10 lg:px-10 md:px-10 sm:px-6">
      <h1 className="pt-6 pb-6 text-2xl font-bold text-center text-red-600">
        All Suppliers
      </h1>

        <div className="flex gap-2 p-4">
      <button
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          !ignored ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => {
          fetchSuppliers()
          setIgnored(false)
        }}
      >
        Active Suppliers
      </button>

      <button
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          ignored ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => {
          fetchIgnoredSuppliers()
          setIgnored(true)
        }}
      >
        Inactive Suppliers
      </button>
    </div>

      <Table>
        <TableCaption>A list of all suppliers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Add Margin</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(ignored ? ignoredSuppliers :currentSuppliers).map((sup ) => {
            const createdAt = new Date(sup.created_at).toLocaleDateString();
            return (
              <TableRow key={sup.id}>
                <TableCell>{sup.name }</TableCell>
                <TableCell>{sup.country }</TableCell>
                <TableCell>{!ignored ? 'Yes' : 'No'}</TableCell>
                <TableCell>{createdAt}</TableCell>
                <TableCell>Add Margin</TableCell>
                <TableCell className="text-right">
                  {!ignored ?<Button
                    className="bg-red-700 hover:bg-red-600 mr-1 my-1"
                    onClick={() => deactivateSupplier(sup)}
                  >
                    Deactivate
                  </Button>:
                  <Button
                    className="bg-green-700 hover:bg-green-600 mr-1 my-1"
                    onClick={() => activateSupplier(sup)}
                  >
                    Activate
                  </Button>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlSuppliers;
