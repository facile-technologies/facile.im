import React from 'react';
import { Card } from "@/components/ui/card";

const ProductAnalyticsTable = ({ products = [] }) => {
  return (
    <Card className="rounded-xl border-0 bg-[#FFFFFF] dark:bg-[#3F3F3F] overflow-hidden shadow-lg w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ffffff10]">
              <th className="p-6 text-sm font-medium text-gray-500 dark:text-white">Product</th>
              <th className="p-6 text-sm font-medium text-gray-500 dark:text-white text-right">Views</th>
              <th className="p-6 text-sm font-medium text-gray-500 dark:text-white text-right">Orders</th>
              <th className="p-6 text-sm font-medium text-gray-500 dark:text-white text-right">Conversion</th>
              <th className="p-6 text-sm font-medium text-gray-500 dark:text-white text-right">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-gray-400">
                  No product data available.
                </td>
              </tr>
            ) : products.map((product) => (
              <tr
                key={product.product_id}
                className="group hover:bg-[#ffffff05] transition-colors border-b border-[#ffffff05] last:border-0"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      {product.image_url
                        ? <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-[#4F4F4F]" />}
                    </div>
                    <span className="font-semibold text-black dark:text-white">{product.title}</span>
                  </div>
                </td>
                <td className="p-6 text-right font-medium text-black dark:text-white">{product.views}</td>
                <td className="p-6 text-right font-medium text-black dark:text-white">{product.orders}</td>
                <td className="p-6 text-right font-medium text-black dark:text-white">{product.conversion}</td>
                <td className="p-6 text-right font-medium text-black dark:text-white">
                  ${Number(product.earnings).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProductAnalyticsTable;
