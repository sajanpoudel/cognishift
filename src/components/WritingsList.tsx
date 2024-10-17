'use client';

import { useState } from 'react';

interface Writing {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

const MOCK_WRITINGS: Writing[] = [
  { id: '1', title: 'College Essay Draft', category: 'Essay', createdAt: '2023-03-15' },
  { id: '2', title: 'Blog Post: AI in Education', category: 'Blog', createdAt: '2023-03-14' },
  { id: '3', title: 'Product Advertisement', category: 'Marketing', createdAt: '2023-03-13' },
];

export default function WritingsList() {
  const [writings] = useState<Writing[]>(MOCK_WRITINGS);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Writings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {writings.map((writing) => (
          <div key={writing.id} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">{writing.title}</h3>
            <p className="text-sm text-gray-500">Category: {writing.category}</p>
            <p className="text-sm text-gray-500">Created: {writing.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
