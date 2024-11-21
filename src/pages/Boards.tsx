import { useContext, useEffect, useState } from "react";
import {
  Invite,
  InviteWithBoardDetails,
  MainContext,
} from "../context/Context";

import BoardCard from "../components/BoardCard";
import LeftMenu from "../components/LeftMenu";
import CreateBoardButton from "../components/CreateBoardButton";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaLongArrowAltDown,
  FaStar,
} from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import InvatiationCard from "../components/InvatiationCard";
import { IoPeople } from "react-icons/io5";
import UserImg from "../assets/user.png";
import NavbarSkeleton from "../components/skeleton/NavbarSkeleton";

import CardSkeleton from "../components/skeleton/CardSkeleton";
import GenerateData from "../GenerateData";

const Boards2 = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [boardDetails, setBoardDetails] = useState<InviteWithBoardDetails[]>(
    []
  );
  const [isIntivationsShow, setIsIntivationsShow] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const {
    user,
    getBoards,
    boards,
    getUserInvitations,
    getBoardAllDetails,
    getTeamBoards,
    teamBoards,
    getUserStarredBoards,
    favBoardsIDS,
  } = context;

  useEffect(() => {
    if (user) setProfileImg(user?.photoURL);
  }, [user]);

  const _getTeamBoards = async () => {
    if (user === null || user === undefined) {
      return;
    }
    await getTeamBoards(user?.uid);
  };

  const _getBoards = async () => {
    if (user === null) return;
    if (user.email) {
      await getUserStarredBoards(user.uid);

      await getBoards(user.uid);
      setLoading(false);
    }
  };

  useEffect(() => {
    _getBoards();
    _getTeamBoards();
    console.log("get boards ve team boards cekildi");
    console.log(teamBoards);
  }, [user]);

  useEffect(() => {
    if (!loading) {
      _getUserInvitations();
    }
  }, [loading]);

  const _getUserInvitations = async () => {
    console.log("get user inv calisti");

    if (!user?.email) return;

    const result: Invite[] = await getUserInvitations(user.email);
    console.log(result);

    const allDetails = await Promise.all(
      result.map(async (item) => {
        let _boardDetails = await getBoardAllDetails(item.boardID);
        return {
          invite: item,
          boardDetails: _boardDetails,
        };
      })
    );

    setBoardDetails(() => [
      ...allDetails.filter(
        (detail): detail is InviteWithBoardDetails =>
          detail.boardDetails !== null && detail.invite.isApproved !== true
      ),
    ]);
  };

  const handleImgError = () => {
    console.log("Image error");

    // setProfileImg(
    //   "https://plus.unsplash.com/premium_photo-1729581091962-8da050639694?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // );

    setProfileImg(UserImg);
  };

  if (loading) {
    return (
      <div className="flex gap-4 dark:bg-gray-800 bg-gray-200 h-[calc(100vh-3rem)] items-start pt-2 w-full ">
        <div className="h-full hidden dark:bg-gray-800 md:flex flex-col justify-between p-1 px-5 w-60 min-w-60 border-r border-gray-300 dark:border-gray-700 ">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <NavbarSkeleton w="32" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="32" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="40" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="24" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="32" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="40" />
            </div>
            <div className="flex gap-2">
              <NavbarSkeleton w="10" />
              <NavbarSkeleton w="24" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start h-full gap-3 px-3  w-full ">
          <div className="flex flex-col w-full gap-3">
            <div className="p-1">
              <CardSkeleton h="7" w="56" />
            </div>
            <div className="flex w-full flex-wrap">
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className="w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full my-10">
            <div className="flex gap-2 items-center">
              <div className="p-1">
                <CardSkeleton h="10" w="10" rounded="full" />
              </div>
              <div className="p-1">
                <CardSkeleton h="7" w="56" />
              </div>
            </div>
            <div className="flex w-full flex-wrap">
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>

              <div className="w-1/2 md:w-52">
                <div className="w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="p-1">
              <CardSkeleton h="7" w="32" />
            </div>
            <div className="flex w-full flex-wrap">
              <div className="w-1/2 md:w-52">
                <div className=" w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className="w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
              <div className="w-1/2 md:w-52">
                <div className="w-full p-1">
                  <CardSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit  flex lg:mx-auto gap-3 bg-gray-100 dark:bg-gray-800">
      <div className="hidden lg:block">
        <LeftMenu />
      </div>
      <div className="flex flex-col w-full mb-24">
        <div className="fixed right-3 bottom-3">
          <GenerateData _getUserInv={_getUserInvitations} />
        </div>
        {boardDetails && boardDetails.length > 0 && (
          <div className=" bg-white dark:bg-gray-900 p-4  border-gray-600 rounded-md m-1 shadow-lg  ">
            <div className="flex items-center gap-2 mb-3">
              {isIntivationsShow ? (
                <FaEnvelopeOpen className="text-sm text-gray-800 dark:text-gray-200" />
              ) : (
                <FaEnvelope className="text-sm text-gray-800 dark:text-gray-200" />
              )}

              <p className="text-gray-800 dark:text-gray-200 dark text-left text-sm lg:text-lg font-bold">
                INVITATIONS
              </p>
            </div>
            <div
              className="flex justify-between  items-center bg-gray-700 dark:bg-gray-800 p-3 cursor-pointer rounded-lg"
              onClick={() => setIsIntivationsShow((prev) => !prev)}
            >
              <p className="text-gray-100 dark:text-gray-200 text-left text-sm lg:text-base">
                You’ve received {boardDetails.length} new invitations.
              </p>
              {isIntivationsShow ? (
                <FaLongArrowAltUp
                  size={18}
                  className="text-gray-200 dark:text-gray-200 ml-3"
                />
              ) : (
                <FaLongArrowAltDown
                  size={18}
                  className="text-gray-200 dark:text-gray-200  ml-3"
                />
              )}
            </div>

            <div
              className={`transition-all duration-200 ease-in-out transform  ${
                isIntivationsShow ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
              } overflow-hidden`}
            >
              <InvatiationCard
                boardDetails={boardDetails}
                getUserInvitations={_getUserInvitations}
              />
            </div>
          </div>
        )}

        {favBoardsIDS && favBoardsIDS?.length > 0 && (
          <div className="flex flex-col   w-full  mb-5 p-3 gap-2 ">
            <div className="flex items-center self-start">
              <FaStar className="mr-2 dark:text-gray-400 text-gray-800 text-sm lg:text-1xl" />
              <p className="dark:text-gray-400 text-gray-800 text-sm lg:text-1xl font-bold ">
                STARRED BOARDS
              </p>
            </div>

            <div className="flex items-center justify-start w-full lg:w-12/12 flex-wrap">
              {boards &&
                boards
                  .filter((item) =>
                    favBoardsIDS?.some((fav) => item.id === fav)
                  )
                  .map((item) => (
                    <div className="w-1/2 lg:w-fit">
                      <BoardCard item={item} key={item.id} />
                    </div>
                  ))}
              {teamBoards &&
                teamBoards
                  .filter((item) =>
                    favBoardsIDS?.some((fav) => item.id === fav)
                  )
                  .map((item) => (
                    <div className="w-1/2">
                      <BoardCard item={item} key={item.id} />
                    </div>
                  ))}
            </div>
          </div>
        )}

        <div className="m-3">
          <div className=" mt-2 flex gap-3 items-center mb-3">
            {profileImg && (
              <img
                src={profileImg}
                className="w-6 h-6 lg:w-12 lg:h-12 rounded-full"
                loading="lazy"
                onError={handleImgError}
              />
            )}
            <p className="dark:text-gray-400 text-gray-800 text-left font-semibold text-sm lg:text-lg">
              {user?.displayName}'s Workspace
            </p>
          </div>

          <div className="flex items-center justify-start w-full lg:w-12/12 flex-wrap">
            {boards &&
              boards
                .sort(
                  (a, b) =>
                    b.createdDate.toDate().getTime() -
                    a.createdDate.toDate().getTime()
                )
                .map((item) => (
                  <div className="w-1/2 lg:w-fit">
                    <BoardCard item={item} key={item.id} />
                  </div>
                ))}
            <div className="w-1/2">
              <CreateBoardButton type="board-button" />
            </div>
          </div>
          {teamBoards.length > 0 && (
            <>
              <div className="flex justify-start w-full items-center">
                <IoPeople className="mr-2 text-gray-800 dark:text-gray-400 lg:text-1xl text-sm " />
                <p className="text-gray-800 dark:text-gray-400 text-sm lg:text-1xl py-2 font-bold">
                  TEAM BOARDS
                </p>
              </div>

              <div className="flex items-center justify-start w-full flex-wrap">
                {teamBoards &&
                  teamBoards.map((item) => (
                    <div className="w-1/2 lg:w-fit">
                      <BoardCard item={item} key={item.id} />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Boards2;
