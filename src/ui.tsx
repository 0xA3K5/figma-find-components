// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!./output.css';
import { h } from 'preact';
import { render } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'preact/hooks';
import { on } from '@create-figma-plugin/utilities';
import {
  ETabs,
  IComponent,
  IComponentInstance,
  UpdateLocalMissing,
} from './types';
import TabBar from './components/TabBar';
import Tabs from './tabs';
import Layout from './components/Layout';

function Plugin() {
  const [activeTab, setActiveTab] = useState(ETabs.LOCAL);

  const [localMissingInstances, setLocalMissingInstances] = useState<IComponentInstance[]>([]);
  const [localMainComponents, setLocalMainComponents] = useState<IComponent[]>([]);

  useEffect(() => {
    on<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', (data: { missing: IComponentInstance[], components: IComponent[] }) => {
      setLocalMissingInstances(data.missing);
      setLocalMainComponents(data.components);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 py-8">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === ETabs.LOCAL && (
      <Layout>
        <Tabs.Local localMissing={localMissingInstances} localMain={localMainComponents} />
      </Layout>
      )}
    </div>
  );
}

export default render(Plugin);
