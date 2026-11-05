import { type FC, type MouseEvent } from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onResetView: () => void;
  onReplayIntro: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onResetView,
  onReplayIntro,
}) => {
  const handleHomeClick = (e: MouseEvent) => {
    e.preventDefault();
    onNavigate('solar');
    onResetView();
  };

  return (
    <header className="museum-header">
      <a className="brand" href="#top" id="brand-home" onClick={handleHomeClick}>
        <span className="brand-mark">✳</span>
        <span>
          COSMIC HEROES <small>OF STEEL MUSEUM</small>
        </span>
      </a>

      <nav className="main-nav">
        <button
          className={`nav-link ${currentView === 'solar' || currentView === 'destination' ? 'active' : ''}`}
          data-view="solar"
          onClick={() => {
            onNavigate('solar');
          }}
        >
          Universe
        </button>
        <button
          className={`nav-link ${currentView === 'collection' ? 'active' : ''}`}
          data-view="collection"
          onClick={() => {
            onNavigate('collection');
          }}
        >
          The collection
        </button>
      </nav>

      <button className="header-enter" id="replay-intro" onClick={onReplayIntro}>
        Museum entrance ↗
      </button>
    </header>
  );
};
