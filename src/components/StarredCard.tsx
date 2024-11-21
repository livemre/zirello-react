import React, { FC, LegacyRef, useContext, useEffect, useState } from "react";
import { Board, MainContext } from "../context/Context";

import { Link } from "react-router-dom";
import ToggleFav from "./ToggleFav";

type Props = {
  item: Board;
  setShowStar: React.Dispatch<React.SetStateAction<boolean>>;
  starDivRef: LegacyRef<HTMLDivElement>;
  setShowMobileStarred: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
};

const StarredCard: FC<Props> = ({
  item,
  setShowStar,
  setShowMobileStarred,
  setShowMore,
}) => {
  const [loading, setLoading] = useState(true);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  useEffect(() => {
    setLoading(false);
    console.log(item.id);
  }, [item]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="transition-all duration-200 ease-in-out flex m-1 items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700  p-1 rounded-md ">
      <Link
        to={`/board/${item.id}`}
        onClick={() => {
          setShowStar(false);
          setShowMobileStarred(false);
          setShowMore(false);
        }}
        key={item.id}
      >
        <div className="flex justify-start items-center rounded-md cursor-pointer">
          <img
            src={item.bgImage}
            className="min-w-10 min-h-8  w-10 h-8 rounded-md"
          />
          <div className="ml-1 flex flex-col items-start justify-between">
            <p className="ml-1 m-0 p-0 text-slate-800 dark:text-gray-300  lg:text-base text-left">
              {item.name.length > 25
                ? item.name.slice(0, 24) + "..."
                : item.name}
            </p>
          </div>
        </div>
      </Link>
      <div className="p-1 cursor-pointer">
        <ToggleFav type="navbar-menu" boardID={item.id} />
      </div>
    </div>
  );
};

export default StarredCard;
