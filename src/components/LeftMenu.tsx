import { useContext, useEffect, useState } from "react";
import { Board, MainContext } from "../context/Context";

import LeftMenuItem from "./LeftMenuItem";

import { MdOutlineAccessTimeFilled } from "react-icons/md";

const LeftMenu = () => {
  const [allBoards, setAllBoards] = useState<Board[] | null>(null);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { boards, teamBoards } = context;

  useEffect(() => {
    const allBoard = [...boards, ...teamBoards];
    if (allBoard) {
      setAllBoards(allBoard);
    }
  }, [boards, teamBoards]);

  return (
    <div className="min-h-[calc(100vh-3rem)] h-full  bg-gray-100 dark:bg-gray-800 w-60 py-3 px-6 border-opacity-20 border-r border-gray-600">
      <div className="flex items-center self-start">
        <MdOutlineAccessTimeFilled className="mr-2 dark:text-gray-400 text-gray-900 text-sm lg:text-1xl" />
        <p className="dark:text-gray-400 text-gray-900 text-sm lg:text-1xl font-bold ">
          RECENT BOARDS
        </p>
      </div>

      <ul className="p-0 m-0">
        {allBoards &&
          allBoards?.length > 0 &&
          allBoards
            .sort((a, b) => b.lastUsingDate.seconds - a.lastUsingDate.seconds)
            .map((item, index) => <LeftMenuItem item={item} key={index} />)}
      </ul>
    </div>
  );
};

export default LeftMenu;
