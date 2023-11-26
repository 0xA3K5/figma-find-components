import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  FindComponentsHandler,
  IComponentInstance,
  ResizeWindowHandler,
  SelectNodes,
  UpdateMissingComponents,
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

  on<FindComponentsHandler>('FIND_COMPONENTS', () => {
    figma.skipInvisibleInstanceChildren = true;

    const components = figma.root.findAllWithCriteria({
      types: ['COMPONENT', 'COMPONENT_SET'],
    });
    const instances = figma.root.findAllWithCriteria({ types: ['INSTANCE'] });
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
    emit<UpdateMissingComponents>('UPDATE_MISSING_COMPONENTS', missingArr);
  });

  showUI({
    height: 512,
    width: 512,
  });
}
