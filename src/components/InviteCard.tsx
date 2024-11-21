import { FC, useContext, useState } from "react";
import { Invite, MainContext } from "../context/Context";

import { MdCancelScheduleSend } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";

import { LuLoader } from "react-icons/lu";
import { ImCancelCircle } from "react-icons/im";

type Props = {
  invite: Invite;
  _getBoardInvites: () => void;
};

const InviteCard: FC<Props> = ({ invite, _getBoardInvites }) => {
  const [cancelInvButtonLoading, setCancelInvButtonLoading] =
    useState<boolean>(false);
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("no context");
  }

  const { deleteInvitation, handleNotification } = context;

  const cancelInvitation = async (invitationID: string) => {
    setCancelInvButtonLoading(true);
    const result = await deleteInvitation(invitationID);
    if (result) {
      console.log("Inv deleted");
      _getBoardInvites();
      handleNotification(
        `The invitation (${invite.email}) has been successfully canceled.`,
        true
      );
      setCancelInvButtonLoading(false);
    } else {
      console.log("delete basarisiz");
    }
  };

  return (
    <>
      {cancelInvButtonLoading ? (
        <div className="flex justify-between items-center w-full dark:bg-gray-700 bg-gray-300 rounded-md h-16 mb-1 lg:p-3 p-3">
          <div className="flex flex-col items-start justify-center dark:text-gray-200 text-gray-800 w-full">
            <p className="text-sm lg:text-base">{invite.email}</p>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <FaRegClock className="mr-1" />
                <p className="text-xs lg:text-base">Pending...</p>
              </div>
              <div className="lg:hidden">
                <LuLoader className="  text-gray-100 w-5 h-5 " />
              </div>
            </div>
          </div>
          <div className="transition-all duration-200 ease-in-out hidden lg:flex items-center rounded-md cursor-not-allowed  bg-red-500 hover:bg-red-600 text-white py-1 px-3">
            <LuLoader className="mr-1 text-md animate-spin" />
            <button>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex  justify-between items-center w-full dark:bg-gray-700 bg-gray-300  rounded-md h-16 mb-1 lg:p-3 p-3">
          <div className="flex flex-col items-start justify-center dark:text-gray-200 text-gray-800 w-full">
            <p className="text-sm lg:text-base">{invite.email}</p>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <FaRegClock className="mr-1" />
                <p className="text-xs lg:text-base">Pending...</p>
              </div>
              <div className="lg:hidden">
                <MdCancelScheduleSend
                  className="  text-gray-100 w-5 h-5 "
                  onClick={() => cancelInvitation(invite.id)}
                />
              </div>
            </div>
          </div>

          <div
            className="transition-all duration-200 ease-in-out hidden lg:flex items-center rounded-md cursor-pointer bg-red-500 hover:bg-red-600  py-1 px-3 text-white "
            onClick={() => cancelInvitation(invite.id)}
          >
            <ImCancelCircle className="text-md" />
            <p className="text-md ml-1 text-md ">Cancel</p>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteCard;
