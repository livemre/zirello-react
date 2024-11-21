import { FC, useContext, useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { BGType, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import board from "../assets/board.svg";
import { TbProgress } from "react-icons/tb";

type Props = {
  type: string;
};

const CreateBoardButton: FC<Props> = ({ type }) => {
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [selectedBG, setSelectedBG] = useState<BGType | null>(null);
  const [bgImgs, setBgImgs] = useState<BGType[]>([]);
  const [boardTitle, setBoardTitle] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [createButtonLoading, setCreateButtonLoading] =
    useState<boolean>(false);

  const createMenuRef = useRef<HTMLDivElement | null>(null);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { user, getBGImages, addBoard, getBoards, handleNotification } =
    context;

  const _addBoard = async () => {
    setCreateButtonLoading(true);
    if (user === null) return;

    if (boardTitle === "") {
      setMessage("Board title can not be empty!");
      return;
    }

    if (user.email && user.displayName) {
      if (selectedBG) {
        const result = await addBoard(
          user.uid,
          boardTitle,
          selectedBG?.url,
          user.email,
          user.displayName
        );
        if (result) {
          await getBoards(user.uid);
          setShowCreateMenu(false);
          setBoardTitle("");
          handleNotification("New board added...", true);
          setCreateButtonLoading(false);
        }
      }
    }
  };

  const handleBackGround = (id: number) => {
    console.log(id);
    console.log(typeof id);

    const selected = bgImgs[id];
    setSelectedBG(selected);
  };

  useEffect(() => {
    _getBGImages();
  }, [user]);

  const _getBGImages = async () => {
    const bgImages = await getBGImages();
    setBgImgs(bgImages);
    const selected = bgImages[0]; // İlk arka planı seç
    setSelectedBG(selected);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(e.target as Node)
      ) {
        setShowCreateMenu(false);
        console.log(showCreateMenu);
        console.log("Outside");
      } else {
        console.log("Inside");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateMenu = async () => {
    if (bgImgs.length > 0 && selectedBG !== null) {
      setShowCreateMenu(true); // Menü gösterimi
    }
  };

  const createMenuDiv = () => {
    return (
      <div ref={createMenuRef}>
        <div
          className={`fixed inset-0 bg-black/50 transition-all duration-200 pointer-events-none ease-in-out z-[400] ${
            showCreateMenu ? "opacity-100  " : "opacity-0"
          }`}
        ></div>
        <>
          <div
            className={`transition-all duration-200 ease-in-out z-[401] border border-slate-500 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[325px] lg:w-[500px] h-auto dark:bg-gray-800 bg-white shadow-lg p-5  lg:p-10 flex justify-start items-start  rounded-lg
            ${showCreateMenu ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <div className="flex flex-col items-start w-full">
              {!createButtonLoading && (
                <IoCloseSharp
                  size={24}
                  className="m-1 flex self-end top-1 absolute right-1 hover:bg-gray-700 cursor-pointer hover:rounded-md text-gray-400"
                  onClick={() => setShowCreateMenu(false)}
                />
              )}
              {selectedBG === null ? (
                <ClipLoader size={32} color="white" />
              ) : (
                <div className="h-32  flex items-center justify-center w-full mb-3 mt-9 ">
                  <div
                    className="p-4 items-center w-full justify-center rounded-md shadow-inner"
                    style={{
                      backgroundImage: `url(${selectedBG?.url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${board})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                      }}
                      className="w-full h-28 flex self-center "
                    ></div>
                  </div>
                </div>
              )}

              <p className="px-0 py-1 flex mt-3 dark:text-gray-400 text-gray-900 p-2 self-start text-sm lg:text-base">
                BOARD TITLE
              </p>

              <input
                className="border border-gray-400 w-full rounded-lg p-3 dark:bg-gray-700 bg-gray-200  dark:text-gray-400 text-gray-900"
                onChange={(e) => setBoardTitle(e.target.value)}
              />

              <p className="px-0 py-1 mt-3 flex flex-start dark:text-gray-400 text-gray-900  p-2 text-sm lg:text-base">
                BACKGROUND
              </p>

              <div className="grid grid-cols-4 gap-1 w-full">
                {bgImgs
                  .sort((a, b) => a.id - b.id)
                  .map((item, index) => {
                    return (
                      <div className="relative min-h-14 h-14 lg:h-14 lg:min-h-14 w-18 max-w-18  ">
                        {selectedBG && selectedBG.id === index ? (
                          <FaCheckCircle className=" absolute top-1 left-1 text-white border border-gray-100 rounded-full text-lg lg:text-3xl" />
                        ) : (
                          ""
                        )}
                        <div
                          className="bg-gray-600  lg:min-w-18 lg:min-h-14 rounded-md  cursor-pointer h-12 lg:h-14  shadow-inner"
                          onClick={() => {
                            handleBackGround(item.id);
                          }}
                          style={{
                            backgroundImage: `url(${item.url})`,
                            backgroundSize: "cover",
                          }}
                          key={item.id}
                        ></div>
                      </div>
                    );
                  })}
              </div>

              {message && <p>{message}</p>}

              {createButtonLoading ? (
                <div className=" mt-10 p-3 bg-gray-700  w-full rounded-lg text-gray-500 cursor-not-allowed animate-pulse flex items-center justify-center gap-3">
                  <TbProgress
                    size={24}
                    className=" animate-spin text-gray-500"
                  />

                  <button className="cursor-not-allowed">CREATING...</button>
                </div>
              ) : boardTitle ? (
                <button
                  className="mt-10 p-3 bg-blue-500 hover:bg-blue-600 w-full rounded-lg text-gray-100  text-sm lg:text-base"
                  onClick={_addBoard}
                >
                  CREATE
                </button>
              ) : (
                <button className="mt-10 p-3 bg-gray-400  w-full rounded-lg text-gray-200 cursor-not-allowed text-sm lg:text-base">
                  CREATE
                </button>
              )}
            </div>
          </div>
        </>
      </div>
    );
  };

  if (type === "sidebar-button") {
    return (
      <div>
        <FaPlus
          size={24}
          className="text-gray-400 hover:bg-gray-700 p-1"
          onClick={handleCreateMenu}
        />
        {createMenuDiv()}
      </div>
    );
  }

  if (type === "navbar-button") {
    return (
      <>
        <div
          className=" transition-all ease-in-out duration-200 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600 backdrop-blur-3xl text-md mx-1 bg-blue-500 hover:bg-blue-600  px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
          onClick={handleCreateMenu}
        >
          <h1 className=" text-left">Create</h1>
        </div>
        {createMenuDiv()}
      </>
    );
  }

  if (type === "mobile-navbar") {
    return (
      <>
        <div
          className="text-white text-1xl mx-1 bg-blue-500 hover:bg-blue-600 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
          onClick={handleCreateMenu}
        >
          <h1 className=" text-left">+</h1>
        </div>
        {createMenuDiv()}
      </>
    );
  }

  return (
    <>
      <div
        className=" min-w-40 h-20 lg:w-52 lg:min-h-24 lg:min-w-52 lg:h-24 lg:max-h-24 lg:max-w-52 cursor-pointer rounded-md m-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
        onClick={handleCreateMenu}
      >
        <div className="flex items-center  justify-center h-full ">
          <FaPlus className="text-gray-500 dark:text-gray-200 w-5 h-5 lg:w-5 lg:h-5" />
          <p className="ml-3 lg:text-base text-sm dark:text-gray-200 text-gray-800">
            Create Board
          </p>
        </div>
      </div>
      {createMenuDiv()}
    </>
  );
};

export default CreateBoardButton;
