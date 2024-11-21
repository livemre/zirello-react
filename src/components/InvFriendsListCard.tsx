import { FC, useContext, useEffect, useState } from "react";
import {
  BoardUsersType,
  MainContext,
  UserPublicDataType,
} from "../context/Context";
import { IoPersonRemoveOutline } from "react-icons/io5";

import { PiSignOut, PiSignOutFill } from "react-icons/pi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { TbProgress } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

type Props = {
  member: BoardUsersType;
  boardID: string;
  _getBoardUsers: () => void;
};

const InvFriendsListCard: FC<Props> = ({ member, boardID, _getBoardUsers }) => {
  const [publicData, setPublicData] = useState<UserPublicDataType[] | null>(
    null
  );
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [leavingBoard, setLeavingBoard] = useState<boolean>(false);
  const [removeMemberLoading, setRemoveMemberLoading] =
    useState<boolean>(false);
  const [leaveBoardDeleteModal, setLeaveBoardDeleteModal] = useState(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const navigate = useNavigate();

  const {
    user,
    getUserPublicData,
    checkUserIsBoardAdmin,
    removeMemberFromBoard,
    leaveFromBoard,
  } = context;

  const _removeMemberFromBoard = async () => {
    setRemoveMemberLoading(true);
    const result = await removeMemberFromBoard(boardID, member.user);
    if (result) {
      console.log("Listeden cikarildi");
      _getBoardUsers();
      setRemoveMemberLoading(false);
    } else {
      console.log("Sorun olustu");
    }
  };

  const _checkUserIsBoardAdmin = async () => {
    if (!user) {
      return;
    }
    const result = await checkUserIsBoardAdmin(boardID, user.uid);
    setUserIsAdmin(result);
  };

  useEffect(() => {
    _checkUserIsBoardAdmin();
  }, [user]);

  useEffect(() => {
    _getUserPublicData(member.email);
  }, [member]);

  const _getUserPublicData = async (email: string) => {
    const result = await getUserPublicData(email);

    setPublicData(result);
  };

  const _leaveBoard = async () => {
    if (user) {
      setLeavingBoard(true);
      const result = await leaveFromBoard(boardID, user.uid);
      console.log("Leave Result " + result);
      if (result) {
        _getBoardUsers();
        setLeavingBoard(false);
        navigate("/boards");
      }
    }
  };

  return (
    <div className="flex justify-between items-center w-full bg-gray-300   dark:bg-gray-800 py-3  rounded-md mb-1 p-3">
      <div className="flex items-center gap-2">
        {publicData &&
          publicData.map((user) => (
            <img
              src={user?.photoURL}
              width={26}
              height={26}
              className="rounded-full w-7 h-7 lg:h-9 lg:w-9"
            />
          ))}
        {publicData === null && (
          <div className="w-7 h-7 min-w-7 min-h-7 lg:w-9 lg:h-9 lg:min-w-9 lg:min-h-9 animate-pulse bg-gray-400 rounded-full"></div>
        )}
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm lg:text-base dark:text-gray-200 text-gray-900 ">
            {member.email}
          </p>
          <div className="flex items-center">
            <div className="flex items-center text-sm lg:text-base">
              <p className="dark:text-gray-200 text-gray-900 text-xs lg:text-base">
                {member.displayName} {member.email === user?.email && "(You)"}
              </p>
              <p className="dark:text-gray-200 text-gray-900 text-xs lg:text-base ml-1">
                {member.role === 0 ? " - Admin" : " - Editor"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {member.role === 1 && member.email === user?.email && (
        <>
          {leavingBoard ? (
            <button
              disabled={!leaveBoardDeleteModal}
              className="transition-all duration-200 ease-in-out hidden lg:flex items-center py-1 px-3 bg-red-500  hover:bg-red-600 text-white  rounded-md cursor-pointer "
            >
              <AiOutlineLoading3Quarters className="lg:w-4 lg:h-4 mr-2 animate-spin text-white " />
              <p>Leave Board</p>
            </button>
          ) : (
            <button
              className="transition-all duration-200 ease-in-out  hidden lg:flex items-center py-1 px-3  rounded-md cursor-pointer bg-red-500  hover:bg-red-600 text-white   "
              onClick={() => setLeaveBoardDeleteModal(true)}
            >
              <PiSignOut className="lg:w-4 lg:h-4 mr-2" />
              <p>Leave Board</p>
            </button>
          )}

          <div
            className={`flex flex-col dark:bg-gray-900 bg-gray-200  dark:text-gray-300 text-gray-900   bottom-20 -right-20 border absolute border-gray-500 border-opacity-40  rounded-md w-fit p-3 justify-center items-center transition-all duration-200 ease-in-out shadow-5xl
              ${
                leaveBoardDeleteModal
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              }`}
          >
            <p className="mb-3 self-start font-semibold">Leave Board</p>
            <p className="mb-3">Are you sure you want to leave this board?</p>
            <div className="flex gap-10">
              <button
                className=" text-white py-1 bg-blue-500 px-5 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out"
                onClick={_leaveBoard}
              >
                Leave
              </button>
              <button
                className="dark:hover:bg-gray-700 hover:bg-gray-300 transition-all duration-200 px-5 py-1 rounded-md"
                onClick={() => setLeaveBoardDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
            <div className="absolute bg-gray-200 dark:bg-gray-900 border-r border-b border-gray-500 border-opacity-40 rounded-sm  w-4 h-4 rotate-45 -bottom-2"></div>
          </div>

          {leavingBoard ? (
            <AiOutlineLoading3Quarters className="lg:hidden w-4 h-4 mr-2 animate-spin text-gray-400" />
          ) : (
            <PiSignOutFill
              className="lg:hidden dark:text-gray-100 text-gray-900 w-5 h-5 mr-2"
              onClick={_leaveBoard}
            />
          )}
        </>
      )}
      {member.role === 1 && userIsAdmin && (
        <>
          {removeMemberLoading ? (
            <TbProgress className="w-5 h-5 lg:hidden  animate-spin text-gray-400" />
          ) : (
            <div className="lg:hidden">
              <IoPersonRemoveOutline
                className="text-gray-100 w-5 h-5"
                onClick={_removeMemberFromBoard}
              />
            </div>
          )}
          {removeMemberLoading ? (
            <button
              className="hidden lg:flex items-center py-1 px-3  rounded-md cursor-pointer bg-red-500 hover:bg-red-600 text-white "
              onClick={_removeMemberFromBoard}
            >
              <TbProgress className="w-5 h-5 mr-2 animate-spin text-white" />
              <p>RemoveMember</p>
            </button>
          ) : (
            <button
              className="transition-all duration-200 ease-in-out  hidden lg:flex items-center py-1 px-3  rounded-md cursor-pointer  bg-red-500 hover:bg-red-600 text-white"
              onClick={_removeMemberFromBoard}
            >
              <IoPersonRemoveOutline className="w-5 h-5 mr-2" />
              <p>Remove Member</p>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default InvFriendsListCard;
