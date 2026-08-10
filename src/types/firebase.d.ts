/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "firebase/app" {
  export function initializeApp(config: any, name?: string): any;
  export function setLogLevel(level: any): void;
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
}

declare module "@firebase/app" {
  export function initializeApp(config: any, name?: string): any;
  export function setLogLevel(level: any): void;
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
}
