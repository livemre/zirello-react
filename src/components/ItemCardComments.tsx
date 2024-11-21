import { FC, useContext, useEffect, useState } from "react";
import { Item, ItemComment, MainContext } from "../context/Context";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import SingleComment from "./SingleComment";

type Props = {
  item: Item;
};

const ItemCardComments: FC<Props> = ({ item }) => {
  const [comment, setComment] = useState<string>("");
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comments, setComments] = useState<ItemComment[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { user, addCommentToItem, getItemComments } = context;

  //const photoURL = user && user.photoURL ? user.photoURL : "";

  useEffect(() => {
    _getItemComments();
  }, [user]);

  const _getItemComments = async () => {
    const _comments = await getItemComments(item.id);
    setComments(_comments);
  };

  const _addCommentToItem = async () => {
    if (!user) {
      return;
    }
    const result = await addCommentToItem(item.id, comment, user.uid);
    if (result) {
      setShowCommentInput(false);
      _getItemComments();
    }
  };

  const onEditHandle = (id: string) => {
    setEditingItem(id);
  };

  const onDeleteHandle = (id: string) => {
    setDeletingItem(id);
  };

  return (
    <>
      <div className="flex items-center justify-start mt-6">
        <div className="flex items-center">
          <BsFillChatLeftTextFill className="w-3 h-3 min-w-3 min-h-3 lg:h-4 lg:min-w-4 lg:min-h-4 text-gray-800 dark:text-gray-400" />
          <p className="text-sm lg:text-base ml-2 text-gray-800 dark:text-gray-400 pb-[3px]">
            Comments
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-start w-full ">
        {showCommentInput ? (
          <div className="w-full lg:pl-6">
            <textarea
              className="dark:bg-gray-700 dark:text-gray-400 bg-gray-300 text-gray-800 w-full p-2 text-sm lg:text-base rounded-md"
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex w-full gap-3 mt-1">
              <button
                className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md text-sm lg:text-base"
                onClick={_addCommentToItem}
              >
                Save
              </button>
              <button
                onClick={() => setShowCommentInput(false)}
                className="dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-400 px-3 py-1 rounded-md lg:text-base text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="lg:ml-6 py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-800 dark:text-gray-400 w-full dark:hover:bg-gray-700"
            onClick={() => setShowCommentInput(true)}
          >
            <p className="cursor-pointer lg:text-base text-sm">
              Write a comment...
            </p>
          </div>
        )}
      </div>
      {comments && (
        <div className="flex-col gap-3 mt-6 mb-24">
          {user &&
            comments
              .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
              .map((commentItem) => {
                return (
                  <SingleComment
                    item={commentItem}
                    user={user}
                    canEditing={commentItem.id === editingItem}
                    onEditHandle={onEditHandle}
                    setEditingItem={setEditingItem}
                    itemID={item.id}
                    getComment={_getItemComments}
                    canDelete={commentItem.id === deletingItem}
                    setDeletingItem={setDeletingItem}
                    onDeleteHandle={onDeleteHandle}
                  />
                );
              })}
        </div>
      )}
    </>
  );
};

export default ItemCardComments;
