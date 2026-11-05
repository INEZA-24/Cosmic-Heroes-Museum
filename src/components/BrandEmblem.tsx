import { type FC } from 'react';

interface BrandEmblemProps {
  className?: string;
}

/** Approved rover and orbit emblem; transparent white SVG on any museum background. */
export const BrandEmblem: FC<BrandEmblemProps> = ({ className = '' }) => (
  <img
    src="/assets/branding/museum-emblem.svg"
    alt=""
    aria-hidden="true"
    className={'brand-emblem-image ' + className}
    width={640}
    height={510}
    decoding="async"
  />
);
