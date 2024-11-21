import { FC } from "react";
import { Board } from "../context/Context";

type Props = {
  item: Board;
};

const TeamsMenuCard: FC<Props> = ({ item }) => {
  return (
    <div className="transition-all duration-200 ease-in-out flex m-1 justify-start items-center hover:bg-slate-200 dark:hover:bg-gray-700  rounded-md p-1 cursor-pointer">
      <img
        src={item.bgImage}
        className="min-w-10 min-h-8  w-10 h-8 rounded-md"
      />
      <div className=" flex flex-col ml-1 text-left">
        {item.name.length > 18 ? (
          <p className="ml-1 text-gray-900 dark:text-gray-300  text-left">
            {item.name.substring(0, 18)} ...
          </p>
        ) : (
          <p className="ml-1 text-gray-900 dark:text-gray-300  text-left">
            {item.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamsMenuCard;
