import { FC, useContext, useEffect } from "react";
import { MainContext } from "../context/Context";
import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

type Props = {
  boardID: string;
  handleBoardIsFav?: (result: boolean) => void;
  type?: string;
};

const ToggleFav: FC<Props> = ({ boardID, handleBoardIsFav, type }) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { toggleFavBoard, user, getIsBoardFav, setFavBoardsIDS, fav, setFav } =
    context;

  useEffect(() => {
    const fetchBoardFavStatus = async () => {
      if (user?.email) {
        const result = await getIsBoardFav(boardID, user.email);
        if (handleBoardIsFav) {
          handleBoardIsFav(result);
        }
        setFav((prevFav) => ({
          ...prevFav,
          [boardID]: result,
        }));
      }
    };

    fetchBoardFavStatus();
  }, []);

  const handleFav = async () => {
    console.log("Handle Fav");

    if (user?.email) {
      // Firebase'deki favori durumu güncelle
      const result = await toggleFavBoard(boardID, user.uid);

      if (result) {
        // Eğer işlem başarılı olursa UI'yi güncelle
        setFav((prevFav) => ({
          ...prevFav,
          [boardID]: !prevFav[boardID],
        }));

        // Local favBoardsIDS güncelle
        setFavBoardsIDS((prevFavBoardsIDS) => {
          if (!prevFavBoardsIDS) return [boardID]; // Eğer null ise, yeni bir dizi oluştur

          return prevFavBoardsIDS.includes(boardID)
            ? prevFavBoardsIDS.filter((board) => board !== boardID)
            : [...prevFavBoardsIDS, boardID];
        });

        console.log("Islem basarili");
      } else {
        console.log("Hata olustu");
      }
    }
  };

  return (
    <div onClick={handleFav} className="star-icon w-fit">
      {fav[boardID] ? (
        <FaStar
          className={`text-gray-100 dark:text-gray-300 hover:scale-110 ${
            type === "card" && "text-gray-100"
          } ${type === "navbar-menu" && "text-gray-600 hover:text-gray-800 "} ${
            type === "board-detail" && "text-gray-800 hover:text-gray-800 "
          }`}
        />
      ) : (
        <FiStar
          className={`text-gray-100 dark:text-gray-300  hover:scale-110 ${
            type === "board-detail" && "text-gray-800 hover:text-gray-800 "
          } `}
        />
      )}
    </div>
  );
};

export default ToggleFav;
