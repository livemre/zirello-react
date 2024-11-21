import { FC, useContext, useEffect, useRef, useState } from "react";
import { Board, MainContext } from "../context/Context";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

import StarredCard from "./StarredCard";
import RecentCard from "./RecentCard";

import CreateBoardButton from "./CreateBoardButton";

import NavbarSearchBoards from "./NavbarSearchBoards";

import TeamsMenuCard from "./TeamsMenuCard";
import NoStar from "../assets/no_starred.svg";
import { GrFormClose } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";

import ZirelloLight from "../assets/zirello-white.png";
import ZirelloDark from "../assets/zirello-dark.png";
import UserImg from "../assets/user.png";
import LightTheme from "../assets/light-theme.svg";
import DarkTheme from "../assets/dark-theme.svg";
import NavbarSkeleton from "./skeleton/NavbarSkeleton";

type Props = {
  show?: string;
};

const Navbar: FC<Props> = ({ show }) => {
  const context = useContext(MainContext);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const [showTeamBoards, setShowTeamBoards] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const recentButtonRef = useRef<HTMLDivElement | null>(null);
  const recentMenuRef = useRef<HTMLDivElement | null>(null);

  const [showStar, setShowStar] = useState<boolean>(false);
  const starButtonRef = useRef<HTMLDivElement | null>(null);
  const starMenuRef = useRef<HTMLDivElement | null>(null);
  const starDivRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const teamBoardsButtonRef = useRef<HTMLDivElement | null>(null);
  const teamBoardsMenuRef = useRef<HTMLDivElement | null>(null);

  const [showMore, setShowMore] = useState<boolean>(false);

  const [showMobileRecent, setShowMobileRecent] = useState<boolean>(false);
  const [showMobileStarred, setShowMobileStarred] = useState<boolean>(false);
  const [showMobileTeamBoards, setShowMobileTeamBoards] =
    useState<boolean>(false);

  const [showMobileSearchDiv, setShowMobileSearchDiv] =
    useState<boolean>(false);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  const [userImg, setUserImg] = useState<string | null>(null);

  const [theme, setTheme] = useState<string | null>(null);

  const [allBoards, setAllBoards] = useState<Board[] | null>(null);

  const [showThemeSettings, setshowThemeSettings] = useState<boolean>(false);

  if (!context) {
    throw new Error("No Context");
  }

  const { user, boards, getBoards, teamBoards, favBoardsIDS } = context;
  const auth = getAuth();
  const navigate = useNavigate();

  const toggleTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
        setshowThemeSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideStar = (e: MouseEvent) => {
      if (
        starMenuRef.current &&
        !starMenuRef.current.contains(e.target as Node) &&
        starButtonRef.current &&
        !starButtonRef.current.contains(e.target as Node)
      ) {
        setShowStar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideStar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideStar);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideRecent = (e: MouseEvent) => {
      if (
        recentMenuRef.current &&
        !recentMenuRef.current.contains(e.target as Node) &&
        recentButtonRef.current &&
        !recentButtonRef.current.contains(e.target as Node)
      ) {
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRecent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideRecent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideRecent = (e: MouseEvent) => {
      if (
        teamBoardsMenuRef.current &&
        !teamBoardsMenuRef.current.contains(e.target as Node) &&
        teamBoardsButtonRef.current &&
        !teamBoardsButtonRef.current.contains(e.target as Node)
      ) {
        setShowTeamBoards(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRecent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideRecent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideRecent = (e: MouseEvent) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target as Node) &&
        moreRef.current &&
        !moreRef.current.contains(e.target as Node)
      ) {
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRecent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideRecent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideMobileSearch = (e: MouseEvent) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowMobileSearchDiv(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMobileSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMobileSearch);
    };
  }, []);

  const showMenuHandler = () => {
    setShowMenu((prev) => !prev);

    if (!showMenu) {
      setshowThemeSettings(false);
    }
  };

  const signOutHandler = async () => {
    await auth.signOut().then(() => navigate("/login"));
    setShowMenu(false);
  };
  useEffect(() => {
    if (user) {
      getBoards(user?.uid);
      setUserImg(user.photoURL);
    }
  }, [user]);

  const handleMenu = (url: string) => {
    navigate(url);
  };

  const handleClickedMobileSearchButton = () => {
    setShowMobileSearchDiv((prev) => !prev);
    console.log("Mobile search " + showMobileSearchDiv);
  };

  const handleImageError = () => {
    setUserImg(UserImg);
  };

  // İlk renderda localStorage değerini kontrol edin
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Theme değiştiğinde class güncelleyin
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const allBoard = [...teamBoards, ...boards];
    setAllBoards(allBoard);
  }, [teamBoards, boards]);

  if (!user) {
    return (
      <div className="h-12 bg-gray-200 dark:bg-gray-800 flex justify-between p-1 px-5 ">
        <div className="flex gap-3">
          <NavbarSkeleton w="32" />
          <NavbarSkeleton w="40" />
          <NavbarSkeleton w="40" />
          <NavbarSkeleton w="40" />
        </div>
        <div className="flex gap-3">
          <NavbarSkeleton w="72" />
          <NavbarSkeleton w="12" />
          <NavbarSkeleton w="12" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative  h-12 flex items-center justify-between mx-0 mt-0 w-full lg:p-5 ${
        show === "board" ? "bg-transparent " : "bg-gray-200 dark:bg-gray-900 "
      }`}
    >
      <div className=" flex items-center justify-between w-full ">
        {/* Mobil haric tum ekranlarda gorunen ust menu */}
        {show === "board" && (
          <div className="absolute h-12 w-full inset-0 brightness-90 bg-white/50  dark:brightness-30 backdrop-blur-3xl  "></div>
        )}
        <div className="hidden lg:flex md:flex sm:flex items-center w-fit ">
          <Link to={"/"} className="relative">
            {theme === "dark" ? (
              <img src={ZirelloLight} className="min-w-24 max-w-24" />
            ) : (
              <img src={ZirelloDark} className="min-w-24 max-w-24" />
            )}
          </Link>
          <div
            className="transition-all duration-200 ease-in-out relative text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 text-md mx-1 hover:bg-black/10 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
            onClick={() => handleMenu("/boards")}
          >
            <h1 className=" text-left">Boards</h1>
          </div>
          <div className="relative" ref={recentButtonRef}>
            <div
              className={`transition-all duration-200 ease-in-out text-gray-900 dark:text-gray-300 text-md mx-1 dark:hover:bg-white/10 hover:bg-black/10 px-4 py-1 cursor-pointer rounded ml-3 flex items-center ${
                showRecent && "bg-black/10 dark:bg-white/10 "
              }`}
              onClick={() => setShowRecent((prev) => !prev)}
            >
              <h1 className=" text-left">Recent</h1>
              <i>
                <MdKeyboardArrowDown size={20} className="ml-1" />
              </i>
            </div>

            {showRecent && (
              <div
                className="border-opacity-20 z-30 max-h-80 overflow-auto border border-gray-600 absolute w-96 bg-white dark:bg-gray-800  flex flex-col justify-start items-start rounded-md p-3 ml-3 mt-3 shadow-2xl"
                ref={recentMenuRef}
              >
                <ul className="w-full text-left">
                  {allBoards &&
                    allBoards
                      .sort(
                        (a, b) =>
                          b.lastUsingDate.seconds - a.lastUsingDate.seconds
                      )
                      .map((item) => (
                        <Link
                          to={`/board/${item.id}`}
                          onClick={() => setShowRecent(false)}
                          key={item.id}
                        >
                          <RecentCard item={item} />
                        </Link>
                      ))}

                  {!allBoards?.length && (
                    <p className="text-gray-400">No Recent</p>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="relative" ref={starButtonRef}>
            <div
              className={`transition-all duration-200 ease-in-out text-gray-900 dark:text-gray-300 text-md mx-1 dark:hover:bg-white/10 hover:bg-black/10 px-4 py-1 cursor-pointer rounded ml-3 flex items-center ${
                showStar && "bg-black/10 dark:bg-white/10"
              }`}
              onClick={() => setShowStar((prev) => !prev)}
            >
              <h1 className=" text-left">Starred</h1>
              <i>
                <MdKeyboardArrowDown size={20} className="ml-1" />
              </i>
            </div>

            {showStar && (
              <div
                className="border-opacity-20 max-h-80 overflow-auto absolute w-96 bg-white dark:bg-gray-800  flex flex-col justify-start items-start rounded-md p-3 ml-3 mt-3 z-40 border border-gray-600 shadow-2xl"
                ref={starMenuRef}
              >
                <ul className="w-full text-left">
                  {teamBoards &&
                    teamBoards
                      .filter((board) =>
                        favBoardsIDS?.some((fav) => fav === board.id)
                      )
                      .map((item) => {
                        return (
                          <StarredCard
                            item={item}
                            setShowStar={setShowStar}
                            starDivRef={starDivRef}
                            key={item.id}
                            setShowMobileStarred={setShowMobileStarred}
                            setShowMore={setShowMore}
                          />
                        );
                      })}
                  {favBoardsIDS && favBoardsIDS?.length > 0 ? (
                    boards
                      .filter((board) =>
                        favBoardsIDS?.some((item) => item === board.id)
                      )
                      .map((item) => {
                        return (
                          <StarredCard
                            item={item}
                            setShowStar={setShowStar}
                            starDivRef={starDivRef}
                            key={item.id}
                            setShowMobileStarred={setShowMobileStarred}
                            setShowMore={setShowMore}
                          />
                        );
                      })
                  ) : (
                    <div>
                      <img src={NoStar} className="w-full h-30" />
                      <p className="text-gray-900 dark:text-gray-300 text-center">
                        Star important boards to access them quickly and easily.
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
          {teamBoards.length > 0 && (
            <div className="relative" ref={teamBoardsButtonRef}>
              <div
                className={`transition-all duration-200 ease-in-out text-gray-900 dark:text-gray-300 text-md mx-1 dark:hover:bg-white/10 hover:bg-black/10 px-4 py-1 cursor-pointer rounded ml-3 flex items-center ${
                  showTeamBoards && "bg-black/10 dark:bg-white/10"
                }`}
                onClick={() => setShowTeamBoards((prev) => !prev)}
              >
                <h1 className=" text-left">Team Boards</h1>
                <i>
                  <MdKeyboardArrowDown size={20} className="ml-1" />
                </i>
              </div>

              {showTeamBoards && (
                <div
                  className="border-opacity-20 max-h-80 overflow-auto border border-gray-600 absolute w-96 bg-white dark:bg-gray-800  flex flex-col justify-start items-start rounded-md p-3 ml-3 mt-3 z-30 shadow-2xl"
                  ref={teamBoardsMenuRef}
                >
                  <ul className="w-full text-left">
                    {teamBoards.map((item) => {
                      return (
                        <Link
                          to={`/board/${item.id}`}
                          onClick={() => setShowTeamBoards(false)}
                          key={item.id}
                        >
                          <TeamsMenuCard item={item} />
                        </Link>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="relative sm:hidden lg:block">
            <CreateBoardButton type="navbar-button" />
          </div>
          <div className="relative sm:block lg:hidden">
            <CreateBoardButton type="mobile-navbar" />
          </div>
        </div>

        {/* Mobil ekranlarda gorunen ust menu - Starred Recent vb... */}
        <div className="relative flex items-center  lg:hidden sm:hidden">
          <Link to={"/"} className="relative">
            {theme === "dark" ? (
              <img src={ZirelloLight} className="min-w-24 max-w-24" />
            ) : (
              <img src={ZirelloDark} className="min-w-24 max-w-24" />
            )}
          </Link>

          <div className="relative block sm:hidden" ref={moreRef}>
            <div
              className={`flex text-gray-900 dark:text-gray-300 text-md mx-1 hover:bg-black/10 px-4 py-1 cursor-pointer rounded ml-3  items-center ${
                showMore && "bg-gray-300 dark:bg-gray-800"
              }`}
              onClick={() => {
                setShowMore((prev) => !prev);
                setShowMobileRecent(false);
                setShowMobileStarred(false);
                setShowMobileTeamBoards(false);
              }}
            >
              <h1 className=" text-left">More</h1>
              <i>
                <MdKeyboardArrowDown size={20} className="ml-1" />
              </i>
            </div>
            {showMore && (
              <div className="absolute bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md shadow-lg z-50 w-72 -left-5 mt-2 flex flex-col gap-3 items-start p-3 border border-gray-400 dark:border-gray-700">
                {!showMobileRecent &&
                  !showMobileStarred &&
                  !showMobileTeamBoards && (
                    <>
                      <div
                        className="flex justify-between w-full cursor-pointer"
                        onClick={() => {
                          navigate("/boards");
                          setShowMore(false);
                        }}
                      >
                        <p className="">Boards</p>
                      </div>
                      <div
                        className="flex justify-between w-full cursor-pointer"
                        onClick={() => setShowMobileRecent((prev) => !prev)}
                      >
                        <p className="">Recent Boards</p>
                        <MdKeyboardArrowRight size={24} className="ml-1 " />
                      </div>
                      <div
                        className="flex justify-between w-full cursor-pointer"
                        onClick={() => setShowMobileStarred((prev) => !prev)}
                      >
                        <p className="">Starred Boards</p>
                        <MdKeyboardArrowRight size={24} className="ml-1 " />
                      </div>

                      {teamBoards && teamBoards.length > 0 && (
                        <div
                          className="flex justify-between w-full cursor-pointer"
                          onClick={() => {
                            setShowMobileTeamBoards((prev) => !prev);
                          }}
                        >
                          <p className="">Team Boards</p>
                          <MdKeyboardArrowRight size={24} className="ml-1 " />
                        </div>
                      )}
                    </>
                  )}
                {showMobileRecent && (
                  <div className=" w-full">
                    <div className="flex gap-1 items-center justify-between text-gray-900 dark:text-gray-300 w-full h-7 mb-4">
                      <MdKeyboardArrowLeft
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => setShowMobileRecent(false)}
                      />
                      <p>Recent Boards</p>
                      <GrFormClose
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowMore(false);
                          setShowMobileRecent(false);
                        }}
                      />
                    </div>
                    {boards.length > 0 ? (
                      boards
                        .sort(
                          (a, b) =>
                            b.lastUsingDate.seconds - a.lastUsingDate.seconds
                        )
                        .map((item) => {
                          return (
                            <Link
                              to={`/board/${item.id}`}
                              onClick={() => {
                                setShowMobileRecent(false);
                                setShowMore(false);
                              }}
                              key={item.id}
                            >
                              <RecentCard item={item} />
                            </Link>
                          );
                        })
                    ) : (
                      <p>No Recent</p>
                    )}
                  </div>
                )}
                {showMobileStarred && (
                  <div className=" w-full">
                    <div className="flex gap-1 items-center justify-between text-gray-900 dark:text-gray-300 w-full h-7 mb-4">
                      <MdKeyboardArrowLeft
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => setShowMobileStarred(false)}
                      />
                      <p>Starred Boards</p>
                      <GrFormClose
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowMore(false);
                          setShowMobileStarred(false);
                        }}
                      />
                    </div>
                    {favBoardsIDS && favBoardsIDS?.length > 0 ? (
                      boards
                        .filter((board) =>
                          favBoardsIDS?.some((item) => item === board.id)
                        )
                        .map((item) => {
                          return (
                            <StarredCard
                              item={item}
                              setShowStar={setShowStar}
                              starDivRef={starDivRef}
                              key={item.id}
                              setShowMobileStarred={setShowMobileStarred}
                              setShowMore={setShowMore}
                            />
                          );
                        })
                    ) : (
                      <div>
                        <img src={NoStar} className="w-full h-30" />
                        <p className="text-gray-900 dark:text-gray-300 text-center">
                          Star important boards to access them quickly and
                          easily.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {showMobileTeamBoards && (
                  <div className=" w-full">
                    <div className="flex gap-1 items-center justify-between text-gray-900 dark:text-gray-300 w-full h-7 mb-4">
                      <MdKeyboardArrowLeft
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => setShowMobileTeamBoards(false)}
                      />
                      <p>Team Boards</p>
                      <GrFormClose
                        className="text-2xl text-gray-900 dark:text-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowMore(false);
                          setShowMobileRecent(false);
                        }}
                      />
                    </div>
                    {teamBoards ? (
                      teamBoards.map((item) => {
                        return (
                          <Link
                            to={`/board/${item.id}`}
                            onClick={() => {
                              setShowMobileRecent(false);
                              setShowMore(false);
                            }}
                            key={item.id}
                          >
                            <TeamsMenuCard item={item} />
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-gray-200">No Team Boards</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <CreateBoardButton type="mobile-navbar" />
        </div>

        <div className="z-10 flex items-center gap-2 flex-1 justify-end w-full">
          {showMobileSearchDiv && (
            <>
              <div className="fixed inset-0 bg-black/20 opacity-70 z-40"></div>
              <div
                className="absolute flex flex-col justify-center items-center top-12 left-0  bg-white/50 dark:bg-black/50 backdrop-blur-3xl w-full p-3 z-50 border-b-2 border-gray-500 shadow-2xl "
                ref={mobileSearchRef}
              >
                {/* <p className="text-md mb-3 text-gray-400">SEARCH BOARD</p> */}
                <NavbarSearchBoards
                  type="mobile"
                  setShowMobileSearchDiv={setShowMobileSearchDiv}
                />
              </div>
            </>
          )}
          <NavbarSearchBoards type="lg" />
          <IoSearch
            onClick={handleClickedMobileSearchButton}
            className="lg:hidden  md:block text-gray-900 dark:text-gray-300 w-7 h-7 mr-4 min-w-7 min-h-7"
          />

          <div className="flex items-center relative">
            <div ref={profileRef}>
              {user && userImg && (
                <img
                  className="rounded-full mr-1 w-8 h-8 min-w-8 min-h-8"
                  src={userImg}
                  onError={handleImageError}
                  width={32}
                  height={32}
                  onClick={showMenuHandler}
                />
              )}
            </div>

            <div className="z-[9000]">
              <div
                className={`z-[9000] absolute lg:-right-2 lg:top-10 right-0 top-10  bg-gray-200 dark:bg-gray-800 backdrop-blur-3xl w-72 rounded-lg shadow-xl border border-gray-500 border-opacity-20 
                  transition-all duration-300 ease-in-out transform 
                  ${
                    showMenu
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-75 pointer-events-none"
                  }
                `}
                ref={menuRef}
              >
                <div className="flex gap-4 p-3 mt-3">
                  {user && userImg && (
                    <img src={userImg} className="rounded-full w-10 h-10" />
                  )}
                  <div className="flex flex-col items-start">
                    <p className="text-gray-900 dark:text-gray-300">
                      {user.displayName}
                    </p>
                    <p className="text-gray-900 dark:text-gray-300 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="border-opacity-20 border-b border-gray-500 mt-1"></div>

                <div className="z-50 flex flex-col gap-2 mt-3 text-md w-full mb-3 ">
                  <div className="relative z-50 ">
                    <div
                      className={` flex w-full items-center justify-between cursor-pointer hover:bg-white/30 dark:hover:dark:bg-black/20 py-2 px-4  ${
                        showThemeSettings
                          ? "bg-white/30 border-l-2 border-blue-400 dark:dark:bg-black/20 "
                          : "border-l-2 border-transparent"
                      }`}
                      onClick={() => {
                        setshowThemeSettings((prev) => !prev);
                      }}
                    >
                      <p className="dark:text-gray-300">Theme</p>
                      <IoIosArrowForward className="text-black dark:text-gray-300" />
                    </div>
                    {showThemeSettings && (
                      <div className="lg:absolute flex flex-col gap-4 lg:top-0 lg:-left-72 lg:-ml-1  w-full bg-gray-200 dark:bg-gray-800 backdrop-blur-3xl lg:border border-gray-500  lg:shadow-xl p-3 rounded-md z-[9000] ">
                        <div
                          onClick={() => toggleTheme("light")}
                          className={`flex gap-4 items-center p-3 rounded-md  ${
                            theme === "light"
                              ? "bg-white/30 hover:bg-white/30 dark:hover:bg-black/20 "
                              : "bg-transparent hover:bg-white/30 dark:hover:bg-black/20 dark:text-gray-300"
                          }`}
                        >
                          <img
                            src={LightTheme}
                            className="w-8 lg:w-16 rounded-md"
                          />
                          <p>Light</p>
                        </div>
                        <div
                          onClick={() => toggleTheme("dark")}
                          className={`flex gap-4 items-center p-3 rounded-md ${
                            theme === "dark"
                              ? "bg-white/30 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/20 text-gray-300"
                              : "bg-transparent dark:hover:bg-black/20 hover:bg-white/30"
                          }`}
                        >
                          <img
                            src={DarkTheme}
                            className="w-8 lg:w-16 rounded-md"
                          />
                          <p>Dark</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex w-full items-center justify-between cursor-pointer hover:bg-white/30 dark:hover:dark:bg-black/20  py-2 px-4"
                    onClick={signOutHandler}
                  >
                    <p className="dark:text-gray-300">Log out</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
