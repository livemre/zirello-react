import { FC } from "react";

type Props = {
  w: string;
  rounded?: boolean;
  h?: string;
};

const NavbarSkeleton: FC<Props> = ({ w, rounded }) => {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-600 h-full relative w-${w}  cursor-pointer overflow-hidden animate-pulse ${
        rounded ? "rounded-full" : "rounded-md "
      }`}
    >
      <div className="absolute inset-0 bg-cover bg-center filter brightness-50 animate-pulse"></div>
      <div className="relative h-full w-full flex flex-col justify-between p-3 z-10"></div>
    </div>
  );
};

export default NavbarSkeleton;
