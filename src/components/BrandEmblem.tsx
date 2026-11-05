import { useEffect, useState, type FC } from 'react';

interface BrandEmblemProps {
  className?: string;
}

/**
 * Displays the approved identity asset once uploaded.
 * Keeps the existing star emblem while the file is not present.
 */
export const BrandEmblem: FC<BrandEmblemProps> = ({ className = '' }) => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    fetch('/assets/branding/museum-emblem.png', { method: 'HEAD', signal: abort.signal })
      .then(response => setAvailable(response.ok && !(response.headers.get('content-type') || '').includes('text/html')))
      .catch(() => setAvailable(false));
    return () => abort.abort();
  }, []);

  return available ? (
    <img
      src="/assets/branding/museum-emblem.png"
      alt=""
      aria-hidden="true"
      className={'brand-emblem-image ' + className}
      onError={() => setAvailable(false)}
    />
  ) : (
    <span className={className} aria-hidden="true">✳</span>
  );
};
