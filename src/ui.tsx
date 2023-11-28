// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!./output.css';
import { h } from 'preact';
import { Button, render } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'preact/hooks';
import { on, emit } from '@create-figma-plugin/utilities';
import {
  ETabs,
  GetLocalMissing,
  GetRemoteComponents,
  IComponent,
  IComponentInstance,
  ScanLibrary,
  TLibrary,
  UpdateLocalMissing,
  UpdateRemoteComponents,
  UpdateUserLibraries,
} from './types';
import TabBar from './components/TabBar';
import Tabs from './tabs';
import Layout from './components/Layout';

function Plugin() {
  const [activeTab, setActiveTab] = useState(ETabs.LOCAL);
  const [groupedComponents, setGroupedComponents] = useState<Record<
  string, IComponentInstance[]>>({});

  const handleFindComponents = () => {
    emit<FindComponentsHandler>('FIND_COMPONENTS');
  const handleGetLocalMissing = () => {
    emit<GetLocalMissing>('GET_LOCAL_MISSING');
  };
  };

  useEffect(() => {
    on<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', (data: IComponentInstance[]) => {
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


  return (
    <div className="flex flex-col gap-4 py-8">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === ETabs.LOCAL && (
      <Layout>
        <Tabs.Local groupedComponents={groupedComponents} />
      </Layout>
      )}
      {activeTab === ETabs.REMOTE && (
      <Layout>
        <Tabs.Remote components={remoteComponents} libraries={userLibraries} />
      </Layout>
      )}

    </div>
  );
}

export default render(Plugin);
