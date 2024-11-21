import React, { FC, useContext, useEffect } from "react";
import { Board, MainContext } from "../context/Context";

import { useNavigate } from "react-router-dom";

type Props = {
  item: Board;
};

const LeftMenuItem: FC<Props> = ({ item }) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { boards } = context;

  const navigate = useNavigate();

  useEffect(() => {}, [boards]);

  const handleNavigate = (e: React.MouseEvent) => {
    if ((e.target as HTMLLIElement).closest("#star-icon")) {
      e.stopPropagation();
      return;
    }
    navigate(`/board/${item.id}`);
  };

  return (
    <li
      onClick={(e: React.MouseEvent) => handleNavigate(e)}
      className=" transition-all duration-200 ease-in-out flex items-center justify-between py-3 dark:hover:bg-gray-700 hover:bg-gray-300 cursor-pointer"
    >
      <div className="flex items-center">
        <img src={item.bgImage} className="w-9 h-6 mr-2" />
        <p className="dark:text-gray-300 text-gray-800 text-left">
          {item.name.length > 13 ? item.name.slice(0, 13) + "..." : item.name}
        </p>
      </div>
    </li>
  );
};

export default LeftMenuItem;
