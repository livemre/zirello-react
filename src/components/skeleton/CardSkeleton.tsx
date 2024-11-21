import { FC } from "react";

type Props = {
  h?: string;
  w?: string;
  rounded?: string;
};

const CardSkeleton: FC<Props> = ({ h, w, rounded }) => {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-600 
        ${h ? `h-${h}` : "h-20 "} 
        ${w ? `w-${w}` : "w-full"}
        ${rounded ? `rounded-${rounded}` : "rounded-md"}
             overflow-hidden animate-pulse`}
    ></div>
  );
};

export default CardSkeleton;
