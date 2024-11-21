import { FC, useContext, useEffect, useState } from "react";
import { BoardUsersType, Invite, MainContext } from "../context/Context";
import { AiOutlineLoading, AiOutlineUserAdd } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

import InviteCard from "./InviteCard";
import { User } from "firebase/auth";
import InvFriendsListCard from "./InvFriendsListCard";
import { PiUsers } from "react-icons/pi";
import { RiSendPlaneFill } from "react-icons/ri";

type Props = {
  boardID: string;
  type: string;
};

const InviteFriends: FC<Props> = ({ boardID, type }) => {
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const [inviteButtonLoading, setInviteButtonLoading] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [boardUsers, setBoardUsers] = useState<BoardUsersType[]>([]);
  const [boardInvites, setBoardInvites] = useState<Invite[]>([]);
  const [_user, _setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("no context");
  }

  const {
    sendInvitation,
    getBoardInvites,
    user,
    handleNotification,
    getBoardUsers,
    checkUserIsBoardAdmin,
  } = context;

  useEffect(() => {
    _setUser(user);
    _checkIsAdmin();
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = () => {
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
    } else {
      setMessage(null);
    }
  };

  useEffect(() => {
    _getBoardInvites();
  }, [showModal]);

  const _sendInvitation = async () => {
    if (!user?.displayName) {
      return;
    }

    if (user.email === email) {
      setMessage("You’re already the admin of this board!");
      return;
    }

    if (validateEmail(email)) {
      setInviteButtonLoading(true);
      const result = await sendInvitation(email, boardID, user?.displayName);
      setInviteButtonLoading(false);
      setEmail("");
      setMessage(null);
      _getBoardInvites();
      handleNotification(result, true);
    } else {
      handleChange();
    }
  };

  const _getBoardInvites = async () => {
    const _invites = await getBoardInvites(boardID);
    let _boardInvites: Invite[] = [];
    _invites.map((invite) => {
      return (
        invite.boardID === boardID &&
        invite.isApproved === false &&
        _boardInvites.push(invite)
      );
    });

    setBoardInvites(_boardInvites);
    console.log(_boardInvites);
  };

  useEffect(() => {
    _getBoardUsers();
    console.log("useeffect calisti");
  }, [showModal]);

  const _getBoardUsers = async () => {
    console.log("get board isleniyor");

    const result = await getBoardUsers(boardID);
    console.log(result);

    setBoardUsers(result);
  };

  const _checkIsAdmin = async () => {
    if (!user) return;
    const result = await checkUserIsBoardAdmin(boardID, user?.uid);
    setIsAdmin(result);
  };

  return (
    <div>
      {!showModal && type === "board" && (
        <div
          className="transition-all duration-200 ease-in-out  flex items-center hover:bg-gray-800 bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500 dark:text-gray-900 rounded-md m-2 py-2 px-4 text-gray-300 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <AiOutlineUserAdd className="text-gray-300 dark:text-gray-900  text-md mr-2" />
          {isAdmin ? (
            <button className="text-md">Add Team Members</button>
          ) : (
            <button className="text-md">Team Members</button>
          )}
        </div>
      )}
      {!showModal && type === "mobile-board" && (
        <div
          className="flex items-center hover:bg-gray-800 bg-gray-900 rounded-md m-2 py-2 px-4 text-gray-300 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {isAdmin ? (
            <AiOutlineUserAdd className="text-gray-300 text-md" />
          ) : (
            <PiUsers className="text-gray-300 text-md" />
          )}
        </div>
      )}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-all duration-200 ease-in-out pointer-events-none ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
        ></div>
        <div
          className={`${
            showModal ? "opacity-100 scale-100" : "opacity-0 scale-0"
          } transition-all duration-200 ease-in-out p-2 bg-gray-200 dark:bg-gray-900 backdrop-blur-3xl border dark:border-gray-600 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[325px] lg:w-[600px] h-auto   shadow-lg  lg:p-3 flex flex-col justify-start items-start z-[1000] rounded-lg`}
        >
          <div className="flex justify-between items-center w-full">
            {isAdmin ? (
              <p className="text-md ml-1 dark:text-gray-400 text-slate-800  font-semibold">
                ADD TEAM MEMBERS
              </p>
            ) : (
              <p></p>
            )}
            <IoMdClose
              className="dark:text-gray-400 text-gray-800 hover:bg-gray-300 hover:rounded-lg dark:hover:bg-gray-600 cursor-pointer lg:w-8 lg:h-8 w-6 h-6"
              onClick={() => setShowModal(false)}
            />
          </div>
          {isAdmin ? (
            <div className="flex gap-1 my-4 justify-between w-full h-10">
              <input
                className="flex-1 p-3 dark:text-gray-400 text-gray-800 bg-gray-100 dark:bg-gray-700  rounded-md text-sm lg:text-base"
                placeholder="Enter email address..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              {inviteButtonLoading ? (
                <div className="flex items-center justify-center w-9 lg:w-20">
                  <AiOutlineLoading className=" h-full w-9  dark:text-gray-400 text-gray-800 rounded-md animate-spin" />
                </div>
              ) : (
                <>
                  <div className="lg:hidden">
                    <RiSendPlaneFill
                      className="dark:bg-blue-500 h-full w-9 dark:text-gray-400 p-1 rounded-md"
                      onClick={_sendInvitation}
                    />
                  </div>
                  <button
                    className="transition-all duration-200 ease-in-out  hidden lg:block  text-gray-200 bg-blue-500 hover:bg-blue-400 px-2 py-1 w-20 rounded-md lg:text-base"
                    onClick={_sendInvitation}
                  >
                    Invite
                  </button>
                </>
              )}
            </div>
          ) : (
            ""
          )}
          <p className="dark:text-red-500">{message}</p>
          {isAdmin && boardInvites.length > 0 && (
            <div className="w-full mt-3">
              <p className="dark:text-gray-400 text-gray-800 mb-1 pl-1 mt-3 text-left font-bold text-sm">
                PENDING INVITATIONS
              </p>
              {boardInvites &&
                boardInvites.map((invite) => {
                  return invite.isApproved === false ? (
                    <InviteCard
                      invite={invite}
                      _getBoardInvites={_getBoardInvites}
                    />
                  ) : (
                    <></>
                  );
                })}
            </div>
          )}
          {/* {invites.length > 0 && (
            <div className="w-full">
              <p className="text-gray-100 text-lg mb-3">Waiting Invites</p>
              {invites &&
                invites.map((invite) => {
                  return invite.isApproved === false ? (
                    <InviteCard
                      invite={invite}
                      _getBoardInvites={_getBoardInvites}
                    />
                  ) : (
                    <></>
                  );
                })}
            </div>
          )} */}
          {boardUsers && boardUsers.length > 0 && (
            <div className="w-full mt-3">
              <p className="dark:text-gray-400 mb-1 pl-1 mt-3 text-left font-bold text-sm">
                TEAM MEMBERS
              </p>
              {boardUsers &&
                boardUsers
                  .sort((a, b) => a.role - b.role)
                  .map((member) => {
                    return (
                      <InvFriendsListCard
                        member={member}
                        boardID={boardID}
                        _getBoardUsers={_getBoardUsers}
                      />
                    );
                  })}
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default InviteFriends;
