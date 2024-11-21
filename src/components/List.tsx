// List.tsx
import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MainContext } from "../context/Context";
import ItemCard from "./ItemCard";

import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Droppable } from "@hello-pangea/dnd";
import { TbProgress } from "react-icons/tb";

import { AiOutlineDelete } from "react-icons/ai";

type Props = {
  title: string;
  id: string;
  index: number;
  indexInBoard: number;
  boardID: string;
  onDeleteList: () => void;
};

const List: FC<Props> = ({
  title,
  id,

  onDeleteList,
  boardID,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [_title, _setTitle] = useState<string>("");
  const [editListTitle, setEditListTitle] = useState(false);
  const [_updatedTitle, _setUpdatedTitle] = useState<string>("");
  const [showDeleteListModal, setShowDeleteListModal] =
    useState<boolean>(false);

  const addItemTextArea = useRef<HTMLTextAreaElement | null>(null);

  const [listDeleting, setListDeleting] = useState<boolean>(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    _setUpdatedTitle(title);
  }, [title]);

  useEffect(() => {
    if (showInput && addItemTextArea.current) {
      addItemTextArea.current.focus();
    }
  }, [showInput]);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const {
    addItem,
    db,
    setLists,
    lists,
    updateListTitle,
    deleteList,
    handleNotification,
    setCanDraggable,
  } = context;

  useEffect(() => {
    if (_title !== "") {
      setCanDraggable(false);
    } else {
      setCanDraggable(true);
    }
    console.log(_title);
  }, [_title]);

  useEffect(() => {
    console.log(db);
  }, [db]);

  // Disariya tiklaninca kart ekleme kismi gizlensin.

  useEffect(() => {
    const handleClickedOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowInput(false);
        setCanDraggable(true);
      }
    };

    document.addEventListener("mousedown", handleClickedOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickedOutside);
    };
  }, []);

  const _addItem = async () => {
    if (_title === "") return;

    const indexInList = db.filter((item) => item.listID === id).length;

    const getIndex = db.length;
    _setTitle("");
    setShowInput(false);
    const result = await addItem(_title, id, getIndex, indexInList);

    if (!result) {
      console.log("Error");
    }
  };

  const handleTitleFocus = async () => {
    setEditListTitle(false);
    if (_updatedTitle === "") {
      return;
    }

    const _prevTitle = title;

    setLists(
      lists.map((list) => {
        return list.id === id ? { ...list, title: _updatedTitle } : list;
      })
    );
    const result = await updateListTitle(id, _updatedTitle);

    if (!result) {
      setLists(
        lists.map((list) => {
          return list.id === id ? { ...list, title: _prevTitle } : list;
        })
      );
    } else {
      if (_prevTitle !== _updatedTitle)
        handleNotification("List name changed..", true);
    }
  };

  const handleDeleteList = async () => {
    setListDeleting(true);
    const result = await deleteList(id, boardID);
    if (result) {
      onDeleteList();
      handleNotification("List deleted..", true);
      setCanDraggable(true);
      setListDeleting(false);
    }
  };

  const onDeleteItem = () => {
    console.log("On delete item");
    console.log(db);
    onDeleteList();
  };

  const handleItemOver = (itemID: string) => {
    setHoveredItemId(itemID);
  };

  const handleItemLeave = () => {
    setHoveredItemId(null);
  };

  return (
    <div className=" overflow-y-auto w-56 min-w-56 lg:w-72 lg:min-w-72 bg-gray-100 dark:bg-gray-900 p-1 mx-1 flex flex-col items-start justify-start rounded-xl list shadow-2xl ">
      {/* <div className="w-80 min-w-80 bg-black p-4 mx-4 flex flex-col items-start justify-start rounded-xl overflow-y-auto list shadow-2xl"></div> */}
      {editListTitle ? (
        <div className="font-semibold p-2 mb-2">
          <input
            value={_updatedTitle}
            className="bg-transparent text-gray-900  dark:text-gray-400 text-sm w-full rounded-md border-0 focus:border-0 p-2"
            autoFocus
            onBlur={handleTitleFocus}
            onChange={(e) => _setUpdatedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleFocus();
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full relative">
          <div className="flex items-center justify-between w-full mb-2 p-2">
            <p
              onClick={() => setEditListTitle(true)}
              className="text-gray-900 dark:text-gray-400 text-sm font-semibold cursor-pointer w-full text-left p-2"
            >
              {title}
            </p>
            <RiDeleteBin6Line
              onClick={() => {
                setShowDeleteListModal(true);
                setCanDraggable(false);
              }}
              className="text-gray-900 dark:text-gray-300 dark:hover:text-gray-400 hover:text-red-900 cursor-pointer mr-3"
            />
          </div>
          {showDeleteListModal && (
            <div draggable={false}>
              <div className="fixed inset-0 bg-black opacity-5 z-40"></div>

              <div className="modal-delete-list dark:bg-gray-800 bg-white flex flex-col w-72 lg:w-96">
                <div className="flex items-center justify-between mb-4 w-full">
                  <div className="flex-1 ">
                    <p className=" text-gray-900 dark:text-gray-200 text-sm lg:text-base text-left">
                      Deleting a list is forever. There is no undo.
                    </p>
                  </div>
                  <IoMdClose
                    className="absolute right-1 top-1 w-7 h-7  text-gray-900 dark:text-gray-200 dark:hover:text-gray-500 hover:text-gray-400 cursor-pointer"
                    onClick={() => {
                      setShowDeleteListModal(false);
                      setCanDraggable(true);
                    }}
                  />
                </div>

                {listDeleting ? (
                  <div className="bg-red-500 text-black px-2 py-1 rounded-md w-full hover:bg-red-400 cursor-not-allowed animate-pulse flex items-center justify-center gap-3">
                    <TbProgress className="w-4 h-4 animate-spin text-red-900 lg:w-4 lg:h-4" />
                    <button className="text-sm lg:text-base">
                      Delete List
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={handleDeleteList}
                    className="bg-red-500 text-black px-2 py-1 rounded-md w-full hover:bg-red-400 cursor-pointer flex items-center justify-center gap-3"
                  >
                    <AiOutlineDelete className="w-4 h-4 lg:w-4 lg:h-4 text-red-900" />
                    <button className="text-sm lg:text-base">
                      Delete List
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* <p className="text-gray-200 text-2xl">{id}</p>
      <p className="text-gray-200 text-2xl">{index}</p>
      <p className="text-gray-200 text-2xl">{indexInList}</p> */}

      <Droppable droppableId={id} key={id} type="item">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-full min-h-1"
          >
            {db
              .sort((a, b) => a.indexInList - b.indexInList)
              .map((item) => {
                if (item.listID === id) {
                  return (
                    <div key={item.id} className="w-full h-full">
                      <ItemCard
                        title={title}
                        item={item}
                        onDeleteItem={onDeleteItem}
                        index={item.indexInList}
                        handleItemLeave={handleItemLeave}
                        handleItemOver={handleItemOver}
                        hoveredItemID={hoveredItemId}
                      />
                    </div>
                  );
                }
                return null;
              })}
            {provided.placeholder}
            {showInput ? (
              <div className="flex-col w-full p-1 z-50 text-sm" ref={inputRef}>
                <textarea
                  ref={addItemTextArea}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    _setTitle(e.target.value)
                  }
                  className="w-full p-3 rounded-lg mb-2 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="Add title for this card..."
                  value={_title}
                />
                <div className="flex  justify-start mb-2 h-10">
                  {_title === "" ? (
                    <button className="flex-1 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mr-2 px-7  dark:text-gray-400 cursor-not-allowed">
                      Add Card
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-blue-500 p-2 rounded-lg mr-2 px-7 text-white hover:bg-blue-600"
                      onClick={_addItem}
                    >
                      Add Card
                    </button>
                  )}
                  <IoCloseSharp
                    onClick={() => {
                      setShowInput(false);
                      _setTitle("");
                      setCanDraggable(true);
                    }}
                    className="text-gray-800 dark:text-gray-200 h-full w-8 lg:w-10 p-2 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  {
                    setShowInput(true);
                    setCanDraggable(false);
                  }
                }}
                className=" z-1 flex items-center  dark:text-gray-300  text-gray-900 text-left text-sm pl-3   border-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 cursor-pointer py-2 rounded-lg w-full"
              >
                <FaPlus className="mr-1 text-sm" />
                <p>Add a card</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;
