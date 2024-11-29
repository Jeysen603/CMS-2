import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface DownloadProgressProps {
  loaded: number;
  total: number;
}

export default function DownloadProgress({ loaded, total }: DownloadProgressProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setPercentage(Math.round((loaded / total) * 100));
  }, [loaded, total]);

  return (
    <div className="flex items-center space-x-2">
      <Download className="h-4 w-4 text-indigo-600 animate-bounce" />
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{percentage}%</span>
    </div>
  );
}