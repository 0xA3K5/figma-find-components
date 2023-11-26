/* eslint-disable no-unused-vars */
import { EventHandler } from '@create-figma-plugin/utilities';

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}

export interface IComponent {
  id: string;
  name: string;
}

export interface IComponentInstance extends IComponent {
  mainComponent: IComponent;
  page: {
    id: string,
    name: string;
  }
}
export interface FindComponentsHandler extends EventHandler {
  name: 'FIND_COMPONENTS';
  handler: () => void;
}
export interface UpdateMissingComponents extends EventHandler {
  name: 'UPDATE_MISSING_COMPONENTS';
  handle: (missingComponents: IComponentInstance[]) => void;
}

export interface SelectNodes extends EventHandler {
  name: 'SELECT_NODES';
  handler: (components: IComponentInstance[]) => void;
}
