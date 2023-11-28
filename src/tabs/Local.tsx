import { h, JSX } from 'preact';
import { Button } from '@create-figma-plugin/ui';
import { useState } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { GetLocalMissing, IComponentInstance } from '../types';
import InstanceDisplayer from '../components/InstanceDisplayer';
import { groupByPage } from '../utils';
import ActionBar from '../components/ActionBar';
import { IconComponent } from '../icons';

interface Props {
  groupedComponents: Record<string, IComponentInstance[]>
}

export default function Local({ groupedComponents }: Props): JSX.Element {
  const [checkedInstances, setCheckedInstances] = useState<{ [key: string]: boolean }>({});

  const grouped = groupByPage(groupedComponents);

  const handleGetLocalMissing = () => {
    emit<GetLocalMissing>('GET_LOCAL_MISSING');
  };

  const isAnyInstanceChecked = Object.values(checkedInstances).some((isChecked) => isChecked);

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-8">
        <h2 className="text-base">No Local Missing</h2>
        <Button onClick={handleGetLocalMissing}>Find Local Missing</Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {Object.keys(grouped).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <IconComponent />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(grouped[mainCompName]).map((pageName) => {
            const instances = grouped[mainCompName][pageName];
            return (
              <InstanceDisplayer
                key={instances[0].id}
                instances={instances}
                pageName={pageName}
                checkedInstances={checkedInstances}
                setCheckedInstances={setCheckedInstances}
                isAnyInstanceChecked={isAnyInstanceChecked}
              />
            );
          })}
        </div>
      ))}
      {isAnyInstanceChecked
      && <ActionBar grouped={grouped} checkedInstances={checkedInstances} />}
    </div>
  );
}
