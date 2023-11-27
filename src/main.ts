import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  GetLocalMissing,
  IComponent,
  IComponentInstance,
  TLibrary,
  ResizeWindowHandler,
  ScanLibrary,
  SelectNodes,
  UpdateLocalMissing,
  UpdateUserLibraries,
  GetLibraries,
  UpdateRemoteComponents,
  GetRemoteComponents,
  DetachInstances,
  DeleteInstances,
} from './types';

const getPage = (node: BaseNode): PageNode | null => {
  if (node.type === 'PAGE') {
    return node as PageNode;
  }
  if (node.parent) {
    return getPage(node.parent);
  }
  return null;
};
const getUserLibraries = async (): Promise<TLibrary> => {
  const userLibraries: TLibrary = (await figma.clientStorage.getAsync('userLibraries')) || {};
  return userLibraries;
};

const getInstances = (): InstanceNode[] => {
  figma.skipInvisibleInstanceChildren = true;
  return figma.root.findAllWithCriteria({ types: ['INSTANCE'] });
};

const getComponentSets = (): IComponent[] => {
  figma.skipInvisibleInstanceChildren = true;

  const componentSetNodes = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  const componentSets: IComponent[] = [];

  componentSetNodes.forEach((componentSetNode) => {
    componentSets.push({
      id: componentSetNode.id,
      name: componentSetNode.name,
    });
  });
  return componentSets;
};

const getComponents = (): IComponent[] => {
  figma.skipInvisibleInstanceChildren = true;
  const componentNodes = figma.root.findAllWithCriteria({ types: ['COMPONENT'] });

  const components: IComponent[] = [];

  componentNodes.forEach((componentNode) => {
    if (componentNode.parent && componentNode.parent.type === 'COMPONENT_SET') {
      components.push({
        id: componentNode.id,
        name: componentNode.parent.name,
      });
    }
    components.push({
      id: componentNode.id,
      name: componentNode.name,
    });
  });

  return components;
};

export default function () {
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    (windowSize: { width: number; height: number }): void => {
      const { width, height } = windowSize;
      figma.ui.resize(width, height);
    },
  );

  on<SelectNodes>('SELECT_NODES', (component: IComponentInstance[]): void => {
    const nodesArr = component.map((c) => figma.getNodeById(c.id) as SceneNode);

    const page = getPage(nodesArr[0]);
    if (page !== null) {
      figma.currentPage = page;
      figma.currentPage.selection = nodesArr;
      figma.viewport.scrollAndZoomIntoView(nodesArr);
    }
  });

  on<GetLocalMissing>('GET_LOCAL_MISSING', () => {
    const components = [...getComponents(), ...getComponentSets()];

    const instances = getInstances();
    const missingArr: IComponentInstance[] = [];

    instances.forEach((instance: InstanceNode) => {
      const mainComp = components.find((c) => c.id === instance.mainComponent?.id);
      if (!mainComp) {
        if (instance.mainComponent && !instance.mainComponent.remote) {
          const page = getPage(instance);
          if (page) {
            missingArr.push({
              id: instance.id,
              name: instance.name,
              mainComponent: {
                id: instance.mainComponent?.id,
                name: instance.mainComponent?.name,
              },
              page: {
                id: page.id,
                name: page.name,
              },
            });
          }
        }
      }
    });
    figma.notify(`Found: ${missingArr.length} missing components`);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', missingArr);
  });

  on<GetRemoteComponents>('GET_REMOTE', () => {
    const instances = getInstances();

    const remoteInstances: IComponentInstance[] = [];

    instances.forEach((instance) => {
      if (instance.mainComponent && instance.mainComponent.remote) {
        const page = getPage(instance);
        remoteInstances.push({
          id: instance.id,
          name: instance.name,
          page: {
            id: page?.id ?? 'unknown',
            name: page?.name ?? 'unknown',
          },
          mainComponent: {
            id: instance.mainComponent.id,
            name: instance.mainComponent.name,
          },
        });
      }
    });

    const grouped = remoteInstances.reduce((acc, component) => {
      const mainComponentId = component.mainComponent.id;

      if (!acc[mainComponentId]) {
        acc[mainComponentId] = [];
      }
      acc[mainComponentId].push(component);
      return acc;
    }, {} as Record<string, IComponentInstance[]>);

    emit<UpdateRemoteComponents>('UPDATE_REMOTE_COMPONENTS', (grouped));
  });
  on<GetLibraries>('GET_LIBRARIES', async () => {
    const userLibraries = await getUserLibraries();
    emit<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', userLibraries);
  });
  on<DetachInstances>('DETACH_INSTANCES', (instances: IComponentInstance[]) => {
    const nodesArr = instances.map((instance) => figma.getNodeById(instance.id));

    nodesArr.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        node.detachInstance();
      }
    });
  });

  on<DeleteInstances>('DELETE_INSTANCES', (instances: IComponentInstance[]) => {
    const nodesArr = instances.map((instance) => figma.getNodeById(instance.id));

    nodesArr.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        node.remove();
      }
    });
  });

  showUI({
    height: 512,
    width: 512,
  });
}
