import { useState, useCallback } from 'react';
import type { Document } from '../types/document';

interface RenderOptions {
  container: HTMLElement;
  document: Document;
  page: number;
  zoom: number;
}

export const useDocumentRenderer = () => {
  const [error, setError] = useState<string | null>(null);

  const renderDocument = useCallback(async ({
    container,
    document,
    page,
    zoom
  }: RenderOptions) => {
    try {
      setError(null);
      container.innerHTML = '';

      // Create preview container
      const wrapper = document.createElement('div');
      wrapper.className = 'flex items-center justify-center h-full';

      // For demo purposes, show a preview card
      const preview = document.createElement('div');
      preview.className = 'max-w-sm bg-white rounded-lg shadow-lg p-6 text-center';
      preview.innerHTML = `
        <div class="text-4xl mb-4">📄</div>
        <h3 class="text-lg font-medium mb-2">${document.title}</h3>
        <p class="text-sm text-gray-500">${document.fileType}</p>
        <p class="text-sm text-gray-500 mt-2">
          Size: ${(document.size / 1024).toFixed(2)} KB
        </p>
      `;

      wrapper.appendChild(preview);
      container.appendChild(wrapper);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to render document';
      setError(message);
    }
  }, []);

  return {
    renderDocument,
    error
  };
};