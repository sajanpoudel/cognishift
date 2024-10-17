'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    // Implement file upload logic here
    console.log('Uploading file:', file.name);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Upload Document</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
        </label>
      </div>
      {file && (
        <div className="flex justify-between items-center">
          <span>{file.name}</span>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
