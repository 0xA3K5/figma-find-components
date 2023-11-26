import { JSX, h } from 'preact';
import { IconLayerInstance16, IconTarget16 } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { IComponentInstance, SelectNodes } from '../types';

interface Props {
  instances: IComponentInstance[];
  pageName: string
}

export default function InstanceDisplayer({
  instances,
  pageName,
}: Props): JSX.Element {
  const handleSelect = () => {
    emit<SelectNodes>('SELECT_NODES', instances);
  };

  return (
    <button
      type="button"
      className="flex group text-sm justify-between items-center pl-8 pr-4 py-2 border-b"
      onClick={handleSelect}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <IconLayerInstance16 width={32} height={32} />
          <p>{instances[0].name}</p>
        </div>
        <span className="">{`${instances.length} times`}</span>
        <span className="opacity-40">on</span>
        <span className="">{pageName}</span>
      </div>
      <div className="group-hover:opacity-100 opacity-0 flex p-3 rounded-md">
        <IconTarget16 />
      </div>
    </button>
  );
}
