import { h, JSX } from 'preact';
import { Button } from '@create-figma-plugin/ui';
import { useState } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { GetLocalMissing, IComponent, IComponentInstance } from '../types';
import InstanceDisplayer from '../components/InstanceDisplayer';
import { groupByPage, groupByMain } from '../utils';
import ActionBar from '../components/ActionBar';
import { IconComponent } from '../icons';

interface Props {
  localMissing: IComponentInstance[]
  localMain: IComponent[]
}

export default function Local({ localMissing, localMain }: Props): JSX.Element {
  const [checkedInstanceIds, setCheckedInstanceIds] = useState<{ [key: string]: boolean }>({});
  const groupedLocalMissing = groupByPage(groupByMain(localMissing));

  const handleGetLocalMissing = () => {
    emit<GetLocalMissing>('GET_LOCAL_MISSING');
  };

  const isAnyInstanceChecked = Object.values(checkedInstanceIds).some((isChecked) => isChecked);

  if (localMissing.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-8">
        <h2 className="text-base">No Local Missing</h2>
        <Button onClick={handleGetLocalMissing}>Find Local Missing</Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {Object.keys(groupedLocalMissing).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <IconComponent />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(groupedLocalMissing[mainCompName]).map((pageName) => {
            const instances = groupedLocalMissing[mainCompName][pageName];
            return (
              <InstanceDisplayer
                key={instances[0].id}
                instances={instances}
                pageName={pageName}
                checkedInstanceIds={checkedInstanceIds}
                setCheckedInstanceIds={setCheckedInstanceIds}
                isAnyInstanceChecked={isAnyInstanceChecked}
              />
            );
          })}
        </div>
      ))}

      {isAnyInstanceChecked
      && (
      <ActionBar
        data={groupedLocalMissing}
        dropdownOptions={localMain}
        checkedInstanceIds={checkedInstanceIds}
      />
      )}
    </div>
  );
}
