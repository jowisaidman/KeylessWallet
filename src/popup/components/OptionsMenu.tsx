import React, { FC, useRef } from "react";

const OptionsItem: FC<{ icon: string; label: string; onClick: () => any }> = ({
  icon,
  label,
  onClick,
}) => (
  <li>
    <a onClick={onClick}>
      <i className={`fa fa-${icon}`}></i>
      {label}
    </a>
  </li>
);

export const OptionsMenu: FC<{}> = ({}) => {
  let dropdown = useRef<HTMLDivElement>(null);

  function select(f: () => any) {
    f();
    (document.activeElement as any)?.blur();
  }

  return (
    <div className="dropdown dropdown-end" ref={dropdown}>
      <div tabIndex={0} role="button" className="btn btn-rounded m-1">
        <i className="fa fa-ellipsis-v"></i>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <OptionsItem
          icon="expand"
          label="Open in a tab"
          onClick={() => chrome.tabs.create({ url: "popup.html" })}
        />
      </ul>
    </div>
  );
};

export default OptionsMenu;
