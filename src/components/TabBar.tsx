import { h, JSX } from 'preact';
import { StateUpdater } from 'preact/hooks';
import { ETabs } from '../types';

interface TabBarProps {
  activeTab: ETabs;
  setActiveTab: StateUpdater<ETabs>;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps): JSX.Element {
  return (
    <div
      className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-3"
      style={{
        borderBottom: '1px solid var(--figma-color-border)',
        backgroundColor: 'var(--figma-color-bg)',
      }}
    >
      <div className="flex items-center gap-4">
        {Object.values(ETabs).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
