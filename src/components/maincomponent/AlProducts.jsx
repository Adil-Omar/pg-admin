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
} from "@/components/ui/table"
import { Button } from "../ui/button";
import { toast } from "react-toastify";

const backednUrl = import.meta.env.VITE_BACKEND_URL;

const AlProducts = () => {
  const { fetchProducts, products, allProductLoading, ignoredProductIds } =
    useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [localIgnoredIds, setLocalIgnoredIds] = useState(new Set());
  const [supplierMargins, setSupplierMargins] = useState({});
  const [marginsLoading, setMarginsLoading] = useState(false);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchSupplierMargins();
  }, []);

  // Fetch supplier margins
  const fetchSupplierMargins = async () => {
    setMarginsLoading(true);
    try {
      const response = await fetch(`${backednUrl}/api/product-margin/list-margin/supplier`);
      if (response.ok) {
        const data = await response.json();
        // Convert array to object with supplierId as key for quick lookup
        const marginsObj = {};
        data.data.forEach(item => {
          marginsObj[item.supplierId] = item.margin;
        });
        setSupplierMargins(marginsObj);
      }
    } catch (error) {
      console.error("Error fetching supplier margins:", error);
      toast.error("Failed to fetch supplier margins");
    } finally {
      setMarginsLoading(false);
    }
  };

  // Update local ignored IDs when context changes
  useEffect(() => {
    if (ignoredProductIds) {
      setLocalIgnoredIds(new Set(ignoredProductIds));
    }
  }, [ignoredProductIds]);

  // Calculate price with supplier margin
  const calculatePriceWithMargin = (product) => {
    const priceGroups = product.product?.prices?.price_groups || [];
    const basePrice = priceGroups.find((group) => group?.base_price) || {};
    const priceBreaks = basePrice.base_price?.price_breaks || [];
    const originalPrice = priceBreaks.length > 0 && priceBreaks[0]?.price !== undefined
      ? parseFloat(priceBreaks[0].price)
      : 0;

    const supplierId = product.supplier?.supplier_id;
    const supplierMargin = supplierMargins[supplierId] || 0;
    
    const finalPrice = originalPrice + supplierMargin;
    
    return {
      originalPrice,
      supplierMargin,
      finalPrice
    };
  };

  if (allProductLoading || marginsLoading)
    return (
      <div className='flex items-center justify-center mt-20'>
        <div className='w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin'></div>
        <p className='ml-4 text-lg font-semibold'>Loading Products...</p>
      </div>
    );

  const uniqueSuppliers = [
    ...new Set(
      products?.map((product) => product.supplier?.supplier || "Unknown")
    ),
  ];

  // Filter products based on the selected supplier
  const filteredProducts = selectedSupplier
    ? products.filter(
      (product) => product.supplier?.supplier === selectedSupplier
    )
    : products;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
    setCurrentPage(1);
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.meta.id}`, { state: product });
  };

  const handleActivateProduct = async (product) => {
    console.log("Activate product:", product.meta.id);
    const response = await fetch(`${backednUrl}/api/unignore-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.meta.id }),
    });
    if (response.ok) {
        toast.success("Product activated successfully!");
        // Update local state to reflect the change
        setLocalIgnoredIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(product.meta.id);
            return newSet;
        });
    }
  };

  const handleDeactivateProduct = async (product) => {
    console.log("Deactivate product:", product.meta.id);
    const response = await fetch(`${backednUrl}/api/ignore-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.meta.id }),
    });
    if (response.ok) {
        toast.success("Product deactivated successfully!");
        // Update local state to reflect the change
        setLocalIgnoredIds(prev => {
            const newSet = new Set(prev);
            newSet.add(product.meta.id);
            return newSet;
        });
    }
  };

  return (
    <div className="px-4 pb-6 lg:pb-10 md:pb-10 lg:px-10 md:px-10 sm:px-6">
      <h1 className="pt-6 pb-6 text-2xl font-bold text-center text-red-600">
        All Products
      </h1>

      {/* Supplier Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedSupplier}
          onChange={handleSupplierChange}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Suppliers</option>
          {uniqueSuppliers.map((supplier, index) => (
            <option key={index} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>
      </div>

      {/* table start */}
      <Table>
        <TableCaption>A list of All Products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Supplier Margin</TableHead>
            <TableHead>Final Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product, index) => {
            const priceData = calculatePriceWithMargin(product);
            const isIgnored = localIgnoredIds.has(product.meta.id);
            const supplierName = product.supplier?.supplier || 'Unknown';

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <img
                    src={
                      product.overview.hero_image
                        ? product.overview.hero_image
                        : 'cap.png'
                    }
                    alt=''
                    className='w-8 rounded-full'
                  />
                </TableCell>
                <TableCell>{product.overview.name || 'No Name'}</TableCell>
                <TableCell>{product.overview.code || 'No Code'}</TableCell>
                <TableCell>{supplierName}</TableCell>
                <TableCell className="text-gray-600">
                  ${priceData.originalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-blue-600">
                  {priceData.supplierMargin > 0 ? (
                    `+$${priceData.supplierMargin.toFixed(2)}`
                  ) : (
                    <span className="text-gray-400">No margin</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  ${priceData.finalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {isIgnored ? (
                    <Button
                      className="bg-green-700 hover:bg-green-600 mr-1 my-1"
                      onClick={() => handleActivateProduct(product)}
                    >
                      Activate
                    </Button>
                  ) : (
                    <Button
                      className="bg-red-700 hover:bg-red-600 mr-1 my-1"
                      onClick={() => handleDeactivateProduct(product)}
                    >
                      Deactivate
                    </Button>
                  )}
                  <Button 
                    className="bg-blue-700 hover:bg-blue-600 mr-1 my-1" 
                    onClick={() => handleViewProduct(product)}
                  >
                    View More
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Table end */}

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlProducts;