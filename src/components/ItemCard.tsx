import { FC, useContext, useEffect, useRef, useState } from "react";
import { Item, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";

import ItemCardDescription from "./ItemCardDescription";
import ItemCardComments from "./ItemCardComments";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

import { ImParagraphLeft } from "react-icons/im";
import { GrArticle } from "react-icons/gr";
import { Draggable } from "@hello-pangea/dnd";
import { TbProgress } from "react-icons/tb";

type Props = {
  item: Item;
  title: string;
  onDeleteItem: () => void;
  index: number;
  handleItemOver: (itemID: string) => void;
  handleItemLeave: (itemID: string) => void;
  hoveredItemID: string | null;
};

const ItemCard: FC<Props> = ({
  item,
  index,
  title,
  onDeleteItem,
  handleItemOver,
  handleItemLeave,
  hoveredItemID,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const [isCardEdit, setIsCardEdit] = useState<boolean>(false);
  const [_cardTitle, _setCardTitle] = useState<string>("");
  const [cardHeight] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [showCardDeleteModal, setShowCardDeleteModal] =
    useState<boolean>(false);

  const [isDeletingCard, setIsDeletingCard] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  useEffect(() => {
    if (showModal) {
      setCanDraggable(false);
    } else {
      setCanDraggable(true);
    }
  }, [showModal]);

  const {
    updateItemTitle,
    db,
    setDB,
    deleteItem,
    canDraggable,
    setCanDraggable,
    itemDragging,
  } = context;

  const onBlur = async () => {
    setIsCardEdit(false);
    const prevTitle = item.title;

    setDB(db.map((i) => (i.id === item.id ? { ...i, title: _cardTitle } : i)));

    const result = await updateItemTitle(item.id, _cardTitle);

    if (!result) {
      setDB(db.map((i) => (i.id === item.id ? { ...i, title: prevTitle } : i)));
    }
  };

  const onFocus = () => {
    // Edit mode başladığında _cardTitle state'ini item.title ile doldur
    _setCardTitle(item.title);
  };

  const handleDeleteCard = async () => {
    setIsDeletingCard(true);
    console.log("delete card");
    const result = await deleteItem(item.id, item.listID);

    if (result) {
      setShowCardDeleteModal(false);
      setCanDraggable((prev) => !prev);
      onDeleteItem();
      setIsDeletingCard(false);
    }
  };

  const onCardItemDataChanged = () => {
    onDeleteItem();
  };

  useEffect(() => {
    if (isCardEdit) {
      setCanDraggable(false);
    } else {
      setCanDraggable(true);
    }
  }, [isCardEdit]);

  return (
    <div draggable={canDraggable}>
      {showCardDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-5 z-40"></div>
          <div className="modal-delete-list dark:bg-gray-800 bg-white flex flex-col">
            <div className="flex items-center justify-between mb-3 w-full">
              <p className=" dark:text-gray-200 text-gray-800">
                Deleting a card is forever. There is no undo.
              </p>
              <IoMdClose
                className="dark:text-gray-200 dark:hover:text-gray-400  cursor-pointer w-7 h-7 absolute top-1 right-1"
                onClick={() => {
                  setShowCardDeleteModal(false);
                  setCanDraggable((prev) => !prev);
                }}
              />
            </div>

            {isDeletingCard ? (
              <div className="bg-red-500 text-black px-2 py-1 rounded-md w-full hover:bg-red-400 cursor-not-allowed animate-pulse flex items-center justify-center gap-3">
                <TbProgress size={24} className=" animate-spin text-red-900" />
                <button>Delete Card</button>
              </div>
            ) : (
              <div
                onClick={handleDeleteCard}
                className="bg-red-500 text-black px-2 py-1 rounded-md w-full hover:bg-red-400 cursor-pointer flex items-center justify-center gap-3"
              >
                <AiOutlineDelete className=" text-red-900" />
                <button>Delete Card</button>
              </div>
            )}
          </div>
        </>
      )}
      <div
        className={`fixed inset-0 bg-black/50 transition-all duration-300 pointer-events-none ease-in-out z-[400] ${
          showModal ? "opacity-100 " : "opacity-0 "
        }`}
      ></div>
      <div
        className={`flex flex-col w-full relative ${
          !showModal && "cursor-pointer"
        }  `}
        onMouseOver={() => handleItemOver(item.id)}
        onMouseLeave={() => handleItemLeave(item.id)}
      >
        <div
          draggable={!showModal}
          className={`${
            showModal
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          } transition-all duration-300 ease-in-out fixed inset-0 z-[401] transform origin-center`}
        >
          <div
            draggable={!showModal}
            className="backdrop-blur-md bg-white/90 dark:bg-gray-900 border border-slate-400 dark:border-gray-700 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[325px] max-h-[90vh] lg:w-[650px] shadow-lg p-2 lg:p-6 flex  z-50 rounded-md overflow-y-auto
               flex-col items-start justify-start"
            ref={detailsRef}
          >
            <IoCloseSharp
              className="modal-close-icon text-gray-800  hover:rounded-lg dark:hover:bg-gray-300 dark:text-gray-300 dark:hover:text-gray-700 lg:w-8 lg:h-8 w-6 h-6"
              onClick={() => {
                setShowModal(false);
              }}
            />

            <div className="flex justify-center items-start mt-8">
              <GrArticle className="lg:mt-[7px] mt-1 lg:w-4 lg:h-4 lg:min-w-4 lg:min-h-4 w-3 h-3 min-w-3 min-h-3 text-gray-800 dark:text-gray-400" />
              <div className="flex flex-col items-start ml-2 ">
                <h1 className="lg:text-lg text-sm text-gray-800 dark:text-gray-400  text-left">
                  {item.title}
                </h1>
                <div className="flex items-center justify-start">
                  <h2 className="text-gray-800 dark:text-gray-400 text-sm lg:text-base">
                    In list -{" "}
                  </h2>
                  <p className="font-extrabold text-slate-500 underline ml-1 text-sm lg:text-base">
                    {title}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mt-8">
              <ItemCardDescription
                item={item}
                onCardItemDataChanged={onCardItemDataChanged}
              />
            </div>
            <div className="w-full mt-8">
              <ItemCardComments item={item} />
            </div>
          </div>
        </div>
        <div
          className={`flex absolute top-0 right-0 mt-2 mr-2 gap-2 transition-all duration-700 duration-100  ease-in-out ${
            hoveredItemID === item.id ? "opacity-100" : "opacity-0"
          }`}
        >
          {!itemDragging && hoveredItemID === item.id && !isCardEdit && (
            <>
              <div onClick={() => setIsCardEdit(true)}>
                <MdOutlineModeEdit
                  size={16}
                  className=" dark:text-gray-300 rounded-full w-6 h-6 p-1 bg-gray-500 text-gray-100  hover:bg-gray-600 hover:text-gray-200 cursor-pointer transition-all duration-200 "
                />
              </div>
              <div
                onClick={() => {
                  setShowCardDeleteModal(true);
                  setCanDraggable(false);
                }}
              >
                <AiOutlineDelete
                  size={16}
                  className=" dark:text-gray-300 rounded-full w-6 h-6 p-1 bg-gray-500 text-gray-100  hover:bg-gray-600 hover:text-gray-200 cursor-pointer transition-all duration-200"
                />
              </div>
            </>
          )}
        </div>

        <Draggable draggableId={item.id} index={index} key={item.id}>
          {(provider) => (
            <div
              onClick={() => {
                !isCardEdit && setShowModal(true);
              }}
              ref={provider.innerRef}
              {...provider.draggableProps}
              {...provider.dragHandleProps}
              className="text-gray-800 dark:text-gray-300 m-1 border  border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-800 rounded-md p-3 hover:border hover:border-slate-300 hover:rounded-lg shadow-2xl"
            >
              {isCardEdit ? (
                <textarea
                  className="text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 text-left text-sm  z-50 w-full"
                  style={{ height: `${cardHeight}px` }}
                  value={_cardTitle}
                  onChange={(e) => _setCardTitle(e.target.value)}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Enter'ın yeni satır oluşturmasını engelle
                      onBlur();
                    }
                  }}
                />
              ) : (
                <div>
                  <div ref={cardRef} className="w-full">
                    {/* <p className="text-sm text-green-300">
                      Index In List{item.indexInList}
                    </p> */}
                    <p className="text-left text-sm">{item.title}</p>

                    {/* <p className="text-sm text-red-900">
                      Item Index{item.itemIndex}
                    </p> */}
                  </div>
                  <div>
                    {item.desc && item.desc.length > 0 && (
                      <ImParagraphLeft size={12} className="mt-2" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Draggable>
      </div>
    </div>
  );
};

export default ItemCard;
