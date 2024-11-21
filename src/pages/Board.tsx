import { DragEvent, useContext, useEffect, useState } from "react";
import CreateList from "../components/CreateList";
import {
  MainContext,
  List as ListType,
  Board as BoardType,
  Item,
} from "../context/Context";
import List from "../components/List";
import { useNavigate, useParams } from "react-router-dom";

import InviteFriends from "../components/InviteFriends";
import ListSkeleton from "../components/skeleton/ListSkeleton";
import BoardRightMenu from "../components/BoardRightMenu";
import ToggleFav from "../components/ToggleFav";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import reorder, { reorderItemsMap } from "../utilits/reorder";
import { Timestamp, doc, getFirestore, writeBatch } from "firebase/firestore";
import myFirebaseApp from "../context/firebaseConfig";
import Navbar from "../components/Navbar";

export type RightMenuType =
  | "Menu"
  | "Change Background"
  | "Change Name"
  | "About Board"
  | "Delete Board";

const Board = () => {
  const { id } = useParams();
  const [boardDetails, setBoardDetails] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempLists, setTempLists] = useState<ListType[] | null>(null);
  const [boardDetailsLoading, setBoardDetailsLoading] = useState<boolean>(true);
  const [showBoardSettingsModal, setShowBoardSettingsModal] =
    useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [rightMenu, setRightMenu] = useState<RightMenuType>("Menu");
  const [isUseradmin, setIsUserAdmin] = useState<boolean>(false);

  const [isListDragging, setIsListDragging] = useState<boolean>(false);

  const database = getFirestore(myFirebaseApp);

  const emptyList = [1, 2, 3];
  const [boardDeleting, setBoardDeleting] = useState(false);

  const navigator = useNavigate();

  const handleMenuChange = (menu: RightMenuType) => {
    setIsAnimating(true);
    setRightMenu(menu);
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };

  const changeBackground = (bg: string) => {
    if (boardDetails) {
      setBoardDetails({
        ...boardDetails,
        bgImage: bg,
      });
    }
  };

  useEffect(() => {
    _checkUserIsAdmin();
  }, [loading]);

  const handleUpdateBoardName = async (editedBoardName: string) => {
    if (boardDetails) {
      const prevBoardName = boardDetails.name;
      boardDetails.name = editedBoardName;
      const result = await updateBoardName(boardDetails?.id, editedBoardName);
      if (result) {
        handleNotification("Board name has changed!", true);
      } else {
        boardDetails.name = prevBoardName;
      }
    }
  };

  const handleDeleteBoard = async () => {
    setBoardDeleting(true);
    if (boardDetails !== null) {
      const result = await deleteBoard(boardDetails.id);
      if (result) {
        setBoardDeleting(false);
        handleNotification("Board has deleted!", true);
        setTimeout(() => {
          navigator("/boards");
        }, 100);
      }
    }
  };

  const _updateBackground = async (bg: string) => {
    // TODO DB ye boards icine update islemi yapilacak
    if (boardDetails !== null) {
      const result = await updateBackground(boardDetails?.id, bg);
      handleNotification("Background has changed!", true);
      console.log(result);
    }
  };

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const {
    lists,
    user,
    getListsOfBoard,
    getItem,
    getBoardDetails,
    moveList,
    updateBackground,
    handleNotification,
    updateBoardName,
    deleteBoard,
    updateBoardDesc,
    checkUserIsBoardAdmin,
    canDraggable,
    setLists,
    db,
    setDB,
    updateLastUsingDate,
    setItemDragging,
    setBoardBG,
  } = context;

  // Id si verilen boardin bilgilerini getir.

  const _checkUserIsAdmin = async () => {
    if (id === undefined || user === null) {
      return;
    }
    const result = await checkUserIsBoardAdmin(id, user.uid);
    setIsUserAdmin(result);
  };

  useEffect(() => {
    setBoardDetailsLoading(true);
    setLoading(true);
    setTempLists(null);

    getAllDetails();
  }, [id]);

  const getAllDetails = async () => {
    setBoardDetailsLoading(true);

    await __getBoardsDetails()
      .then(() => setBoardDetailsLoading(false))
      .then(() => _getListOfBoard())
      .then(() => setLoading(false));
  };

  const __getBoardsDetails = async (): Promise<boolean> => {
    if (id !== undefined && id !== null) {
      const _boardDetails = await getBoardDetails(id);
      setBoardDetails(_boardDetails);
      // TODO
      setBoardBG(true);
      return true;
    } else {
      return false;
    }
  };

  // useEffect(() => {
  //   _getListOfBoard();
  // }, []);

  const onDeleteList = () => {
    console.log("On delete list");
    if (!id) {
      return;
    }
    getListsOfBoard(id)
      .then(() => console.log("Lists loaded successfully"))
      .catch((error) => console.error("Lists cannot be loaded", error));
  };

  // const _getBoardDetails = async () => {
  //   if (id) {
  //     const data = await getBoardDetails(id);
  //     console.log(data);

  //     const _data = data;
  //     console.log(_data);

  //     setBoardDetails(_data);
  //     setBoardDetailsLoading(false);
  //     console.log(data);
  //     console.log(id);
  //     console.log(boardDetails);
  //   }
  // };

  // useEffect(() => {
  //   if (boards && id) {
  //     const updatedBoard = boards.find((board) => board.id === id);
  //     if (updatedBoard) {
  //       setBoardDetails(updatedBoard);
  //     }
  //   }
  // }, [boards]);

  // useEffect(() => {
  //   if (boardDetails === null) {
  //     _getListOfBoard();
  //     _getBoardDetails();
  //   }
  // }, [boardDetails]);

  useEffect(() => {
    if (!id) return;

    console.log("ID bulunamadi" + id);

    _updateLastUsingDate();
  }, [id]);

  const _getListOfBoard = async (): Promise<boolean> => {
    if (!id) {
      return false;
    }

    try {
      await getListsOfBoard(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const _updateLastUsingDate = async () => {
    if (!id) {
      return;
    }

    if (!user) {
      return;
    }

    const date = Timestamp.now();
    const result = await updateLastUsingDate(id, date, user.uid);
    console.log(result);
  };

  useEffect(() => {
    setTempLists(lists);
    const ids: any = [];
    lists.forEach((item) => {
      console.log("Item ID:", item.id);
      ids.push(item.id);
    });
    console.log(ids);
    getItem(ids);
  }, [lists]);

  const handleUpdateDesc = async (desc: string): Promise<boolean> => {
    if (boardDetails === null) return false;

    const prevDesc = boardDetails.desc;

    try {
      boardDetails.desc = desc;
      await updateBoardDesc(boardDetails?.id, desc);
      console.log("Desc degisti");

      return true;
    } catch (error) {
      boardDetails.desc = prevDesc;

      handleNotification("Server Error", true);
      console.log("error");

      return false;
    }
  };

  const handleDragStart = (result: DragEvent) => {
    const { type } = result;
    if (type === "column") setIsListDragging(true);
    if (type === "item") setItemDragging(true);
    if (!canDraggable) {
      // Eğer modal açıksa sürüklemeyi devre dışı bırak
      console.log(canDraggable);

      return false;
    }
  };

  // const handleDragEnd = async (result: DropResult) => {
  //   if (!canDraggable) {
  //     // Eğer modal açıksa sürüklemeyi devre dışı bırak
  //     return false;
  //   }
  //   console.log("handle drag end");

  //   if (!result.destination) return;

  //   const { source, destination, type } = result;

  //   if (type === "column") {
  //     // Kolonların sırasını değiştir ve indexInBoard değerlerini güncelle
  //     const reorderedColumns = reorder(lists, source.index, destination.index);
  //     const updatedColumns = reorderedColumns.map((col, index) => ({
  //       ...col,
  //       indexInBoard: index,
  //     }));

  //     setLists(updatedColumns);
  //     setTempLists(updatedColumns);
  //     console.log(updatedColumns);
  //     console.log(lists);
  //     console.log(tempLists);
  //     console.log(reorderedColumns);

  //     if (boardDetails?.id === undefined) return;

  //     await moveList(
  //       destination.index,
  //       boardDetails?.id,
  //       setLists,
  //       updatedColumns
  //     );

  //     return;
  //   }

  //   // Kartları taşıma işlemi
  //   const itemsMap = lists.reduce((acc, column) => {
  //     acc[column.id] = db.filter((item) => item.listID === column.id);
  //     return acc;
  //   }, {} as Record<string, Item[]>);

  //   const { quoteMap } = reorderItemsMap({
  //     itemsMap,
  //     source,
  //     destination,
  //   });

  //   const updatedItems = Object.entries(quoteMap).flatMap(
  //     ([listID, columnItems]) =>
  //       (columnItems as Item[]).map((item) => ({
  //         ...item,
  //         listID,
  //       }))
  //   );

  //   setDB(updatedItems);

  //   console.log(updatedItems);
  // };

  const handleDragEnd = async (result: DropResult) => {
    setIsListDragging(false);

    if (!canDraggable) {
      return false;
    }

    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "item") setItemDragging(false);

    if (type === "column") {
      // Kolonların sırasını değiştir ve indexInBoard değerlerini güncelle
      const reorderedColumns = reorder(lists, source.index, destination.index);
      const updatedColumns = reorderedColumns.map((col, index) => ({
        ...col,
        indexInBoard: index,
      }));

      setLists(updatedColumns);
      setTempLists(updatedColumns);

      if (boardDetails?.id === undefined) return;

      await moveList(
        destination.index,
        boardDetails?.id,
        setLists,
        updatedColumns
      );

      return;
    }

    // Kartları taşıma işlemi
    const itemsMap = lists.reduce((acc, column) => {
      acc[column.id] = db.filter((item) => item.listID === column.id);
      return acc;
    }, {} as Record<string, Item[]>);

    const { quoteMap } = reorderItemsMap({
      itemsMap,
      source,
      destination,
    });

    const updatedItems = Object.entries(quoteMap).flatMap(
      ([listID, columnItems]) =>
        (columnItems as Item[]).map((item) => ({
          ...item,
          listID,
        }))
    );

    setDB(updatedItems);

    // **Firebase Toplu Güncelleme (writeBatch)**
    const batch = writeBatch(database);

    // Her öğeyi Firebase'e güncelle
    updatedItems.forEach((item) => {
      const itemRef = doc(database, "items", item.id);
      batch.update(itemRef, {
        listID: item.listID,
        indexInList: item.indexInList,
      });
    });

    try {
      await batch.commit();
      console.log("Firebase güncellemesi başarılı");
    } catch (error) {
      console.error("Firebase güncellemesi sırasında hata: ", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${boardDetails?.bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Navbar show={"board"} />
      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragStart={(e: any) => handleDragStart(e)}
      >
        <Droppable
          droppableId={"main-board"}
          direction="horizontal"
          type="column"
          key={"main-board"}
        >
          {(provided) => (
            <div
              className="flex flex-col h-[calc(100vh-3rem)]"
              ref={provided.innerRef}
              {...provided.droppableProps}
              key={"main-board"}
            >
              {boardDetailsLoading && loading ? (
                <div className="flex flex-col justify-center  items-center  bg-slate-900 h-0 ">
                  {/* <ClipLoader
                    size={48}
                    className="text-slate-100"
                    color="white"
                  /> */}
                </div>
              ) : boardDetails && boardDetails ? (
                <>
                  <div
                    className={` relative flex flex-row justify-between bg-transparent  border-slate-400 px-1 lg:px-10 `}
                  >
                    <div className="absolute h-14 w-full inset-0 brightness-120 bg-white/50 dark:bg-black/50  backdrop-blur-3xl  "></div>
                    <div className=" relative h-14 flex items-center">
                      <div className="ml-2 mr-2">
                        <ToggleFav
                          boardID={boardDetails.id}
                          type="board-detail"
                        />
                      </div>
                      {showBoardSettingsModal &&
                      boardDetails &&
                      boardDetails?.name.length > 10 ? (
                        <>
                          <p className="hidden lg:block font-bold text-sm lg:text-lg text-gray-900 dark:text-gray-300  ">
                            {boardDetails.name}
                          </p>
                          <p className="lg:hidden font-bold text-sm lg:text-lg text-gray-900 dark:text-gray-300 ">
                            {boardDetails.name.substring(0, 5)}
                            <span>...</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="hidden lg:block text-gray-900 dark:text-gray-300 font-bold text-sm lg:text-lg">
                            {boardDetails.name}
                          </p>
                          <p className="text-gray-900 dark:text-gray-300 font-bold text-sm lg:hidden">
                            {boardDetails.name.length > 25
                              ? boardDetails.name.slice(0, 24) + " ..."
                              : boardDetails.name}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="relative flex items-center justify-between">
                      <div className={`block lg:hidden `}>
                        <InviteFriends
                          boardID={boardDetails.id}
                          type="mobile-board"
                        />
                      </div>
                      <div
                        className={`hidden lg:block transition-all duration-1000 ease-in-out`}
                      >
                        <InviteFriends boardID={boardDetails.id} type="board" />
                      </div>

                      <BoardRightMenu
                        showBoardSettingsModal={showBoardSettingsModal}
                        setShowBoardSettingsModal={setShowBoardSettingsModal}
                        handleMenuChange={handleMenuChange}
                        rightMenu={rightMenu}
                        setRightMenu={setRightMenu}
                        isAnimating={isAnimating}
                        changeBackground={changeBackground}
                        currentBgURL={boardDetails.bgImage}
                        _updateBackground={_updateBackground}
                        currentBoardName={boardDetails.name}
                        handleUpdateBoardName={handleUpdateBoardName}
                        handleDeleteBoard={handleDeleteBoard}
                        boardDesc={boardDetails.desc}
                        handleUpdateDesc={handleUpdateDesc}
                        boardAdmin={boardDetails.userID}
                        isUserBoardAdmin={isUseradmin}
                        boardDeleting={boardDeleting}
                      />
                    </div>
                  </div>

                  {/* Dark mode da buraya dark-overlay gelebilir */}
                  <div
                    className=" p-3 overflow-y-hidden flex flex-row justify-start list-container dark:bg-black/40 bg-transparent h-full pt-2"
                    // style={{
                    //   backgroundImage: `url(${boardDetails?.bgImage})`,
                    //   backgroundColor: "rgba(0, 0, 0, 0.1)",
                    //   backgroundBlendMode: "darken",
                    //   backgroundSize: "cover",
                    //   backgroundPosition: "center",
                    // }}
                  >
                    {/* <div className="flex h-full bg-yellow-400 p-0 m-0"> */}
                    {(loading || boardDetailsLoading) &&
                      emptyList.map((item) => (
                        <div className="flex list" key={item}>
                          <ListSkeleton />
                        </div>
                      ))}

                    {!loading &&
                      !boardDetailsLoading &&
                      tempLists !== null &&
                      tempLists
                        .sort((a, b) => a.indexInBoard - b.indexInBoard)
                        .map((column, index) => (
                          <div className="m-0 p-0">
                            <Draggable
                              isDragDisabled={!canDraggable}
                              draggableId={column.id}
                              index={index}
                              key={column.id}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className=" w-full"
                                  key={column.id}
                                >
                                  <List
                                    onDeleteList={onDeleteList}
                                    title={column.title}
                                    id={column.id}
                                    index={index}
                                    indexInBoard={column.indexInBoard}
                                    boardID={column.boardID}
                                  />
                                </div>
                              )}
                            </Draggable>
                          </div>
                        ))}

                    {id && (
                      <div
                        className={
                          isListDragging
                            ? "lg:opacity-50 ml-[307px] opacity-0 "
                            : " ml-3 lg:ml-3"
                        }
                      >
                        <CreateList boardID={id} />
                      </div>
                    )}
                    {/* </div> */}
                  </div>
                </>
              ) : null}
              <div className="w-0 h-0 m-0 p-0 overflow-y-hidden">
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
