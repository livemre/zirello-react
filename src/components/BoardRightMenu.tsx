import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { RightMenuType } from "../pages/Board";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import {
  MdDeleteForever,
  MdDescription,
  MdEdit,
  MdImage,
  MdInfo,
} from "react-icons/md";
import { BGType, MainContext, UserPublicDataType } from "../context/Context";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";

type Props = {
  showBoardSettingsModal: boolean;
  setShowBoardSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleMenuChange: (menu: RightMenuType) => void;
  rightMenu: RightMenuType;
  setRightMenu: React.Dispatch<React.SetStateAction<RightMenuType>>;
  isAnimating: boolean;
  changeBackground: (bg: string) => void;
  currentBgURL: string;
  _updateBackground: (bg: string) => void;
  currentBoardName: string;

  handleUpdateBoardName: (editedBoardName: string) => void;
  handleDeleteBoard: () => void;
  boardDesc: string;
  handleUpdateDesc: (desc: string) => Promise<boolean>;
  boardAdmin: string;
  isUserBoardAdmin: boolean;
  boardDeleting: boolean;
};

const BoardRightMenu: FC<Props> = ({
  showBoardSettingsModal,
  setShowBoardSettingsModal,
  handleMenuChange,
  rightMenu,
  setRightMenu,
  isAnimating,
  changeBackground,
  currentBgURL,
  _updateBackground,
  currentBoardName,
  handleUpdateBoardName,
  handleDeleteBoard,
  boardDesc,
  handleUpdateDesc,
  boardAdmin,
  isUserBoardAdmin,
  boardDeleting,
}) => {
  const [bgImgs, setBGImgs] = useState<BGType[] | null>(null);
  const [currentBGIndex, setCurrentBGIndex] = useState<number>(4);
  const [choosedBG, setChoosedBG] = useState<string | null>(null);
  const [editedBoardName, setEditedBoardName] =
    useState<string>(currentBoardName);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>(boardDesc);
  const [_boardDesc, _setBoardDesc] = useState(boardDesc);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const [pHeight, setPHeight] = useState<number>(0);
  const [adminData, setAdminData] = useState<UserPublicDataType[] | null>(null);
  const [descSaving, setDescSaving] = useState<boolean>(false);

  const emptyBGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const descInputRef = useRef<HTMLTextAreaElement | null>(null);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { getBGImages, getUserPublicData } = context;

  useEffect(() => {
    if (descInputRef.current === null) return;
    descInputRef.current !== null && descInputRef.current.focus();
  }, [editDesc]);

  useEffect(() => {
    if (descRef.current !== null) {
      setPHeight(descRef.current.offsetHeight);
    }
  }, [rightMenu, _boardDesc]);

  useEffect(() => {
    if (rightMenu === "Change Background") {
      _getBGImages();
    }
  }, [rightMenu]);

  const _getBGImages = async () => {
    const bgs = await getBGImages();
    setBGImgs(bgs);
  };

  const findCurrentBGIndex = (URL: string) => {
    bgImgs?.filter((bg) => {
      bg.url === URL && setCurrentBGIndex(bg.id);
      bg.url === URL && setChoosedBG(bg.url);
    });
  };

  useEffect(() => {
    findCurrentBGIndex(currentBgURL);
  }, [bgImgs]);

  useEffect(() => {
    _getUserPublicData();
  }, [boardAdmin]);

  const _getUserPublicData = async () => {
    if (boardAdmin === null) return;

    const result = await getUserPublicData(undefined, boardAdmin);
    if (result) {
      setAdminData(result);
    }
  };

  // if (!showBoardSettingsModal)
  //   return (
  //     <GoKebabHorizontal
  //       size={32}
  //       className="  dark:text-gray-400 dark:hover:text-gray-300 text-gray-900 hover:text-gray-800 cursor-pointer ml-4 "
  //       onClick={() => {
  //         setShowBoardSettingsModal(true);
  //         handleMenuChange("Menu");
  //       }}
  //     />
  //   );

  // ${
  //   showBoardSettingsModal
  //     ? "translate-x-full opacity-100"
  //     : "translate-x-0 opacity-100"
  // }

  return (
    <>
      <GoKebabHorizontal
        size={32}
        className="  dark:text-gray-400 dark:hover:text-gray-300 text-gray-900 hover:text-gray-800 cursor-pointer ml-4 "
        onClick={() => {
          setShowBoardSettingsModal(true);
          handleMenuChange("Menu");
        }}
      />
      <div
        className={`z-[5000] transition-all duration-300 flex flex-col absolute items-start gap-0  h-[calc(100vh-3rem)] top-0 
    
    shadow-2xl bg-white/50 dark:bg-black/50 backdrop-blur-3xl p-1 w-80 lg:w-80 text-sm lg:text-base overflow-y-auto ${
      showBoardSettingsModal
        ? " opacity-100 -right-1 lg:-right-10"
        : " opacity-0  -right-[1000px]"
    }`}
      >
        <div className="flex justify-between items-center w-full px-2 py-2">
          {rightMenu !== "Menu" ? (
            <IoChevronBackSharp
              onClick={() => {
                handleMenuChange("Menu");
                setEditedBoardName(currentBoardName);
                setEditDesc(false);
              }}
              className="text-gray-800 dark:text-gray-400 cursor-pointer lg:w-6 lg:h-6 w-5 h-5"
            />
          ) : (
            <p></p>
          )}
          <p className="flex  text-gray-800 dark:text-gray-400">{rightMenu}</p>
          <IoMdClose
            className="lg:w-6 lg:h-6 w-5 h-5  text-gray-800 dark:text-gray-400 hover:bg-white/20 rounded-md m-1 cursor-pointer"
            onClick={() => {
              setShowBoardSettingsModal(false);
              setRightMenu("Menu");
              setEditedBoardName(currentBoardName);
            }}
          />
        </div>
        <div className="border-b border-gray-500 border-opacity-35 mt-1  w-full "></div>
        {rightMenu === "Change Background" && (
          <div
            className={`transform transition-transform duration-100  ${
              isAnimating
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }
                  `}
          >
            <div className="p-3"></div>
            <div className="flex gap-2 flex-wrap w-full justify-center">
              {bgImgs !== null
                ? bgImgs.map((image) => {
                    return (
                      <div
                        onClick={() => {
                          findCurrentBGIndex(image.url);
                          changeBackground(image.url);

                          if (choosedBG !== null) {
                            _updateBackground(image.url);
                            console.log("choosed BG bos degil" + choosedBG);
                          } else {
                            console.log("choosed BG bos" + choosedBG);
                          }
                        }}
                        key={image.id}
                        className="cursor-pointer rounded-md m-1 border-2 border-gray-800  hover:border-gray-400 w-24 h-16  lg:w-32 lg:h-24 flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${image.url})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      >
                        {image.id === currentBGIndex && (
                          <FaCheckCircle
                            size={32}
                            className="text-gray-200 shadow-lg border-2 rounded-full border-gray-100 bg-green-500"
                          />
                        )}
                      </div>
                    );
                  })
                : emptyBGS.map(() => {
                    return (
                      <div className="bg-gray-200 animate-pulse w-32 h-24 rounded-md"></div>
                    );
                  })}
            </div>
          </div>
        )}
        {rightMenu === "Delete Board" && (
          <div
            className={`transform transition-transform duration-100  ${
              isAnimating
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }
                `}
          >
            <div className="p-3 flex flex-col w-full">
              <p className="text-gray-800 dark:text-gray-400 text-left mb-2 ">
                Deleting a board is forever. There is no undo. Are you sure?
              </p>
              {boardDeleting ? (
                <button className="text-gray-200 bg-gray-600 dark:text-gray-400 dark:bg-gray-600 p-1 lg:p-3 w-full rounded-md  animate-pulse cursor-not-allowed ">
                  Delete
                </button>
              ) : (
                <button
                  className="text-gray-100 bg-gray-500 hover:bg-gray-600 dark:text-gray-400 dark:bg-gray-700 p-1 lg:p-3 w-full rounded-md dark:hover:bg-gray-800 "
                  onClick={handleDeleteBoard}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
        {rightMenu === "About Board" && (
          <div
            className={`transform transition-transform duration-100 p-3 ${
              isAnimating
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }
             `}
          >
            <div className="mt-1">
              <div className="flex gap-2 items-center mb-4 ">
                <FaStar
                  size={14}
                  className="text-gray-800 dark:text-gray-400"
                />
                <p className="text-gray-800 dark:text-gray-400 font-semibold">
                  BOARD ADMIN
                </p>
              </div>

              <div className="flex gap-1 lg:gap-3 items-center">
                {adminData &&
                  adminData[0].photoURL !== null &&
                  adminData[0].photoURL !== undefined && (
                    <img
                      src={adminData && adminData[0].photoURL}
                      className="rounded-full w-7 h-7 lg:w-10 lg:h-10 border border-gray-700"
                    />
                  )}
                <div className="flex flex-col items-start">
                  <p className="text-gray-800 dark:text-gray-400 ">
                    {adminData && adminData[0].displayName}
                  </p>
                  <p className="text-gray-800 dark:text-gray-400 text-xs lg:text-sm">
                    {adminData && adminData[0].email}
                  </p>
                </div>
              </div>
            </div>
            {isUserBoardAdmin ? (
              <div>
                <div className="flex gap-3 text-gray-800 dark:text-gray-400 items-center mt-5">
                  <MdDescription size={14} />
                  <p className="text-gray-800 dark:text-gray-400 font-semibold ">
                    DESCRIPTION
                  </p>
                </div>

                {!editDesc && (
                  <p
                    className="text-left text-gray-800  dark:text-gray-300 rounded-md bg-white/90 dark:bg-gray-500  p-2 mt-3 cursor-pointer"
                    onClick={() => setEditDesc(true)}
                    ref={descRef}
                  >
                    {_boardDesc}
                  </p>
                )}
                {editDesc && (
                  <div>
                    <textarea
                      className="w-full bg-gray-300 dark:bg-gray-500 text-gray-800 dark:text-gray-300 mt-3 p-2 "
                      style={{ height: pHeight }}
                      onChange={(e) => setDesc(e.target.value)}
                      value={desc}
                      ref={descInputRef}
                    />
                    <div className="flex justify-start mt-2 gap-3">
                      {desc !== "" ? (
                        <button
                          className={`text-gray-100 bg-gray-500 rounded-md px-4 py-1 hover:bg-gray-600  ${
                            descSaving && "animate-pulse"
                          } `}
                          onClick={() => {
                            setDescSaving(true);
                            handleUpdateDesc(desc).then((result) => {
                              if (result) {
                                _setBoardDesc(desc);
                                setEditDesc(false);
                                setDescSaving(false);
                              } else {
                                _setBoardDesc("Bir hata olustu!");
                              }
                            });
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <p className="text-gray-400 bg-gray-200 rounded-md px-4 py-1  cursor-not-allowed">
                          Save
                        </p>
                      )}
                      <button
                        className="text-gray-800 dark:text-gray-400 bg-gray-200 rounded-md px-4 dark:bg-transparent dark:hover:bg-gray-600 hover:bg-gray-300 py-1"
                        onClick={() => {
                          setDesc(_boardDesc);
                          setEditDesc(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-3 text-gray-800 dark:text-gray-400 items-center mt-5">
                  <MdDescription size={14} />
                  <p className="text-gray-800 dark:text-gray-400 font-semibold">
                    DESCRIPTION
                  </p>
                </div>

                {!editDesc && (
                  <p
                    className="text-left text-gray-800 dark:text-gray-400  bg-gray-700 p-2 mt-3 shadow-md"
                    ref={descRef}
                  >
                    {_boardDesc}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {rightMenu === "Change Name" && (
          <div
            className={`transform transition-transform duration-100  ${
              isAnimating
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }
               `}
          >
            <div className="p-3">
              <p className="font-semibold text-left mb-1 text-gray-800 dark:text-gray-400 ">
                BOARD NAME
              </p>
              <input
                className="rounded-md w-full bg-white/20 p-1 lg:p-3 text-gray-800 dark:text-gray-400 "
                value={editedBoardName}
                onChange={(e) => setEditedBoardName(e.target.value)}
              />
              {editedBoardName !== "" ? (
                <button
                  className="dark:bg-gray-800 dark:text-gray-400 w-full p-1 lg:p-3 rounded-md mt-3 dark:hover:bg-gray-900  bg-gray-500 hover:bg-gray-600 text-gray-100"
                  onClick={() => {
                    handleUpdateBoardName(editedBoardName);
                    setRightMenu("Menu");
                  }}
                >
                  Save
                </button>
              ) : (
                <p className="dark:bg-gray-800 dark:text-gray-400 w-full p-1 lg:p-3 rounded-md mt-3 dark:hover:bg-gray-900  bg-gray-200  text-gray-400 cursor-not-allowed">
                  Save
                </p>
              )}
            </div>
          </div>
        )}
        {/*Ana menu itemler*/}
        {rightMenu === "Menu" && (
          <div
            className={`transform transition-transform duration-100 ${
              isAnimating
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            } `}
          >
            <div
              onClick={() => handleMenuChange("About Board")}
              className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 dark:hover:bg-black/50 m-2 cursor-pointer"
            >
              <MdInfo className="text-gray-800 dark:text-gray-400 w-5 h-5 min-w-5 min-h-5" />
              <div className="flex flex-col items-start gap-1">
                <p className="text-gray-800 dark:text-gray-400   ">
                  About Board
                </p>
              </div>
            </div>
            {isUserBoardAdmin ? (
              <div
                onClick={() => handleMenuChange("Delete Board")}
                className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 dark:hover:bg-black/50 m-2 cursor-pointer"
              >
                <MdDeleteForever className="text-gray-800 dark:text-gray-400 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-800 dark:text-gray-400 ">
                  Delete Board
                </p>
              </div>
            ) : (
              <div className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 m-2 cursor-not-allowed">
                <MdDeleteForever className="text-gray-500 dark:text-gray-500 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-500 dark:text-gray-500 ">
                  Delete Board
                </p>
              </div>
            )}
            {isUserBoardAdmin ? (
              <div
                onClick={() => {
                  handleMenuChange("Change Name");
                }}
                className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 dark:hover:bg-black/50 m-2 cursor-pointer"
              >
                <MdEdit className="text-gray-800 dark:text-gray-400 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-800 dark:text-gray-400 ">Change Name</p>
              </div>
            ) : (
              <div className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 m-2 cursor-not-allowed">
                <MdEdit className="text-gray-500 dark:text-gray-500 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-500 dark:text-gray-500  ">
                  Change Name
                </p>
              </div>
            )}
            {isUserBoardAdmin ? (
              <div
                onClick={() => handleMenuChange("Change Background")}
                className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 dark:hover:bg-black/50 m-2 cursor-pointer"
              >
                <MdImage className="text-gray-800 dark:text-gray-400 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-800 dark:text-gray-400  ">
                  Change Background
                </p>
              </div>
            ) : (
              <div className="flex gap-3 items-center p-3 hover:rounded-md hover:bg-white/20 m-2 cursor-not-allowed">
                <MdImage className="text-gray-500 dark:text-gray-500 w-5 h-5 min-w-5 min-h-5" />
                <p className="text-gray-500 dark:text-gray-500 ">
                  Change Background
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BoardRightMenu;
