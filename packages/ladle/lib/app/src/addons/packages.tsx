import * as React from "react";
import queryString from "query-string";
import { useHotkeys } from "react-hotkeys-hook";
import config from "../get-config";
import { Modal } from "../ui";
import {
  ActionType,
  PackagesState,
  type AddonProps,
} from "../../../shared/types";

export const getQuery = (locationSearch: string, state?: PackagesState) => {
  const pkg = queryString.parse(locationSearch).package as string;

  if (state?.options.includes(pkg)) {
    return pkg;
  }

  return state?.options?.[0] || "";
};

export const Button = ({ globalState, dispatch }: AddonProps) => {
  const [showPackages, setShowPackages] = React.useState(false);
  const text = "Show packages";
  const openPackages = () => {
    setShowPackages(!showPackages);
  };

  const handlePackage = (pName: string) => {
    dispatch({ type: ActionType.UpdatePackage, value: pName });
    setShowPackages(false);
  };

  useHotkeys(
    config.hotkeys.packages,
    () => (showPackages ? setShowPackages(false) : setShowPackages(true)),
    {
      enabled: !!globalState.package && config.addons.packages.enabled,
    },
  );

  return (
    <li>
      <button
        aria-label={text}
        data-testid="addon-packages"
        title={text}
        onClick={openPackages}
        className={showPackages ? "packages-active" : ""}
        type="button"
      >
        <Preview />
        <span className="ladle-addon-tooltip">{text}</span>
        <label>Packages</label>
        <Modal
          isOpen={showPackages}
          close={() => setShowPackages(false)}
          label="Dialog to select the package"
        >
          <div className="ladle-packages-list">
            {config.addons.packages?.state?.options?.map((pName) => (
              <button
                key={pName}
                onClick={() => handlePackage(pName)}
                className={
                  globalState.package === pName ? "ladle-packages-active" : ""
                }
              >
                {pName}
              </button>
            ))}
          </div>
        </Modal>
      </button>
    </li>
  );
};

export const Preview = () => {
  const size = 16;
  const color = "currentColor";
  const stroke = 1;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      data-view-component="true"
      strokeWidth={stroke}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z"></path>
    </svg>
  );
};
