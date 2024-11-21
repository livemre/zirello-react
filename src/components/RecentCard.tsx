import { FC } from "react";
import { Board } from "../context/Context";

type Props = {
  item: Board;
};

const RecentCard: FC<Props> = ({ item }) => {
  return (
    <div className="transition-all duration-200 ease-in-out flex m-1 justify-start items-center hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md p-1 cursor-pointer">
      <img
        src={item.bgImage}
        className="min-w-10 min-h-8  w-10 h-8 rounded-md"
      />
      <div className="ml-1 flex flex-col items-start justify-between">
        <p className="ml-1 m-0 p-0 text-gray-800 dark:text-gray-300 lg:text-base text-left">
          {item.name.length > 25 ? item.name.slice(0, 24) + "..." : item.name}
        </p>
      </div>
    </div>
  );
};

export default RecentCard;
