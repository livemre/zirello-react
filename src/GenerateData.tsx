import { FC, useContext, useState } from "react";
import { MainContext } from "./context/Context";
import { PiSpinnerBallThin } from "react-icons/pi";

type Props = {
  _getUserInv: () => void;
};

const GenerateData: FC<Props> = ({ _getUserInv }) => {
  const [dataLoading, setDataLoading] = useState(false);
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { generateData, user, getBoards, boards, getUserStarredBoards } =
    context;

  const _generateData = async () => {
    setDataLoading(true);
    if (user === null) return;
    const result = await generateData(user.uid);
    console.log(result);
    if (result) {
      setDataLoading(false);
      getBoards(user.uid);
      getUserStarredBoards(user.uid);
      _getUserInv();
    }
  };

  if (boards && boards.length > 0) {
    return <></>;
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={_generateData}
          className={`bg-purple-500 px-3 py-1 rounded-md ml-3 text-white ${
            dataLoading && "animate-pulse"
          }`}
        >
          Generate Data
        </button>

        {dataLoading && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="w-96  flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-5 rounded-lg shadow-lg">
                <PiSpinnerBallThin className="text-5xl animate-spin" />
                <p className="animate-pulse">Generating data...</p>
                <p className="text-sm mt-4">
                  This process takes approximately 30 seconds.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GenerateData;
