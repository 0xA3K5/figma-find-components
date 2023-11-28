import { h, JSX } from 'preact';
import { emit } from '@create-figma-plugin/utilities';
import { IComponentInstance, DetachInstances, DeleteInstances } from '../types';
import { IconButton } from './button';
import { IconLinkBreak, IconTrash } from '../icons';

interface Props {
  checkedInstances: { [key: string]: boolean };
  data: Record<string, Record<string, IComponentInstance[]>>
}

export default function ActionBar({ checkedInstances, data }: Props): JSX.Element {
  const checkedComponentInstances = Object.keys(data).reduce((acc, mainCompName) => {
    Object.keys(data[mainCompName]).forEach((pageName) => {
      const instances = data[mainCompName][pageName];
      const isAnyInstanceCheckedInGroup = instances
        .some((instance) => checkedInstances[instance.id]);
      if (isAnyInstanceCheckedInGroup) {
        acc.push(...instances);
      }
    });
    return acc;
  }, [] as IComponentInstance[]);

  const handleDetach = () => {
    emit<DetachInstances>('DETACH_INSTANCES', (checkedComponentInstances));
  };
  const handleDelete = () => {
    emit<DeleteInstances>('DELETE_INSTANCES', (checkedComponentInstances));
  };

  return (
    <div
      className="group fixed bottom-4 z-20 flex w-full items-center justify-center"
    >
      <div className="flex w-fit gap-1 rounded-xl border border-black border-opacity-10 bg-black bg-opacity-5 px-3 py-2 dark:border-white dark:border-opacity-10 dark:bg-white dark:bg-opacity-5">
        <IconButton onClick={handleDelete}>
          <IconTrash size={28} />
        </IconButton>
        <IconButton onClick={handleDetach}>
          <IconLinkBreak size={28} />
        </IconButton>
      </div>
    </div>
  );
}
