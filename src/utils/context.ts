import React from 'react';

let GlobalContext: React.Context<any>;

export default function GetGlobalContext() {
  if (!GlobalContext) {
    GlobalContext = React.createContext({});
  }
  return GlobalContext;
}
