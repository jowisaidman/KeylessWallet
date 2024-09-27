import React, { useState, FC, cloneElement } from "react";

export interface ITabsProperties {
  children: any;
}

export const Tabs: FC<ITabsProperties> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0]?.props.label);

  const handleClick = (e: any, newActiveTab: any) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="w-[90%] h-full m-3">
      <div role="tablist" className="tabs tabs-boxed">
        {children.map((child: any) => {
          if (activeTab === child.props.label) {
            return (
              <>
                <a
                  role="tab"
                  className="tab tab-active"
                  onClick={(e) => handleClick(e, child.props.label)}
                >
                  <b>{child.props.label}</b>
                </a>
              </>
            );
          } else {
            return (
              <a
                role="tab"
                className="tab"
                onClick={(e) => handleClick(e, child.props.label)}
              >
                {child.props.label}
              </a>
            );
          }
        })}
      </div>
      {children.map((child: any) => {
        if (child.props.label === activeTab) {
          return (
            <div className="bg-base-200 border-base-300 rounded-box p-6 my-2 w-full">
              {child.props.children}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export interface ITabProperties {
  children: any;
  label: string;
}

export const Tab: FC<ITabProperties> = ({ label, children }) => {
  return <></>;
};
