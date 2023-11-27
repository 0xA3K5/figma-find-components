import { h, JSX } from 'preact';
import { IconLayerComponent16 } from '@create-figma-plugin/ui';
import { useState } from 'preact/hooks';
import { IComponentInstance } from '../types';
import InstanceDisplayer from '../components/InstanceDisplayer';
import { groupByPage } from '../utils';
import ActionBar from '../components/ActionBar';
import Checkbox from '../components/Checkbox';

interface Props {
  groupedComponents: Record<string, IComponentInstance[]>
}

export default function Local({ groupedComponents }: Props): JSX.Element {
  const [checkedInstances, setCheckedInstances] = useState<{ [key: string]: boolean }>({});

  const grouped = groupByPage(groupedComponents);

  const handleCheckboxChange = (instanceId: string, checked: boolean) => {
    setCheckedInstances((prevState: { [key: string]: boolean }) => ({
      ...prevState,
      [instanceId]: checked,
    }));
  };

  const isAnyInstanceChecked = Object.values(checkedInstances).some((isChecked) => isChecked);

  return (
    <div>
      {Object.keys(grouped).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex text-sm px-4 py-2 gap-2 items-center">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(grouped[mainCompName]).map((pageName) => {
            const instances = grouped[mainCompName][pageName];
            return (
              <div key={instances[0].id} className="flex group pl-4 gap-4 items-center">
                <Checkbox
                  value={checkedInstances[instances[0].id] || false}
                  onChange={
                    (event) => handleCheckboxChange(instances[0].id, event.currentTarget.checked)
                  }
                  className={`${isAnyInstanceChecked ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'}`}
                />
                <InstanceDisplayer
                  instances={instances}
                  pageName={pageName}
                />
              </div>
            );
          })}
        </div>
      ))}
      {isAnyInstanceChecked
      && <ActionBar grouped={grouped} checkedInstances={checkedInstances} />}
    </div>
  );
}
