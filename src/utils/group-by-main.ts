import { IComponentInstance } from '../types';

export default function groupByMain(
  data: IComponentInstance[],
): Record<string, IComponentInstance[]> {
  console.log('data', data);
  return data.reduce((acc, component) => {
    const mainComponentName = component.mainComponent.name;

    if (!acc[mainComponentName]) {
      acc[mainComponentName] = [];
    }

    acc[mainComponentName].push(component);
    return acc;
  }, {} as Record<string, IComponentInstance[]>);
}
