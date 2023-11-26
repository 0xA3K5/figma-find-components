// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!./output.css';
import { h } from 'preact';
import { Button, IconLayerComponent16, render } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'preact/hooks';
import { on, emit } from '@create-figma-plugin/utilities';
import { FindComponentsHandler, IComponentInstance, UpdateMissingComponents } from './types';
import InstanceDisplayer from './components/InstanceDisplayer';

function Plugin() {
  const [groupedComponents, setGroupedComponents] = useState<Record<
  string, IComponentInstance[]>>({});

  const handleFindComponents = () => {
    emit<FindComponentsHandler>('FIND_COMPONENTS');
  };

  useEffect(() => {
    on<UpdateMissingComponents>('UPDATE_MISSING_COMPONENTS', (data: IComponentInstance[]) => {
      const grouped = data.reduce((acc, component) => {
        const mainComponentName = component.mainComponent.name;

        if (!acc[mainComponentName]) {
          acc[mainComponentName] = [];
        }

        acc[mainComponentName].push(component);
        return acc;
      }, {} as Record<string, IComponentInstance[]>);
      setGroupedComponents(grouped);
    });
  }, []);

  const groupedByMainComponent: Record<string, Record<string, IComponentInstance[]>> = {};
  Object.keys(groupedComponents).forEach((mainCompName) => {
    const groupedByPageName = groupedComponents[mainCompName].reduce((acc, componentInstance) => {
      const pageName = componentInstance.page.name;
      acc[pageName] = acc[pageName] || [];
      acc[pageName].push(componentInstance);
      return acc;
    }, {} as Record<string, IComponentInstance[]>);
    groupedByMainComponent[mainCompName] = groupedByPageName;
  });

  return (
    <div className="flex flex-col gap-4 py-8">
      {Object.keys(groupedByMainComponent).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex text-sm px-4 py-2 gap-2 items-center">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(groupedByMainComponent[mainCompName]).map((pageName) => {
            const instances = groupedByMainComponent[mainCompName][pageName];
            return (
              <InstanceDisplayer
                key={instances[0].id}
                instances={instances}
                pageName={pageName}
              />
            );
          })}
        </div>
      ))}

      <div className="flext fixed bottom-0 w-full gap-8">
        <Button onClick={handleFindComponents}>Find components</Button>
      </div>
    </div>
  );
}

export default render(Plugin);
