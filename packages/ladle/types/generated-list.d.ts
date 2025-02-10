import * as React from "react";
import { GlobalState, GlobalAction, Config } from "../lib/shared/types";
import { Args, ArgTypes } from "../lib/app/exports";

type ReactNodeWithoutObject =
  | React.ReactElement
  | string
  | number
  | boolean
  | null
  | undefined;

declare module "virtual:generated-list" {
  /**
   * VGeneratedListType describes the full shape of the generated list.
   * In addition to the core properties, it allows any additional properties
   * with keys matching `${string}args` and `${string}argTypes`.
   */
  export type VGeneratedListType = {
    list: string[];
    config: Config;
    errorMessage: string;
    args: Args;
    argTypes: ArgTypes;
    stories: {
      [key: string]: {
        entry: string;
        locStart: number;
        locEnd: number;
        component: React.FC;
        packageName: string;
        meta: any;
      };
    };
    storySource: { [key: string]: string };
    Provider: React.FC<{
      globalState: GlobalState;
      dispatch: React.Dispatch<GlobalAction>;
      config: Config;
      children: ReactNodeWithoutObject;
      storyMeta?: any;
    }>;
    StorySourceHeader: React.FC<{
      path: string;
      locStart: number;
      locEnd: number;
    }>;
  } & {
    [key in `${string}args`]?: Args;
  } & {
    [key in `${string}argTypes`]?: ArgTypes;
  } & {
    [key in `${string}Provider`]?: React.FC<{
      globalState: GlobalState;
      dispatch: React.Dispatch<GlobalAction>;
      config: Config;
      children: ReactNodeWithoutObject;
      storyMeta?: any;
    }>;
  };

  // Also export individual named properties for convenience.
  export const list: VGeneratedListType["list"];
  export const config: VGeneratedListType["config"];
  export const errorMessage: VGeneratedListType["errorMessage"];
  export const args: VGeneratedListType["args"];
  export const argTypes: VGeneratedListType["argTypes"];
  export const stories: VGeneratedListType["stories"];
  export const storySource: VGeneratedListType["storySource"];
  export const Provider: VGeneratedListType["Provider"];
  export const StorySourceHeader: VGeneratedListType["StorySourceHeader"];
}
