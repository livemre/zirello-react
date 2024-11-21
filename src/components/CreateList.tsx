import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { MainContext } from "../context/Context";

type Props = {
  boardID: string;
};

const CreateList: FC<Props> = ({ boardID }) => {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState<string>("");

  const addListInputRef = useRef<HTMLInputElement | null>(null);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { addList, lists, handleNotification } = context;

  useEffect(() => {
    if (inputRef && addListInputRef.current) {
      addListInputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    const onOutisdeClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        console.log("Disariya tiklandi");
        setShowInput(false);
      }
    };

    document.addEventListener("click", onOutisdeClick);

    return () => {
      document.removeEventListener("click", onOutisdeClick);
    };
  }, []);

  const prepareList = () => {
    console.log("prepare");
    setShowInput((prev) => !prev);
  };

  const _addList = async () => {
    setShowInput(false);
    const listSize = lists.length;
    const result = await addList(title, boardID, listSize);

    setTitle("");

    if (result) {
      handleNotification(`New List (${title}) has been created!`, true);
    }
  };

  if (showInput) {
    return (
      <div
        className="flex-col items-start justify-start w-56 lg:w-72 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg h-fit text-sm"
        ref={inputRef}
      >
        <input
          ref={addListInputRef}
          className="bg-gray-200 p-3 text-gray-800 dark:text-gray-300 dark:bg-gray-700 flex w-full rounded-lg mb-2"
          placeholder="Add list title..."
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          value={title}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              _addList();
              console.log("DOWWWN");
            }
          }}
        />

        <div className="flex justify-between items-center w-full gap-1 h-10">
          {title === "" ? (
            <button className="bg-gray-200 dark:bg-gray-400  w-full h-full flex-1 rounded-lg text-gray-900 cursor-not-allowed">
              Add List
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 w-full h-full flex-1 rounded-lg text-white"
              onClick={_addList}
            >
              Add List
            </button>
          )}
          <IoCloseSharp
            onClick={prepareList}
            className="text-gray-900 h-full w-8 lg:w-10 p-2 dark:text-gray-200 dark:hover:bg-gray-800  rounded-md hover:bg-gray-200 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={prepareList}
      className=" brightness-110  w-56 lg:w-72 flex bg-white/40 backdrop-blur-3xl items-center justify-start p-3 gap-2 hover:brightness-105 rounded-lg cursor-pointer h-fit shadow-2xl"
    >
      <CiSquarePlus size={16} className="pointer-events-none text-gray-900" />
      <p className="text-sm text-gray-900 pointer-events-none ">
        Add another list
      </p>
    </div>
  );
};

export default CreateList;
