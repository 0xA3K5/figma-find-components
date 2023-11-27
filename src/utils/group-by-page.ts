import { IComponentInstance } from '../types';

export default function groupByPage(
  components: Record<string, IComponentInstance[]>,
): Record<string, Record<string, IComponentInstance[]>> {
  const grouped: Record<string, Record<string, IComponentInstance[]>> = {};

  Object.keys(components).forEach((mainCompName) => {
    const groupedByPageName = components[mainCompName].reduce(
      (acc, componentInstance) => {
        const pageName = componentInstance.page.name;
        acc[pageName] = acc[pageName] || [];
        acc[pageName].push(componentInstance);
        return acc;
      },
      {} as Record<string, IComponentInstance[]>,
    );
    grouped[mainCompName] = groupedByPageName;
  });

  return grouped;
}
