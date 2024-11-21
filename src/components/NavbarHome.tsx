import { useState } from "react";
import { SlMenu } from "react-icons/sl";
import { Link } from "react-router-dom";
import ZirelloDark from "../assets/zirello-dark.png";
import { CgClose } from "react-icons/cg";

const NavbarHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <div className="h-16 bg-white flex items-center justify-between w-full shadow-2xl fixed z-50 ">
      <div className="flex items-center mx-auto justify-between w-full px-5 lg:p-0 lg:w-full xl:max-w-[1320px]  ">
        <div className="flex">
          <Link to={"/"}>
            <img src={ZirelloDark} className="min-w-32 max-w-32" />
          </Link>
        </div>
        {isMenuOpen ? (
          <CgClose
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-7 h-7 lg:hidden `}
          />
        ) : (
          <SlMenu
            className={`w-7 h-7 lg:hidden `}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        )}

        <div
          className={`absolute top-16 shadow-2xl bg-white w-full left-0 p-3 flex flex-col gap-3 text-[1.2rem] text-left
      transform transition-all duration-300 ease-in-out overflow-hidden origin-top ${
        isMenuOpen
          ? "max-h-[500px] opacity-100 scale-y-100"
          : "max-h-0 opacity-0 scale-y-0"
      }`}
        >
          <div className="border-b "></div>
          <div className="cursor-pointer">Features</div>
          <div className="border-b "></div>
          <div className="cursor-pointer">Solutions</div>
          <div className="border-b "></div>
          <div className="cursor-pointer">Plans</div>
          <div className="border-b "></div>
          <div className="cursor-pointer">Pricing</div>
          <div className="border-b "></div>
          <div className="cursor-pointer">Resources</div>
          <div className="border-b "></div>
          <Link to={"/login"} onClick={() => setIsMenuOpen(false)}>
            <div className="p-2 bg-blue-500 py-3 text-white text-center cursor-pointer">
              Get Zirello for free
            </div>
          </Link>
          <Link to={"/login"} onClick={() => setIsMenuOpen(false)}>
            <div className="p-2 border border-blue-500 py-3 text-center cursor-pointer">
              Log in
            </div>
          </Link>
        </div>

        <ul className="gap-10 items-center w-full ml-10 hidden  lg:flex xl:flex">
          <li className="text-gray-900   cursor-pointer">Features</li>
          <li className="text-gray-900 cursor-pointer">Solutions</li>
          <li className="text-gray-900  cursor-pointer">Plans</li>
          <li className="text-gray-900  cursor-pointer">Pricing</li>
          <li className="text-gray-900   cursor-pointer">Resources</li>
        </ul>
        <div className="hidden items-center gap-4 w-full justify-end  lg:flex xl:flex">
          <Link to={"/login"}>
            <div className="flex items-center cursor-pointer pr-5">
              <p className="text-lg">Log in</p>
            </div>
          </Link>
          <Link to={"/login"} className="hidden lg:block w-fit ">
            <div className="cursor-pointer h-16 flex items-center justify-center  bg-blue-600 hover:bg-blue-700">
              <h1 className="text-white text-lg text-md flex mx-5">
                Get Zirello for Free
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarHome;
