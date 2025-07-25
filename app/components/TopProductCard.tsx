'use client';

import { Star } from 'lucide-react';

type Product = {
  productName: string;
  reviewScore: number;
  unitsSold: number;
  price: string;
};

const topProducts: Product[] = [
  { productName: 'Engine', reviewScore: 4.7, unitsSold: 1200, price: '$1,200' },
  { productName: 'Transmission', reviewScore: 4.7, unitsSold: 3600, price: '$2,800' },
  { productName: 'Axle Assembly', reviewScore: 4.7, unitsSold: 180000, price: '$4,300' },
  { productName: 'Headlight', reviewScore: 4.7, unitsSold: 1200, price: '$450' },
  { productName: 'Transfer Case', reviewScore: 4.7, unitsSold: 3600, price: '$2,100' },
  { productName: 'Tail Light', reviewScore: 4.7, unitsSold: 1200, price: '$380' },
];

export default function TopProducts() {
  return (
    <div className="w-full bg-secondary rounded-xl px-4 py-6 lg:px-4 lg:py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Top Products</h2>
        <button className="text-white bg-white/10 hover:bg-white/20 p-1 rounded-full">
          <span className="sr-only">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="min-w-[700px]">
        <table className="w-full text-sm text-white table-auto">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Review</th>
              <th className="py-3 px-4 font-medium">Sold</th>
              <th className="py-3 px-4 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition">
                <td className="py-3 ">{product.productName}</td>
                <td className="py-3  flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-white">{product.reviewScore.toFixed(1)}</span>
                </td>
                <td className="py-3 ">{product.unitsSold.toLocaleString()}</td>
                <td className="py-3 ">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
