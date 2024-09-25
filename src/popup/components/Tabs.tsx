//https://www.devwares.com/blog/how-to-create-react-tabs-with-tailwind-css/
import React, { useState, FC } from "react";

export interface ITabsProperties {
  children: any;
}

export const Tabs: FC<ITabsProperties> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0]?.props.label);

  const handleClick = (e: any, newActiveTab: any) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  // <div className="max-w-md mx-auto">
  return (
    <div className="w-screen px-5">
      <div className="flex border-b border-gray-300">
        {children.map((child: any) => (
          <button
            key={child.props.label}
            className={`${
              activeTab === child.props.label
                ? "border-b-2 border-cyan-400 text-cyan-400 font-bold"
                : ""
            } flex-1 py-2`}
            onClick={(e) => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {children.map((child: any) => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export interface ITabProperties {
  children: any;
  label?: string;
}

export const Tab: FC<ITabProperties> = ({ label, children }) => {
  return (
    <div data-label={label} className="hidden">
      {children}
    </div>
  );
};
