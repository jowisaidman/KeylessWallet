import React, { FC, useEffect, useState, useRef } from "react";
import { Network, networks } from "../networks";
import { changeNetwork } from "../navigation";

const NetworkItem: FC<{ icon: string; label: string; onClick: () => any }> = ({
  icon,
  label,
  onClick,
}) => (
  <li>
    <a onClick={onClick}>
      <img src={icon} width="32px"></img>
      {label}
    </a>
  </li>
);

export const NetworkSelector: FC<{
  selectedChain: string;
  changeNetwork: (n: Network) => any;
}> = ({ selectedChain }) => {
  let [currentChain, setCurrentChain] = useState<Network>(networks[1]);
  let dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = networks.find((n: Network) => n.value === selectedChain);
    setCurrentChain(selected!);
  }, [selectedChain]);

  function select(n: Network) {
    changeNetwork(n);
    (document.activeElement as any)?.blur();
  }

  return (
    <div className="dropdown" ref={dropdown}>
      <div tabIndex={0} role="button" className="btn btn-rounded m-1">
        <img src={currentChain.icon} width="32px"></img>
        <label className="text-bold">{currentChain.label}</label>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {networks.map((n: Network) => (
          <NetworkItem
            icon={n.icon != null ? n.icon : "generic_chain.svg"}
            label={n.label}
            onClick={() => select(n)}
          />
        ))}
      </ul>
    </div>
  );
};

export default NetworkSelector;
