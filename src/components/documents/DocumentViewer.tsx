import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Document } from '../../types/document';

interface DocumentViewerProps {
  document: Document;
  currentPage: number;
  zoom: number;
}

export default function DocumentViewer({
  document,
  currentPage,
  zoom
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!containerRef.current) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Create preview container
        const previewContainer = containerRef.current;
        previewContainer.innerHTML = '';

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

        previewContainer.appendChild(preview);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load document';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [document, currentPage, zoom]);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600 text-center">
            <p className="font-medium">Failed to load document</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
        style={{
          visibility: isLoading ? 'hidden' : 'visible'
        }}
      />
    </div>
  );
}