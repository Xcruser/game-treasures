'use client';

import { useState, useCallback, useEffect } from 'react';
import { FaUpload, FaImage, FaTimes, FaCheck } from 'react-icons/fa';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
}

interface UploadedImage {
  url: string;
  name: string;
  uploadedAt: string;
}

export default function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');

  // Lade bereits hochgeladene Bilder
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) throw new Error('Fehler beim Laden der Bilder');
        const data = await response.json();
        setUploadedImages(data.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (isModalOpen) {
      fetchImages();
    }
  }, [isModalOpen]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    // Überprüfe Dateityp
    if (!file.type.startsWith('image/')) {
      setError('Bitte nur Bilddateien hochladen');
      return;
    }

    // Überprüfe Dateigröße (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Die Datei ist zu groß (maximal 5MB)');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload fehlgeschlagen');
      }

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
        // Aktualisiere die Liste der hochgeladenen Bilder
        setUploadedImages(prev => [{
          url: data.url,
          name: file.name,
          uploadedAt: new Date().toISOString()
        }, ...prev]);
        setActiveTab('gallery');
      } else {
        throw new Error('Keine URL vom Server erhalten');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Fehler beim Hochladen des Bildes');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  return (
    <div className="relative">
      {/* Vorschau des aktuellen Bildes */}
      <div className="mb-2 relative">
        {value && (
          <div className="relative group">
            <img
              src={value}
              alt="Selected"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onChange('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bild-Auswahl-Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="w-full px-4 py-2 bg-[#1A2642] text-white rounded-lg hover:bg-[#243154] transition-colors flex items-center justify-center gap-2"
      >
        <FaImage className="w-4 h-4" />
        {value ? 'Bild ändern' : 'Bild auswählen'}
      </button>

      {/* Modal für Bildauswahl */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div 
            className="bg-[#1A2642] rounded-xl shadow-lg w-full max-w-4xl mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Bild auswählen</h3>
              <button
                type="button"
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 rounded-lg">
                {error}
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-700">
              <button
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'gallery'
                    ? 'text-[#0095FF] border-b-2 border-[#0095FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('gallery')}
              >
                Galerie
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'text-[#0095FF] border-b-2 border-[#0095FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                Hochladen
              </button>
            </div>

            {activeTab === 'upload' ? (
              /* Upload-Bereich */
              <div className="mb-6">
                <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-[#0095FF] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="text-center">
                    <FaUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-300">
                      {uploading ? 'Wird hochgeladen...' : 'Klicken zum Hochladen'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Maximale Größe: 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              /* Galerie-Bereich */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                      value === image.url ? 'ring-2 ring-[#0095FF]' : ''
                    }`}
                    onClick={() => {
                      onChange(image.url);
                      handleModalClose();
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      {value === image.url ? (
                        <FaCheck className="text-[#0095FF] w-6 h-6" />
                      ) : (
                        <FaCheck className="text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
