import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  GetLocalMissing,
  IComponent,
  IComponentInstance,
  TLibrary,
  ResizeWindowHandler,
  SelectNodes,
  UpdateLocalMissing,
  UpdateUserLibraries,
  GetLibraries,
  UpdateRemoteComponents,
  GetRemoteComponents,
  DetachInstances,
  DeleteInstances,
  ReplaceInstances,
} from './types';

const getPage = (node: BaseNode): PageNode | null => {
  if (node.type === 'PAGE') {
    return node;
  }
  if (node.parent) {
    return getPage(node.parent);
  }
  return null;
};

const nodeDelete = (node: InstanceNode) => {
  try {
    node.remove();
  } catch (err) {
    const detachedFrame = node.detachInstance();
    detachedFrame.remove();
  }
};

let localMissingData: {
  missingInstances: IComponentInstance[], components: IComponent[]
} = { missingInstances: [], components: [] };

const updateLocalMissingData = (updatedInstances: IComponentInstance[]) => {
  localMissingData.missingInstances = localMissingData.missingInstances
    .filter((instance) => !updatedInstances
      .some((updatedInstance) => updatedInstance.id === instance.id));
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

const figmaSelectNodes = (nodes: (BaseNode | null)[]) => {
  const sceneNodes = nodes
    .flatMap((node) => (node || []))
    .flatMap((node) => ((node.type !== 'DOCUMENT' && node.type !== 'PAGE') ? node : []));

  if (sceneNodes.length === 0) {
    figma.notify('This instance was deleted');
  } else {
    const page = getPage(sceneNodes[0]);
    if (page !== null) {
      figma.currentPage = page;
      figma.currentPage.selection = sceneNodes;
      figma.viewport.scrollAndZoomIntoView(sceneNodes);
    }
  }
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

    figmaSelectNodes(nodesArr);
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
    localMissingData = {
      missingInstances: missingArr,
      components,
    };

    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', { missing: localMissingData.missingInstances, components: localMissingData.components });
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
    const instanceNodes = instances.map((instance) => figma.getNodeById(instance.id) as SceneNode);
    const detachedFrames: FrameNode[] = [];
    instanceNodes.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        detachedFrames.push(node.detachInstance());
      }
    });
    figma.notify(`🔗 Detached: ${instanceNodes.length} instances`);
    figmaSelectNodes(detachedFrames);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', { missing: localMissingData.missingInstances, components: localMissingData.components });
  });

  on<DeleteInstances>('DELETE_INSTANCES', (instances: IComponentInstance[]) => {
    const instanceNodes = instances.map((instance) => figma.getNodeById(instance.id));

    instanceNodes.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        nodeDelete(node);
      }
    });
    figma.notify(`🗑️ Deleted: ${instanceNodes.length} instances`);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', { missing: localMissingData.missingInstances, components: localMissingData.components });
  });

  on<ReplaceInstances>('REPLACE_INSTANCES', ({ instances, replaceWith }) => {
    const instanceNodes = instances.map((instance) => figma.getNodeById(instance.id));
    const componentNode = figma.getNodeById(replaceWith.id);

    if (componentNode && componentNode.type === 'COMPONENT') {
      instanceNodes.forEach((instanceNode) => {
        if (instanceNode && instanceNode.type === 'INSTANCE') {
          // eslint-disable-next-line no-param-reassign
          instanceNode.mainComponent = componentNode;
        }
      });
    }

    figma.notify(`Replaced: ${instanceNodes.length} instances with ${componentNode?.name}`);
    figmaSelectNodes(instanceNodes);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', { missing: localMissingData.missingInstances, components: localMissingData.components });
  });

  showUI({
    height: 512,
    width: 512,
  });
}
