import React, { FC, useContext, useEffect, useState } from "react";
import {
  ItemComment,
  MainContext,
  UserPublicDataType,
} from "../context/Context";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";

import { PiSpinnerGap } from "react-icons/pi";

type Props = {
  item: ItemComment;

  user: User;
  canEditing: boolean;
  onEditHandle: (id: string) => void;
  setEditingItem: React.Dispatch<React.SetStateAction<string | null>>;
  itemID: string;
  getComment: () => Promise<void>;
  setDeletingItem: React.Dispatch<React.SetStateAction<string | null>>;
  canDelete: boolean;
  onDeleteHandle: (id: string) => void;
};

const SingleComment: FC<Props> = ({
  item,

  canEditing,
  onEditHandle,
  setEditingItem,
  getComment,
  itemID,
  setDeletingItem,
  canDelete,
  onDeleteHandle,
  user,
}) => {
  const [editingComment, setEditingComment] = useState<string>("");
  const [userData, setUserData] = useState<UserPublicDataType | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string>("null");
  const [userDataLoading, setUserDataLoading] = useState<boolean>(true);
  const [commentDeleting, setCommentDeleting] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { updateComment, deleteComment, getUserPublicData } = context;

  const _getUserPublicData = async () => {
    console.log(item.userID);

    const result = await getUserPublicData(undefined, item.userID);
    console.log("Result");

    console.log(result[0]);

    setUserData(result[0]);
  };

  useEffect(() => {
    setEditingComment(item.comment);
  }, [onEditHandle]);

  useEffect(() => {
    _getUserPublicData();
  }, [user, item]);

  useEffect(() => {
    if (userData) setUserPhotoURL(userData?.photoURL);
    if (userData?.photoURL) {
      setUserDataLoading(false);
    }
  }, [userData]);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp.seconds * 1000); // Timestamp'i Date nesnesine dönüştürme

    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-EN", options).format(date);
  };

  const _updateComment = async () => {
    console.log(itemID);
    console.log(item.id);

    const result = await updateComment(itemID, editingComment, item.id);
    console.log(result);

    if (result) {
      await getComment();
      setEditingItem(null);
    }
  };

  const _deleteComment = () => {
    setDeletingItem(item.id);
    setEditingItem(null);
    onDeleteHandle(item.id);
    if (canDelete) {
    }
  };

  const _deleteCommentFromModal = async () => {
    setCommentDeleting(true);
    const result = await deleteComment(itemID, item.id);

    if (result) {
      await getComment();
      setCommentDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-700 flex-col lg:ml-6 rounded-md hover:bg-gray-600 mt-1 lg:mt-3">
        <div className=" text-gray-200 p-3 flex-col items-start  rounded-md mt-1 bg-orange-300 hidden">
          <div className="flex items-center gap-1">
            {userDataLoading ? (
              <p className="rounded-full mr-2">W</p>
            ) : (
              <img
                className="rounded-full mr-2"
                width={20}
                height={20}
                src={userPhotoURL}
              />
            )}
            <p className="text-sm font-bold">
              {userData && userData.displayName}
            </p>
            <p className="text-sm font-thin ml-2">
              {formatDate(item.createdAt)}
            </p>
          </div>
          {canEditing ? (
            <div className="flex-col items-start justify-start ml-8">
              <textarea
                className="w-full p-2 bg-gray-500"
                placeholder={item.comment}
                onChange={(e) => setEditingComment(e.target.value)}
                value={editingComment}
              />
            </div>
          ) : (
            <div className="flex-col items-start justify-start ml-8">
              <p className="text-left">{item.comment}</p>
            </div>
          )}
        </div>
        <div className="  text-gray-800 dark:text-gray-400 p-3 flex-col items-start  rounded-md mt-1 bg-gray-300 dark:bg-gray-800">
          <div className="flex items-start">
            {userDataLoading ? (
              <p className="rounded-full mr-2">W</p>
            ) : (
              <img className="rounded-full mr-2 w-5 h-5" src={userPhotoURL} />
            )}
            <p className="text-sm lg:text-base font-bold">
              {userData && userData.displayName}
            </p>
          </div>
          <p className="text-xs lg:text-sm font-extralight ml-7 text-left">
            {formatDate(item.createdAt)}
          </p>
          {canEditing ? (
            <div className="flex-col items-start justify-start ml-8">
              <textarea
                className="w-full p-2 dark:bg-gray-700 bg-gray-400 mt-2 lg:text-base text-sm"
                placeholder={item.comment}
                onChange={(e) => setEditingComment(e.target.value)}
                value={editingComment}
              />
            </div>
          ) : (
            <div className="flex-col items-start justify-start mt-2 ">
              <p className="text-left text-sm lg:text-base font-thin">
                {item.comment}
              </p>
            </div>
          )}
        </div>
      </div>
      {canDelete ? (
        <div className=" shadow-lg dark:bg-gray-800 bg-gray-200  border dark:border-gray-500 border-gray-400  rounded-sm  flex-col items-center text-sm  md:m-0 m-1   md:absolute  md:w-11/12 p-3 dark:text-gray-300 text-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className=" flex flex-grow justify-center">
              <p>Are you sure?</p>
            </div>
            <div className="">
              <IoMdClose
                className="text-gray-800 dark:text-gray-400 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-900"
                size={18}
                onClick={() => {
                  setDeletingItem(null);
                }}
              />
            </div>
          </div>

          {commentDeleting ? (
            <div className="flex items-center justify-center bg-red-500  text-black px-2 py-1 rounded-md w-full cursor-not-allowed">
              <PiSpinnerGap className=" h-5 w-5  text-gray-800  rounded-md animate-spin mr-1" />
            </div>
          ) : (
            <button
              className="bg-red-500 text-black px-2 py-1 rounded-md w-full hover:bg-red-400"
              onClick={_deleteCommentFromModal}
            >
              Delete Commnet
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      {canEditing ? (
        <div className="flex ml-8 p-2 gap-3">
          <button
            className=" px-4 py-1 text-gray-300 bg-blue-600 hover:bg-blue-500 rounded-md lg:text-base text-sm"
            onClick={_updateComment}
          >
            Save
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
            }}
            className=" px-4 py-1 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-400 rounded-md lg:text-base text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {userData && userData.email === user.email ? (
            <div className="flex ml-8 p-2">
              <button
                className=" px-4 py-1 text-gray-800 dark:text-gray-400  underline text-sm lg:text-base"
                onClick={() => {
                  onEditHandle(item.id);
                  setDeletingItem(null);
                }}
              >
                Edit
              </button>

              <button
                className=" px-4 py-1 text-gray-800 dark:text-gray-400  underline text-sm lg:text-base"
                onClick={_deleteComment}
              >
                Delete
              </button>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};

export default SingleComment;
