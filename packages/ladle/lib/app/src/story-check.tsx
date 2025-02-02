import * as React from "react";
import type { GlobalState, GlobalAction } from "../../shared/types";
import { ActionType } from "../../shared/types";

type Props = {
  globalState: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
  children?: React.ReactNode;
  stories: string[];
};

const StoryCheck: React.FC<Props> = ({
  globalState,
  dispatch,
  children,
  stories,
}) => {
  React.useEffect(() => {
    if (!stories.includes(globalState.story)) {
      dispatch({ type: ActionType.UpdateStory, value: stories[0] });
    }
  }, [globalState.story, stories]);

  return <>{children}</>;
};

export default StoryCheck;
