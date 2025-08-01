import React, { useEffect, useState } from "react";
// import { ProductsApi } from "../apis/UserApi";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const Products = () => {
  const { id } = useParams();

  const { orders } = useContext(AdminContext)

  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchsinglecheckout = () => {
    orders.forEach(order => {
      if (order._id === id) {
        setCheckout(order)
        setLoading(false)
      }
    });
  }

  useEffect(() => {
    fetchsinglecheckout();
    // console.log(checkout, 'jkjkkjjjlj')
  }, [id, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-semibold">Loading checkout data...</p>
      </div>
    );
  }

  if (!checkout) {
    return <div>No checkout data available.</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='mb-8 text-2xl font-bold text-center'>Checkout Details</h1>
      {/* {checkoutData.map((checkout, index) => ( */}
      <div className='p-4 mb-8 border border-gray-300 rounded'>
        <div className='flex flex-wrap items-start justify-start gap-10 lg:justify-evenly md:justify-evenly '>
          <div>
            <h2 className='mb-4 text-xl font-bold'>Billing</h2>
            <p className='pb-1.5'>
              <strong>Name:</strong> {checkout.user?.firstName}{' '}
              {checkout.user?.lastName || ''}
            </p>
            <p className='pb-1.5'>
              <strong>Address: </strong> {checkout.billingAddress?.addressLine}
            </p>
            <p className='pb-1.5'>
              <strong>Country:</strong> {checkout.billingAddress?.country}
            </p>
            <p className='pb-1.5'>
              <strong>State:</strong> {checkout.billingAddress?.state}
            </p>
            <p className='pb-1.5'>
              <strong>City:</strong> {checkout.billingAddress?.city}
            </p>
            <p className='pb-1.5'>
              <strong>Postal Code:</strong> {checkout.billingAddress?.postalCode}
            </p>
            <p className=' flex items-center gap-1.5'>
              <strong>Email:</strong>{' '}
              <span className='font-medium text-blue-500 underline cursor-pointer'>
                {checkout.user?.email}
              </span>
            </p>
            <p className='flex mt-1.5 items-center gap-1.5'>
              <strong>Phone:</strong>{' '}
              <p className='font-semibold text-gray-600'>
                {checkout.user?.phone}
              </p>
            </p>
            <p className='pb-1.5'>
              <strong>Company: </strong>{' '}
              {checkout.billingAddress?.companyName || 'No Name'}
            </p>
          </div>

          <div>
            <h2 className='mb-4 text-xl font-bold'>Shipping</h2>
            <p className='pb-1.5'>
              <strong>Name:</strong> {checkout.shippingAddress?.firstName}{' '}
              {checkout.shippingAddress?.lastName || ''}
            </p>
            <p className='pb-1.5'>
              <strong>Country:</strong> {checkout.shippingAddress?.country}
            </p>
            <p className='pb-1.5'>
              <strong>State:</strong> {checkout.shippingAddress?.state}
            </p>
            <p className='pb-1.5'>
              <strong>City:</strong> {checkout.shippingAddress?.city}
            </p>
            <p className='pb-1.5'>
              <strong>Postal Code:</strong> {checkout.shippingAddress?.postalCode}
            </p>
            <p className='pb-1.5'>
              <strong>Address: </strong> {checkout.shippingAddress?.addressLine}
            </p>
            <p className='pb-1.5'>
              <strong>Company: </strong>{' '}
              {checkout.shippingAddress?.companyName || 'No Name'}
            </p>
            <p className=' flex items-center gap-1.5'>
              <strong>Email:</strong>{' '}
              <p className='font-medium text-blue-500 underline cursor-pointer'>
                {checkout.shippingAddress?.email}
              </p>
            </p>
            <p className='flex mt-1.5 items-center gap-1.5'>
              <strong>Phone:</strong>{' '}
              <p className='font-semibold text-gray-600'>
                {checkout.shippingAddress?.phone}
              </p>
            </p>
          </div>
        </div>

        <h2 className='mt-6 mb-4 text-xl font-bold'>Products</h2>
        {checkout.products?.map((product, productIndex) => (
          <div
            key={productIndex}
            className='flex flex-wrap items-center justify-between p-4 mb-4 border border-gray-300 rounded shadow ga-12'
          >
            <div className=''>
              <div className='flex items-center gap-4'>
                <strong>Image:</strong>{' '}
                <img src={product.image} alt='' className='w-14' />
              </div>
              <div className='flex flex-wrap items-center gap-2 '>
                <strong>Name:</strong>
                <p className='pt-1 text-sm font-medium text-gray-600'>
                  {' '}
                  {product.name}
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2 '>
                <strong>Color:</strong>
                <p className='pt-1 text-sm font-medium text-gray-600'>
                  {' '}
                  {product.color}
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2 '>
                <strong>Print:</strong>
                <p className='pt-1 text-sm font-medium text-gray-600'>
                  {' '}
                  {product.print}
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2 '>
                <strong>Logo Color:</strong>
                <p className='pt-1 text-sm font-medium text-gray-600'>
                  {' '}
                  {product?.logoColor}
                </p>
              </div>
              <div className='flex items-start gap-4 mt-2'>
                <strong>Logo:</strong>{' '}
                {product.logo ? <img src={product.logo} alt='' className='w-14' />
                  :
                  <p>No Logo Image Uploaded</p>
                }
              </div>
            </div>
            <div className=''>
              <div className='flex justify-center gap-4'>
                <p className='text-gray-500'>Cost</p>
                <p className='text-gray-500'>Qty</p>
                <p className='text-gray-500'>Total</p>
              </div>
              <div className='flex items-center gap-6 mt-4'>
                <p>${product.price.toFixed(2)}</p>
                <p>{product.quantity || 0}</p>
                <p>${product.subTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
        <div className='mt-10'>
          <p className='pb-1.5 flex items-center gap-4 justify-end'>
            <strong>Shipping: </strong> <p>${checkout.shipping}</p>
          </p>
          <p className='pb-1.5 flex items-center gap-4 justify-end'>
            <strong>Discont: </strong> <p>{checkout.discount}%</p>
          </p>
          {/* <p className='pb-1.5 flex items-center gap-4 justify-end'>
            <strong>Tax: </strong> <p>{checkout.tax}</p>
          </p> */}
          <p className='pb-1.5 flex items-center gap-4 justify-end'>
            <strong>GST(10%): </strong> <p>${checkout.gst}</p>
          </p>
          <p className='pb-1.5 flex items-center gap-2 justify-end'>
            <strong>Order Total: </strong>${checkout.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
