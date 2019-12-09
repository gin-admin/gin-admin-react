import React from 'react';

export interface MenuAction {
  code?: string;
  name?: string;
}

export interface MenuResource {
  code?: string;
  name?: string;
  method?: string;
  path?: string;
}

export interface MenuParam {
  record_id?: string;
  name?: string;
  sequence?: number;
  icon?: string;
  router?: string;
  hidden?: number;
  parent_id?: string;
  parent_path?: string;
  creator?: string;
  created_at?: string;
  actions?: MenuAction[];
  resources?: MenuResource[];
}

export interface GlobalItem {
  menuPaths?: { [key: string]: MenuParam };
}

export const GlobalContext = React.createContext<GlobalItem>({});
