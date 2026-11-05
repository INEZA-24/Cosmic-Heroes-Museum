import { useEffect, useState, type FC } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  file: string;
  caption: string;
  credit?: string;
  sourceUrl?: string;
}

interface MachineVisualGalleryProps {
  machineId: string;
  machineName: string;
}

function isMediaItem(value: unknown): value is MediaItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (item.type === 'image' || item.type === 'video') &&
    typeof item.file === 'string' &&
    /^[a-zA-Z0-9_.-]+\.(jpg|jpeg|png|webp|mp4|webm)$/.test(item.file) &&
    typeof item.caption === 'string';
}

/** Optional gallery. Edit a machine's gallery.json to add media without touching React code. */
export const MachineVisualGallery: FC<MachineVisualGalleryProps> = ({ machineId, machineName }) => {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const request = new AbortController();
    setItems([]);
    fetch('/assets/exhibits/' + machineId + '/gallery.json', { signal: request.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Gallery unavailable')))
      .then((data: unknown) => {
        if (request.signal.aborted) return;
        const entries = typeof data === 'object' && data !== null && 'items' in data
          ? (data as { items: unknown }).items : [];
        setItems(Array.isArray(entries) ? entries.filter(isMediaItem).slice(0, 12) : []);
      })
      .catch(() => { if (!request.signal.aborted) setItems([]); });
    return () => request.abort();
  }, [machineId]);

  if (items.length === 0) return null;

  return (
    <section className="exhibit-visual-gallery" aria-label={machineName + ' visual archive'}>
      <div className="section-label">
        <p className="eyebrow">MISSION MEDIA ARCHIVE</p>
        <h2>See the mission.</h2>
      </div>
      <div className="visual-gallery-grid">
        {items.map((item, index) => {
          const src = '/assets/exhibits/' + machineId + '/' + item.file;
          return (
            <figure key={item.file + index} className="visual-gallery-item">
              {item.type === 'video' ? (
                <video controls preload="metadata" playsInline aria-label={item.caption}>
                  <source src={src} type={item.file.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
                </video>
              ) : (
                <img src={src} alt={item.caption} loading="lazy" decoding="async" />
              )}
              <figcaption>
                <strong>{item.caption}</strong>
                {item.credit && <span>{item.credit}</span>}
                {item.sourceUrl && /^https:\/\//i.test(item.sourceUrl) &&
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Original source ↗</a>}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
};
