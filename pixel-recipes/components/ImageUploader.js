import { useState } from 'react';

export default function ImageUploader({ label, onFileSelect, previewUrl }) {
  const [localPreview, setLocalPreview] = useState(previewUrl);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Create a local URL just for previewing immediately
        const url = URL.createObjectURL(file);
        setLocalPreview(url);
        // Send the actual file back to the parent component
        onFileSelect(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>

      {/* The Preview Area */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">

          {localPreview ? (
            // If we have a file, show the preview
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
          ) : (
             // Otherwise, show the upload icon/text
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
            </div>
          )}

          {/* The actual hidden file input */}
          <input type="file" className="hidden" onChange={handleChange} accept="image/x-png,image/gif,image/jpeg" />
        </label>
      </div>
    </div>
  );
}