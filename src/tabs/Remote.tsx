import { h, JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { IconLayerComponent16 } from '@create-figma-plugin/ui';
import {
  TLibrary, GetLibraries, IComponentInstance, IComponent,
} from '../types';
import InstanceDisplayer from '../components/InstanceDisplayer';
import { groupByPage } from '../utils';

interface Props {
  libraries: TLibrary;
  components: Record<string, IComponentInstance[]>
}

export default function Remote({ libraries, components }: Props): JSX.Element {
  useEffect(() => {
    emit<GetLibraries>('GET_LIBRARIES');
  }, []);
  useEffect(() => {
    const libraryMatchedComponents: IComponent[] = [];

    if (!libraries) {
      console.log('no lib');
    }
    if (!components) {
      console.log('no components');
    }
    Object.keys(components).forEach((mainCompId) => {
      Object.values(libraries).forEach((library) => {
        library.components.forEach((comp) => {
          const found = comp.id === mainCompId;
          if (found) {
            libraryMatchedComponents.push(comp);
          }
        });
      });
    });
    console.log('libraryMatchedComponents', libraryMatchedComponents);
  }, [components, libraries]);

  if (!libraries) {
    return <div className="">No Library, go to a library file and scan</div>;
  }

  const grouped = groupByPage(components);

  return (
    <div className="mt-12">
      <div className="">
        {Object.values(libraries).map((library) => (
          <div key={library.name}>
            <span>{library.name}</span>
            <span>{library.components.length}</span>
          </div>
        ))}
      </div>
      {Object.keys(grouped).map((mainCompName) => (
        <div className="flex flex-col items-start" key={mainCompName}>
          <div className="flex text-sm px-4 py-2 gap-2 items-center">
            <IconLayerComponent16 />
            <span>{mainCompName}</span>
          </div>
          {Object.keys(grouped[mainCompName]).map((pageName) => {
            const instances = grouped[mainCompName][pageName];
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
    </div>
  );
}
