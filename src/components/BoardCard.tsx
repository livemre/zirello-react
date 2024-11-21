import React, { FC, useContext, useRef, useState } from "react";
import { Board, MainContext } from "../context/Context";

import { useNavigate } from "react-router-dom";
import ToggleFav from "./ToggleFav";

type Props = {
  item: Board;
};

const BoardCard: FC<Props> = ({ item }) => {
  const navigate = useNavigate();
  const context = useContext(MainContext);

  const [isCardOver, setIsCardOver] = useState<boolean>(false);
  const [boardIsFav, setBoardIsFav] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  if (!context) {
    throw new Error("No context");
  }

  const {} = context;

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".star-icon")) {
      e.stopPropagation();
      return;
    }
    navigate(`/board/${id}`);
  };

  const handleMouseEnter = () => {
    setIsCardOver(true);
  };

  const handleMouseLeave = () => {
    setIsCardOver(false);
  };

  const handleBoardIsFav = (result: boolean) => {
    setBoardIsFav(result);
  };

  return (
    <div
      ref={divRef}
      // className={` relative h-20 w-40 min-w-40 lg:w-52 lg:min-h-24 lg:min-w-52 lg:h-24  cursor-pointer rounded-md m-1 hover:border border-slate-900 hover:border-slate-100 overflow-hidden`}
      className={`m-1 relative h-20  lg:w-52 lg:min-h-24 lg:min-w-52 lg:h-24  cursor-pointer rounded-md  border border-gray-300 hover:border-gray-800 dark:border-gray-900 dark:hover:border-gray-500 overflow-hidden`}
      onClick={(e) => handleLinkClick(item.id, e)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute brightness-60 inset-0 bg-cover bg-center filter dark:brightness-40"
        style={{
          backgroundImage: `url(${item.bgImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="relative h-full w-full flex flex-col justify-between p-3 z-1">
        <p className="text-white shadow-2xl p-0 drop-shadow-2xl  text-left text-sm lg:text-base dark:text-gray-300 font-bold">
          {item.name.length > 20 ? item.name.slice(0, 15) + `...` : item.name}
        </p>
        {boardIsFav ? (
          <ToggleFav
            boardID={item.id}
            handleBoardIsFav={handleBoardIsFav}
            type="card"
          />
        ) : (
          <div
            className={`transition-all duration-100 ease-in-out transform ${
              isCardOver && !boardIsFav
                ? "translate-x-0 opacity-100"
                : "-translate-x-5 opacity-0"
            }`}
          >
            <ToggleFav
              type="card"
              boardID={item.id}
              handleBoardIsFav={handleBoardIsFav}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardCard;
