/* eslint-disable no-unused-vars */
import { EventHandler } from '@create-figma-plugin/utilities';

export enum ETabs {
  LOCAL = 'Local Missing',
  REMOTE = 'Remote Missing',
}
export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}
export interface IComponent {
  id: string;
  name: string;
  isRemote?: boolean
}

export interface IComponentInstance extends IComponent {
  mainComponent: IComponent;
  page: {
    id: string,
    name: string;
  }
}

export type TLibrary = Record<string, { name: string; components: IComponent[]; }>;

export interface GetRemoteComponents extends EventHandler {
  name: 'GET_REMOTE';
  handler: () => void;
}
export interface UpdateRemoteComponents extends EventHandler {
  name: 'UPDATE_REMOTE_COMPONENTS';
  handle: (remoteComponents: Record<string, IComponentInstance[]>) => void;
}

export interface GetLocalMissing extends EventHandler {
  name: 'GET_LOCAL_MISSING';
  handler: () => void;
}
export interface UpdateLocalMissing extends EventHandler {
  name: 'UPDATE_LOCAL_MISSING';
  handle: (local: { missing: IComponentInstance[], components: IComponent[] }) => void;
}

export interface SelectNodes extends EventHandler {
  name: 'SELECT_NODES';
  handler: (components: IComponentInstance[]) => void;
}

export interface ScanLibrary extends EventHandler {
  name: 'SCAN_LIBRARY';
  handler: () => void;
}

export interface GetLibraries extends EventHandler {
  name: 'GET_LIBRARIES';
  handler: () => void;
}

export interface UpdateUserLibraries extends EventHandler {
  name: 'UPDATE_USER_LIBRARIES';
  handler: (data: TLibrary) => void;
}

export interface DetachInstances extends EventHandler {
  name: 'DETACH_INSTANCES';
  handler: (instances: IComponentInstance[]) => void
}
export interface DeleteInstances extends EventHandler {
  name: 'DELETE_INSTANCES';
  handler: (instances: IComponentInstance[]) => void
}

export interface ReplaceInstances extends EventHandler {
  name: 'REPLACE_INSTANCES';
  handler: (data: { instances: IComponentInstance[], replaceWith: IComponent }) => void
}
