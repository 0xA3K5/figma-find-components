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
      className="group flex items-center justify-between border-b py-2 text-sm"
      onClick={handleSelect}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <IconLayerInstance16 width={32} height={32} />
          <p>{instances[0].name}</p>
        </div>
        <span className="opacity-40">{'->'}</span>
        <span className="">{`${instances.length} instances`}</span>
        <span className="opacity-40">on</span>
        <span className="">{pageName}</span>
      </div>
      <div className="flex rounded-md p-3 opacity-0 group-hover:opacity-100">
        <IconTarget16 />
      </div>
    </button>
  );
}
