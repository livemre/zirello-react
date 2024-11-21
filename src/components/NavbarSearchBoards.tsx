import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Board, MainContext } from "../context/Context";
import { Link } from "react-router-dom";

type SearchType = {
  type: string;
  setShowMobileSearchDiv?: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarSearchBoards: FC<SearchType> = ({
  type,
  setShowMobileSearchDiv,
}) => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState(false);
  const [term, setTerm] = useState<string>("");
  const [filteredBoards, setFilteredBoards] = useState<Board[]>();
  const [isLinkClicked, setIsLinkClicked] = useState(false);

  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { boards, teamBoards } = context;

  useEffect(() => {
    if (type === "mobile" && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
      console.log("Focus olmasi lazim");
    }
  }, [type]);

  useEffect(() => {
    handleSearch();
  }, [term]);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    if (!isLinkClicked) {
      // Eğer Link'e tıklanmadıysa blur işlemini gerçekleştir
      setTimeout(() => {
        setFocus(false);
        setTerm("");
      }, 100); // Küçük bir gecikme ekleyin
    }
  };

  const handleSearch = () => {
    if (term.length > 2) {
      const filteted = [...boards, ...teamBoards].filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );

      console.log(filteted);

      setFilteredBoards(filteted);
    } else {
      setFilteredBoards([]);
    }
  };

  const handleLinkClick = () => {
    setIsLinkClicked(true);
    setTimeout(() => {
      setIsLinkClicked(false);
      setTerm("");
    }, 100);
  };

  if (type === "mobile") {
    return (
      <>
        <div
          className={`w-52 flex border  border-gray-400 rounded-md relative py-1 items-center   `}
          ref={mobileSearchRef}
        >
          <IoSearchSharp className="text-gray-800 dark:text-gray-400 absolute pointer-events-none ml-1 text-sm" />
          <input
            className={` w-full text-sm bg-transparent text-gray-800 dark:text-gray-400 pl-8`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTerm(e.target.value)
            }
            value={term}
            placeholder="Search board..."
          />
        </div>
        {filteredBoards && term.length > 2 && (
          <div className="absolute left-0 top-12 bg-white dark:bg-gray-800 w-full z-50  min-w-full mt-2  max-h-60 overflow-auto p-1 ">
            {term !== "" && filteredBoards && filteredBoards.length > 0 ? (
              filteredBoards.map((item) => (
                <Link
                  to={`/board/${item.id}`}
                  key={item.id}
                  onMouseDown={handleLinkClick}
                  onClick={() => {
                    if (setShowMobileSearchDiv) setShowMobileSearchDiv(false);
                  }}
                >
                  <div className="flex items-center p-1 hover:bg-gray-200 bg-white dark:bg-gray-700 m-1">
                    <img
                      src={item.bgImage}
                      className="w-8 h-6 m-w-8 min-h-6 rounded-md"
                      alt="board bg"
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-gray-800 dark:text-gray-300 ml-2 mb-0 text-sm">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-800 dark:text-gray-400 p-4 text-sm">
                Sorry, we couldn’t find any boards related to ‘{term}’.
              </p>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`hidden lg:flex border rounded-md relative py-1 border-opacity-20 transition-all duration-300  ease-in-out  ${
        focus
          ? "w-full flex-1 ml-10 border-gray-900 dark:border-blue-400   "
          : " border-gray-900 dark:border-gray-500  "
      } `}
      ref={searchRef}
    >
      <IoSearchSharp
        size={24}
        className={`text-gray-800 dark:text-gray-400 absolute pointer-events-none ml-1 ${
          focus && "animate-pulse"
        } `}
      />
      <input
        className={`bg-transparent focus:outline-none text-gray-800 dark:text-gray-300 placeholder-gray-700 dark:placeholder-gray-500 ${
          focus ? "pl-8" : " pl-8"
        }`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
        value={term}
        placeholder="Search board..."
      />
      {focus && term.length > 2 && filteredBoards && (
        <div className="absolute mt-9 bg-white dark:bg-gray-800 w-full z-50 rounded-md border-opacity-20 border border-gray-500 min-w-full  max-h-60 overflow-auto p-1">
          {filteredBoards && filteredBoards.length > 0 ? (
            filteredBoards.map((item) => (
              <Link
                to={`/board/${item.id}`}
                key={item.id}
                onMouseDown={handleLinkClick}
                onClick={() => {
                  setFocus(false);
                }}
              >
                <div className="flex items-center p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <img
                    src={item.bgImage}
                    className="w-12 h-10 m-w-12 min-h-8 rounded-md"
                    alt="board bg"
                  />
                  <div className="flex flex-col items-start">
                    <p className="text-gray-800 dark:text-gray-200 ml-2 mb-0">
                      {item.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-800 dark:text-gray-400 p-4">
              Sorry, we couldn’t find any boards related to ‘{term}’.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearchBoards;
