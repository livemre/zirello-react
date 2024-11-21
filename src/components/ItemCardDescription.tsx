import { FC, useContext, useEffect, useState } from "react";

import { Item, MainContext } from "../context/Context";
import { ClipLoader } from "react-spinners";
import { GrTextAlignLeft } from "react-icons/gr";

type Props = {
  item: Item;
  onCardItemDataChanged: () => void;
};

const ItemCardDescription: FC<Props> = ({ item, onCardItemDataChanged }) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { addDescToItem, getDecsForItem, updateDesc } = context;

  const [desc, setDesc] = useState<string>("");
  const [updatedDesc, setUpdatedDesc] = useState<string | null>(null);
  const [showDescInput, setShowDescInput] = useState<boolean>(false);
  const [descLoading, setDescLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [descEditing, setDescEditing] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const _addDescToItem = () => {
    if (desc === null || desc === undefined) return;
    if (desc !== "") {
      addDescToItem(desc, item.id).then((result) => {
        if (result) {
          getDecsForItem(item.id).then((res) => setUpdatedDesc(res));
          onCardItemDataChanged();
        }
      });
    } else {
      console.log("Az");
    }
  };

  useEffect(() => {
    if (updatedDesc === null) return;

    setDescEditing(updatedDesc);
  }, [editDesc]);

  useEffect(() => {
    console.log("desc Editing " + descEditing);
    console.log("updated Desc " + updatedDesc);
    console.log("DESC " + desc);
  }, [updatedDesc, descEditing, desc]);

  const getUpdatedDesc = async () => {
    const desc = await getDecsForItem(item.id);
    setUpdatedDesc(desc);
  };

  useEffect(() => {
    getUpdatedDesc().then(() => setDescLoading(false));
  }, []);

  useEffect(() => {
    if (updatedDesc) {
      setDescEditing(updatedDesc);
    }
  }, [updatedDesc]);

  const _updateDesc = () => {
    console.log("Desc update");

    setSaveLoading(true);

    updateDesc(item.id, descEditing)
      .then(getUpdatedDesc)
      .then(() => setEditDesc(false))
      .then(() => setSaveLoading(false));
  };

  if (descLoading) {
    return (
      <div className="flex-col items-center justify-between">
        <div className="flex items-center ">
          <GrTextAlignLeft className="lg:text-1xl text-sm " color="#94a3b8" />
          <h1 className="text-1xl ml-2 text-gray-800 dark:text-gray-400">
            Description
          </h1>
        </div>
        <ClipLoader color={"#94a3b8"} loading={descLoading} size={25} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center py-2 ">
          <GrTextAlignLeft className="w-3 h-3 min-w-3 min-h-3 lg:h-4 lg:min-w-4 lg:min-h-4 text-gray-800 dark:text-gray-400" />
          <h1 className="lg:text-base ml-2 text-gray-800 dark:text-gray-400 text-sm">
            Description
          </h1>
        </div>
        {updatedDesc && editDesc !== true && (
          <button
            className=" dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-400 px-2 py-1 lg:px-6 lg:py-2 lg:text-base text-sm"
            onClick={() => setEditDesc(true)}
          >
            Edit
          </button>
        )}
      </div>
      <div className="lg:pl-6 w-full">
        {editDesc && updatedDesc && descEditing.length > -1 && (
          <div className="   mt-3 flex flex-col self-start w-full">
            <textarea
              className="w-full bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400 p-3 text-sm lg:text-base"
              value={descEditing}
              onChange={(e) => setDescEditing(e.target.value)}
            />
            <div className="flex gap-3 mt-2">
              {saveLoading ? (
                <button
                  className="bg-gray-400 px-3 py-1 rounded-md cursor-not-allowed text-sm lg:text-base"
                  onClick={_updateDesc}
                  disabled={true}
                >
                  Save
                </button>
              ) : descEditing === "" ? (
                <button className="bg-gray-400  px-3 py-1 rounded-md cursor-not-allowed text-sm lg:text-base">
                  Save
                </button>
              ) : (
                <button
                  className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md text-sm lg:text-base"
                  onClick={_updateDesc}
                >
                  Save
                </button>
              )}
              <button
                onClick={() => setEditDesc(false)}
                className="text-gray-800 hover:bg-gray-400 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-600  px-3 py-1 rounded-md text-sm lg:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {updatedDesc !== null &&
          updatedDesc !== undefined &&
          editDesc === false && (
            <div className="text-gray-800 bg-gray-300 dark:bg-gray-700 dark:text-gray-400 mt-3 p-3 text-sm lg:text-base  flex self-start w-full">
              <p>{updatedDesc}</p>
            </div>
          )}
        {updatedDesc === null ||
          (updatedDesc === undefined && (
            <>
              {showDescInput === false && (
                <div
                  onClick={() => setShowDescInput(true)}
                  className="w-full mt-3"
                >
                  <p className="bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-sm p-2 lg:p-4  lg:text-base cursor-pointer hover:bg-gray-400">
                    Add a more detailed description...{" "}
                  </p>
                </div>
              )}
              {showDescInput === true && (
                <div className="w-full">
                  <textarea
                    className="pl-2 mt-3  dark:bg-gray-600 p-2 dark:text-gray-400 w-full text-sm lg:text-base"
                    placeholder="add description..."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <div className="flex items-center justify-start gap-3 mt-2">
                    {desc === "" ? (
                      <button className="bg-gray-400 px-3 py-1 rounded-md cursor-not-allowed lg:text-base text-sm">
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-gray-100 px-3 py-1 rounded-md cursor-pointer lg:text-base text-sm"
                        onClick={_addDescToItem}
                      >
                        Save
                      </button>
                    )}

                    <button
                      onClick={() => setShowDescInput(false)}
                      className="dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-300  px-3 py-1 rounded-md lg:text-base text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default ItemCardDescription;
