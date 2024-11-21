import { FC, useContext, useState } from "react";
import { InviteWithBoardDetails, MainContext } from "../context/Context";
import { PiSpinnerGap } from "react-icons/pi";

type Props = {
  boardDetails: InviteWithBoardDetails[];
  getUserInvitations: () => void;
};

const InvatiationCard: FC<Props> = ({ boardDetails, getUserInvitations }) => {
  const [loadingStates, setLoadingStates] = useState<{
    [inviteId: string]: {
      accepting?: boolean;
      rejecting?: boolean;
    };
  }>({});

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("no context");
  }

  const { approveInvite, user, deleteInvitation } = context;

  const _approveInvite = async (boardId: string, inviteId: string) => {
    if (!user) {
      return;
    }

    // "Accepting" state'i true yapılıyor
    setLoadingStates((prev) => ({
      ...prev,
      [inviteId]: { ...prev[inviteId], accepting: true },
    }));

    if (user.displayName && user.email) {
      await approveInvite(
        boardId,
        user?.uid,
        inviteId,
        user.email,
        user.displayName
      );
    }

    getUserInvitations();
    // İşlem bitince state'i false yap
    setLoadingStates((prev) => ({
      ...prev,
      [inviteId]: { ...prev[inviteId], accepting: false },
    }));
  };

  const _refuseInvite = async (id: string) => {
    // "Rejecting" state'i true yapılıyor
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], rejecting: true },
    }));

    const result = await deleteInvitation(id);
    if (result) {
      getUserInvitations();
    }

    // İşlem bitince state'i false yap
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], rejecting: false },
    }));
  };

  return (
    <div className="w-full">
      {boardDetails &&
        boardDetails.map((item) => {
          // const isAccepting = true;
          // const isRejecting = false;
          const isAccepting = loadingStates[item.invite.id]?.accepting;
          const isRejecting = loadingStates[item.invite.id]?.rejecting;

          return (
            <div
              key={item.invite.id}
              className="dark:bg-gray-700 bg-gray-100 mt-2 p-3 flex-col lg:flex items-start justify-between w-full rounded-md"
            >
              <p className="dark:text-gray-200 text-gray-800 text-sm lg:text-base text-left">
                <span className="font-bold">{item.invite.sender}</span> has
                invited you to join the board{" "}
                <strong className=" underline dark:text-gray-100 text-gray-800">
                  {item.boardDetails?.name}
                </strong>
              </p>
              {isAccepting ? (
                <div className="flex gap-2 text-sm lg:text-base mt-3">
                  <div className="w-32 flex items-center justify-center bg-gray-300   dark:bg-blue-500 px-5 py-1 dark:text-gray-100 rounded-md cursor-not-allowed animate-pulse">
                    <PiSpinnerGap className="animate-spin w-5 h-5" />
                  </div>
                  <button
                    className="w-32  px-5 py-1 dark:text-gray-100 text-gray-800 rounded-md"
                    disabled={isAccepting} // Accept ve Reject'in aynı anda çalışmasını engelle
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 text-sm lg:text-base mt-3">
                  <button
                    className="transition-all duration-200 ease-in-out w-32 text-white dark:bg-blue-500 bg-blue-500 px-5 py-1 dark:text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-600"
                    onClick={() =>
                      _approveInvite(item.boardDetails.id, item.invite.id)
                    }
                    disabled={isRejecting} // Accept ve Reject'in aynı anda çalışmasını engelle
                  >
                    Accept
                  </button>
                  {isRejecting ? (
                    <div className=" w-32 flex items-center justify-center bg-gray-300 px-5 py-1 text-slate-900 dark:bg-gray-600 rounded-md cursor-not-allowed animate-pulse">
                      <PiSpinnerGap className="text-slate-950 dark:text-gray-300 mr-1 animate-spin" />
                    </div>
                  ) : (
                    <button
                      className="transition-all duration-200 ease-in-out w-32   px-5 py-1 dark:text-gray-100 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:border-gray-400 dark:hover:bg-gray-600"
                      onClick={() => _refuseInvite(item.invite.id)}
                      disabled={isAccepting} // Accept ve Reject'in aynı anda çalışmasını engelle
                    >
                      Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default InvatiationCard;
