// import { useContext, useEffect, useState } from "react";
// import {
//   Board,
//   Invite,
//   InviteWithBoardDetails,
//   MainContext,
// } from "../context/Context";

// import { ClipLoader } from "react-spinners";

// import BoardCard from "../components/BoardCard";
// import LeftMenu from "../components/LeftMenu";
// import CreateBoardButton from "../components/CreateBoardButton";
// import { LuClock } from "react-icons/lu";
// import { FaLongArrowAltDown, FaRegStar } from "react-icons/fa";
// import { FaLongArrowAltUp } from "react-icons/fa";
// import InvatiationCard from "../components/InvatiationCard";

// const Boards = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [boardDetails, setBoardDetails] = useState<InviteWithBoardDetails[]>(
//     []
//   );
//   const [isIntivationsShow, setIsIntivationsShow] = useState<boolean>(false);
//   const [teamBoards, setTeamBoards] = useState<Board[]>([]);

//   const context = useContext(MainContext);

//   if (!context) {
//     throw new Error("No Context");
//   }

//   const {
//     user,
//     getBoards,
//     boards,
//     getUserInvitations,
//     getBoardAllDetails,
//     getTeamBoards,
//   } = context;

//   const _getTeamBoards = async () => {
//     if (!user) {
//       return;
//     }
//     await getTeamBoards(user?.uid);
//   };

//   const _getBoards = async () => {
//     if (user === null) return;
//     if (user.email) {
//       await getBoards(user.uid);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     _getBoards();
//     _getTeamBoards();
//     console.log("get boards ve team boards cekildi");
//   }, [user]);

//   useEffect(() => {
//     if (!loading) {
//       _getUserInvitations();
//     }
//   }, [loading]);

//   const _getUserInvitations = async () => {
//     console.log("get user inv calisti");

//     if (!user?.email) return;

//     const result: Invite[] = await getUserInvitations(user.email);
//     console.log(result);

//     const allDetails = await Promise.all(
//       result.map(async (item) => {
//         let _boardDetails = await getBoardAllDetails(item.boardID);
//         return {
//           invite: item,
//           boardDetails: _boardDetails,
//         };
//       })
//     );

//     setBoardDetails(() => [
//       ...allDetails.filter(
//         (detail): detail is InviteWithBoardDetails =>
//           detail.boardDetails !== null && detail.invite.isApproved !== true
//       ),
//     ]);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full">
//         <ClipLoader color="white" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-3 container mx-auto ">
//       <LeftMenu />
//       <div className="boards-container">
//         {boardDetails.length > 0 && (
//           <div className="w-full bg-slate-950 p-4  border-slate-600">
//             <p className="text-white text-left text-lg mb-3">Invitations</p>
//             <div
//               className="flex justify-between  items-center bg-blue-700 p-3 cursor-pointer"
//               onClick={() => setIsIntivationsShow((prev) => !prev)}
//             >
//               <p className="text-slate-300 text-left">
//                 You’ve received {boardDetails.length} new invitations.
//               </p>
//               {isIntivationsShow ? (
//                 <FaLongArrowAltUp size={18} className="text-slate-200 ml-3" />
//               ) : (
//                 <FaLongArrowAltDown size={18} className="text-slate-200 ml-3" />
//               )}
//             </div>
//             {isIntivationsShow && (
//               <InvatiationCard
//                 boardDetails={boardDetails}
//                 getUserInvitations={_getUserInvitations}
//               />
//             )}
//           </div>
//         )}
//         {boards.some((item) => item.isFav) && (
//           <div className="flex flex-col   w-full  mt-4">
//             <div className="flex items-center self-start">
//               <FaRegStar size={20} className="mr-2 text-slate-200" />
//               <p className="text-slate-300 text-1xl py-2 font-bold">
//                 STARRED BOARDS
//               </p>
//             </div>

//             <div className="grid grid-cols-5 gap-4">
//               {boards.map((item) => {
//                 return item.isFav && <BoardCard item={item} key={item.id} />;
//               })}
//             </div>
//           </div>
//         )}
//         <div className="flex flex-col   w-full  mt-4">
//           {boards.some((item) => item.isFav !== true) && (
//             <>
//               <div className="flex items-center self-start">
//                 <LuClock size={20} className="mr-2 text-slate-200" />
//                 <p className="text-slate-300 text-1xl py-2 font-bold">RECENT</p>
//               </div>

//               <div className="grid grid-cols-5 gap-4">
//                 {boards
//                   .sort(
//                     (a, b) =>
//                       b.lastUsingDate.toDate().getTime() -
//                       a.lastUsingDate.toDate().getTime()
//                   )
//                   .map((item) => {
//                     return (
//                       !item.isFav && <BoardCard item={item} key={item.id} />
//                     );
//                   })}
//               </div>
//             </>
//           )}
//         </div>
//         <div className="flex justify-between w-full items-center mt-4">
//           <p className="text-slate-300 text-1xl py-2 font-bold">
//             YOUR WORKSPACES
//           </p>
//         </div>

//         <div className="grid grid-cols-5 gap-4">
//           {boards
//             .sort(
//               (a, b) =>
//                 a.createdDate.toDate().getTime() -
//                 b.createdDate.toDate().getTime()
//             )
//             .map((item) => (
//               <BoardCard item={item} key={item.id} />
//             ))}
//           <CreateBoardButton type="board-button" />
//         </div>
//         <div className="flex justify-between w-full items-center  mt-4">
//           <p className="text-slate-300 text-1xl py-2 font-bold">
//             YOUR TEAM BOARDS
//           </p>
//         </div>

//         <div className="grid grid-cols-5 gap-4 w-full">
//           {teamBoards
//             .sort(
//               (a, b) =>
//                 a.createdDate.toDate().getTime() -
//                 b.createdDate.toDate().getTime()
//             )
//             .map((item) => (
//               <BoardCard item={item} key={item.id} />
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Boards;
