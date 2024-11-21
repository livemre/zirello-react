import React, { FC, ReactNode, createContext, useState } from "react";
import myFirebaseApp from "./firebaseConfig";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Board from "../pages/Board";

export type Item = {
  id: string;
  title: string;
  listID: string;
  itemIndex: number;
  desc: string;
  indexInList: number;
};

export type List = {
  id: string;
  title: string;
  boardID: string;
  indexInBoard: number;
};

export type BGType = {
  id: number;
  url: string;
};

export type ItemComment = {
  comment: string;
  createdAt: Timestamp;
  id: string;
  userID: string;
};

export type Invite = {
  boardID: string;
  email: string;
  id: string;
  isApproved: boolean;
  sender: string;
};

export type Board = {
  name: string;
  userID: string;
  id: string;
  bgImage: string;
  lastUsingDate: Timestamp;
  createdDate: Timestamp;
  teamMember: string;
  desc: string;
};

export type InviteWithBoardDetails = {
  boardDetails: Board;
  invite: Invite;
};

export type BoardUsersType = {
  role: number;
  user: string;
  email: string;
  displayName: string;
  isFav: boolean;
  boardID: string;
  lastUsingDate: Timestamp;
};

export type UserPublicDataType = {
  displayName: string;
  email: string;
  photoURL: string;
  id?: string;
};

type AddBoardResult = {
  success: boolean;
  boardID?: string; // Opsiyonel
};

type AddListResult = {
  success: boolean;
  listID?: string;
};

type Props = {
  addItem: (
    title: string,
    listID: string,
    index: number,
    indexInList: number
  ) => Promise<boolean>;
  //addList: (title: string) => void;
  db: Item[];
  lists: List[];
  draggedItemHeight: number;
  setDraggedItemHeight: React.Dispatch<React.SetStateAction<number>>;
  targetColumnID: string;
  setTargetColumnID: React.Dispatch<React.SetStateAction<string>>;
  activeItem: Item | null;
  setActiveItem: React.Dispatch<React.SetStateAction<Item | null>>;
  moveItem: (index: number, item: Item) => void;
  activeList: List | undefined;
  setActiveList: React.Dispatch<React.SetStateAction<List | undefined>>;
  moveList: (
    index: number,
    boardID: string,
    setLists: Function,
    lists: List[]
  ) => Promise<boolean>;

  activeDraggedType: string;
  setActiveDraggedType: React.Dispatch<React.SetStateAction<string>>;
  activeListIndex: number;
  setActiveListIndex: React.Dispatch<React.SetStateAction<number>>;
  activeItemIndex: number;
  setActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addUser: (
    userID: string,
    email: string,
    displayName: string,
    photoURL: string
  ) => void;
  getBoards: (userID: string) => Promise<boolean>;
  addBoard: (
    userID: string,
    name: string,
    bgImage: string,
    email: string,
    displayName: string,
    isFav?: boolean
  ) => Promise<AddBoardResult>;
  boards: Board[];
  addList: (
    title: string,
    boardID: string,
    indexInBoard: number
  ) => Promise<AddListResult>;
  getListsOfBoard: (boardID: string) => Promise<boolean>;
  getItem: (listIDs?: any, listID?: string) => void;
  getBGImages: () => Promise<BGType[]>;
  getBoardDetails: (id: string) => Promise<Board | null>;
  addDescToItem: (desc: string, id: string) => Promise<boolean>;
  getDecsForItem: (id: string) => Promise<string>;
  updateDesc: (id: string, desc: string) => Promise<boolean>;
  addCommentToItem: (
    ItemID: string,
    comment: string,
    userID: string
  ) => Promise<boolean>;
  getItemComments: (itemID: string) => Promise<ItemComment[]>;
  updateComment: (
    itemID: string,
    comment: string,
    commentID: string
  ) => Promise<boolean>;
  deleteComment: (itemID: string, commentID: string) => Promise<boolean>;
  updateLastUsingDate: (
    boardID: string,
    date: Timestamp,
    userID: string
  ) => Promise<boolean>;

  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  setDB: React.Dispatch<React.SetStateAction<Item[]>>;
  updateListTitle: (listID: string, title: string) => Promise<boolean>;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  deleteList: (listID: string, boardID: string) => Promise<boolean>;
  updateItemTitle: (itemID: string, title: string) => Promise<boolean>;
  deleteItem: (itemID: string, listID: string) => Promise<boolean>;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  handleNotification: (message: string, status: boolean) => void;
  notificationMessage: string | null;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string | null>>;
  sendInvitation: (
    email: string,
    boardID: string,
    sender: string
  ) => Promise<string>;
  getBoardInvites: (boardID: string) => Promise<Invite[]>;
  deleteInvitation: (invitationID: string) => Promise<boolean>;
  getUserInvitations: (email: string) => Promise<Invite[]>;
  getBoardAllDetails: (boardID: string) => Promise<Board | null>;
  approveInvite: (
    boardID: string,
    userID: string,
    inviteID: string,
    email: string,
    displayName: string
  ) => Promise<boolean>;
  getTeamBoards: (userID: string) => Promise<boolean>;
  getBoardUsers: (boardID: string) => Promise<BoardUsersType[]>;
  teamBoards: Board[];
  setTeamBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  getUserPublicData: (
    email?: string,
    uid?: string
  ) => Promise<UserPublicDataType[]>;
  checkUserIsBoardAdmin: (boardID: string, userID: string) => Promise<boolean>;
  updateBackground: (boardID: string, bgImageURL: string) => Promise<boolean>;
  updateBoardName: (boardID: string, updatedName: string) => Promise<boolean>;
  deleteBoard: (boardID: string) => Promise<boolean>;
  updateBoardDesc: (boardID: string, desc: string) => Promise<boolean>;
  toggleFavBoard: (boardID: string, userID: string) => Promise<boolean>;
  getIsBoardFav: (boardID: string, email: string) => Promise<boolean>;
  getUserStarredBoards: (userID: string) => Promise<void>;
  favBoardsIDS: string[] | null;
  setFavBoardsIDS: React.Dispatch<React.SetStateAction<string[] | null>>;
  fav: { [key: string]: boolean };
  setFav: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  removeMemberFromBoard: (
    boardID: string,
    memberID: string
  ) => Promise<boolean>;
  leaveFromBoard: (boardID: string, userID: string) => Promise<boolean>;
  canDraggable: boolean;
  setCanDraggable: React.Dispatch<React.SetStateAction<boolean>>;
  itemDragging: boolean;
  setItemDragging: React.Dispatch<React.SetStateAction<boolean>>;
  boardBG: boolean;
  setBoardBG: React.Dispatch<React.SetStateAction<boolean>>;
  getUserName: (uid: string) => Promise<string>;
  generateData: (userID: string) => Promise<boolean>;
  sendInivationToNewUser: (email: string) => Promise<boolean>;
};

const MainContext = createContext<Props | null>(null);

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDB] = useState<Item[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [draggedItemHeight, setDraggedItemHeight] = useState<number>(0);
  const [targetColumnID, setTargetColumnID] = useState<string>("");
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [activeList, setActiveList] = useState<List | undefined>(undefined);
  const [activeDraggedType, setActiveDraggedType] = useState<string>("");
  const [activeListIndex, setActiveListIndex] = useState<number>(0);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [teamBoards, setTeamBoards] = useState<Board[]>([]);

  const [favBoardsIDS, setFavBoardsIDS] = useState<string[] | null>(null);
  const [fav, setFav] = useState<{ [key: string]: boolean }>({});
  const [canDraggable, setCanDraggable] = useState<boolean>(true);
  const [itemDragging, setItemDragging] = useState<boolean>(false);
  const [boardBG, setBoardBG] = useState<boolean>(false);

  const database = getFirestore(myFirebaseApp);

  // const generateData = async (userID: string): Promise<boolean> => {
  //   console.log("Generate Data" + userID);

  //   // Bir adet board olustur. Adi Generated Board 1 olsun.
  //   if (!user) return false;

  //   let result;
  //   try {
  //     if (user.displayName && user.email) {
  //       result = await addBoard(
  //         userID,
  //         "Generated Board 1",
  //         "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //         user?.email,
  //         user?.displayName
  //       );

  //       const boardId = result.boardID;

  //       let addListResult;
  //       let addListResult2;

  //       if (boardId) {
  //         addListResult = await addList("Generated List 1", boardId, 0);
  //         addListResult2 = await addList("Generated List 2", boardId, 1);
  //       }

  //       const listID = addListResult?.listID;
  //       const listID2 = addListResult2?.listID;

  //       if (listID) {
  //         await addItem("Generated Item 1", listID, 0, 0);
  //         await addItem("Generated Item 2", listID, 1, 1);
  //         await addItem("Generated Item 3", listID, 2, 2);
  //       }

  //       if (listID2) {
  //         await addItem("Generated 2 Item 1", listID2, 0, 0);
  //         await addItem("Generated 2 Item 2", listID2, 1, 1);
  //         await addItem("Generated 2 Item 3", listID2, 2, 2);
  //         await addItem("Generated 2 Item 4", listID2, 3, 3);
  //         await addItem("Generated 2 Item 5", listID2, 4, 4);
  //       }
  //     }

  //     // Boardin icine bir tane item olustur.
  //   } catch (error) {}

  //   return true;
  // };

  const sendInivationToNewUser = async (email: string): Promise<boolean> => {
    // yeni userin userId sini al
    // EA sportsun kullanicinin user id sini yaz.
    // Ea dan yeni usere istek yolla.

    await sendInvitation(email, "xHAZbksMpLYg10Am0ffg", "Andrew Wilson");

    return true;
  };

  const generateData = async (userID: string): Promise<boolean> => {
    console.log("Generate Data for User: " + userID);

    if (!user) return false;

    try {
      if (user.displayName && user.email) {
        // 1. Board: Facebook 2.0 Development Plan
        const board1 = await addBoard(
          userID,
          "Facebook 2.0 Development Plan",
          "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          user.email,
          user.displayName,
          true
        );

        if (board1.boardID) {
          const list1 = await addList("Idea & Research", board1.boardID, 0);
          const list2 = await addList(
            "Design & Prototyping",
            board1.boardID,
            1
          );
          await addList("Development", board1.boardID, 2);
          await addList("Testing & Deployment", board1.boardID, 3);

          await addList("Completed", board1.boardID, 4);

          // List 1: Idea & Research
          if (list1.listID) {
            await addItem(
              "Analyze competitors: Explore Facebook, Instagram, and TikTok to identify trends and user expectations.",
              list1.listID,
              0,
              0
            );
            await addItem(
              "Survey 1,000 users: Determine what they want from a new social media platform.",
              list1.listID,
              1,
              1
            );
            await addItem(
              "Research emerging technologies like AI-based content suggestions.",
              list1.listID,
              2,
              2
            );
            await addItem(
              "Document findings and create a comprehensive report to guide further stages.",
              list1.listID,
              3,
              3
            );
            await addItem(
              "Brainstorm unique selling points: For example, improved privacy features.",
              list1.listID,
              4,
              4
            );
            await addItem(
              "Read industry blogs and case studies for inspiration.",
              list1.listID,
              5,
              5
            );
            await addItem(
              "Prepare a pitch deck to secure funding for the project.",
              list1.listID,
              6,
              6
            );
            await addItem(
              "Schedule meetings with potential investors.",
              list1.listID,
              7,
              7
            );
            await addItem(
              "Review successful tech startups' strategies.",
              list1.listID,
              8,
              8
            );
            await addItem(
              "Finalize the core mission and values of Facebook 2.0.",
              list1.listID,
              9,
              9
            );
          }

          // List 2: Design & Prototyping
          if (list2.listID) {
            await addItem(
              "Create wireframes for the user interface: Include a clean, modern feed layout.",
              list2.listID,
              0,
              0
            );
            await addItem(
              "Prototype the onboarding experience: Make it simple and engaging.",
              list2.listID,
              1,
              1
            );
            await addItem(
              "Design profile pages with customizable themes.",
              list2.listID,
              2,
              2
            );
            await addItem(
              "Focus group testing: Gather feedback from initial wireframe designs.",
              list2.listID,
              3,
              3
            );
            await addItem(
              "Design a responsive mobile-first layout.",
              list2.listID,
              4,
              4
            );
            await addItem(
              "Add dark mode option for accessibility and user preference.",
              list2.listID,
              5,
              5
            );
            await addItem(
              "Develop prototypes using Figma or Adobe XD.",
              list2.listID,
              6,
              6
            );
            await addItem(
              "Test the navigation flow: Ensure it feels intuitive.",
              list2.listID,
              7,
              7
            );
            await addItem(
              "Incorporate branding elements like logos and colors.",
              list2.listID,
              8,
              8
            );
            await addItem(
              "Finalize designs for critical features like posting, liking, and commenting.",
              list2.listID,
              9,
              9
            );
          }

          // Additional lists for Development and Testing can be filled similarly
        }

        const board2 = await addBoard(
          userID,
          "React Learning Planner",
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          user.email,
          user.displayName,
          false
        );

        if (board2.boardID) {
          const list1 = await addList("To Learn", board2.boardID, 0);
          const list2 = await addList("Learning", board2.boardID, 1);
          const list3 = await addList("Learned", board2.boardID, 2);

          // List 1: To Learn
          if (list1.listID) {
            await addItem(
              "Learn JavaScript Basics (Arrow functions, Promises, Destructuring)",
              list1.listID,
              0,
              0
            );
            await addItem(
              "Understand JSX, Components, and Rendering in React.",
              list1.listID,
              1,
              1
            );
            await addItem(
              "Learn State and Props, how data flows in React.",
              list1.listID,
              2,
              2
            );
            await addItem(
              "Explore Event Handling in React (onClick, onChange).",
              list1.listID,
              3,
              3
            );
            await addItem(
              "Master React Router for navigation between pages.",
              list1.listID,
              4,
              4
            );
            await addItem(
              "Learn React Hooks (useState, useEffect).",
              list1.listID,
              5,
              5
            );
          }

          // List 2: Learning
          if (list2.listID) {
            await addItem(
              "Learning JSX and rendering dynamic content inside React components.",
              list2.listID,
              0,
              0
            );
            await addItem(
              "Experimenting with useState for managing state inside functional components.",
              list2.listID,
              1,
              1
            );
            await addItem(
              "Handling user input events (forms, onClick, onChange).",
              list2.listID,
              2,
              2
            );
            await addItem(
              "Understanding functional components and using hooks.",
              list2.listID,
              3,
              3
            );
            await addItem(
              "Using useEffect to manage side effects in functional components.",
              list2.listID,
              4,
              4
            );
          }

          // List 3: Learned
          if (list3.listID) {
            await addItem(
              "Mastered JavaScript basics (arrow functions, template literals).",
              list3.listID,
              0,
              0
            );
            await addItem(
              "Understood the purpose of React and how to create basic components.",
              list3.listID,
              1,
              1
            );
            await addItem(
              "Successfully passed data between components using props.",
              list3.listID,
              2,
              2
            );
            await addItem(
              "Handled events like onClick and onChange in React components.",
              list3.listID,
              3,
              3
            );
            await addItem(
              "Created functional components and understood the difference from class components.",
              list3.listID,
              4,
              4
            );
            await addItem(
              "Managed state using useState hook in functional components.",
              list3.listID,
              5,
              5
            );
          }
        }
      }

      if (user.email) {
        await sendInivationToNewUser(user.email);
      }

      console.log("Data generated!");

      return true;
    } catch (error) {
      console.error("Error generating data:", error);
      return false;
    }
  };

  const leaveFromBoard = async (
    boardID: string,
    userID: string
  ): Promise<boolean> => {
    try {
      console.log(boardID);
      console.log(userID);

      const boardUsersRef = collection(database, "boardUsers");
      const q = query(
        boardUsersRef,
        where("boardID", "==", boardID),
        where("user", "==", userID)
      );

      const users = await getDocs(q);
      console.log(users.size);

      users.forEach(async (item) => {
        console.log(item.id);
        await deleteDoc(doc(boardUsersRef, item.id));
      });
      return true; // Başarılıysa true dön
    } catch (error) {
      console.error("Error while leaving from board: ", error); // Hata daha detaylı yazdırılır
      return false; // Hata durumunda false dön
    }
  };

  // const leaveFromBoard = async (
  //   boardID: string,
  //   userID: string
  // ): Promise<boolean> => {
  //   try {
  //     const boardUsersRef = collection(database, "boardUsers");
  //     const q = query(
  //       boardUsersRef,
  //       where("boardID", "==", boardID),
  //       where("user", "==", userID)
  //     );

  //     const datas = await getDocs(q);
  //     datas.forEach(async (user) => {
  //       console.log(user.id);

  //       // await deleteDoc(doc(boardUsersRef, user.id));
  //     });
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  const removeMemberFromBoard = async (
    boardID: string,
    memberID: string
  ): Promise<boolean> => {
    try {
      const boardUsersRef = collection(database, "boardUsers");
      const q = query(
        boardUsersRef,
        where("boardID", "==", boardID),
        where("user", "==", memberID)
      );

      const datas = await getDocs(q);
      datas.forEach(async (user) => {
        await deleteDoc(doc(boardUsersRef, user.id));
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // const getUserStarredBoards = async (userID: string) => {
  //   const boardUsersRef = collection(database, "boardUsers");
  //   const q = query(boardUsersRef, where("user", "==", userID));

  //   let _starredBoardsIDS: string[] = [];

  //   const boards = await getDocs(q);

  //   for (const b of boards.docs) {
  //     const singleBoard = b.data() as BoardUsersType;
  //     console.log(singleBoard);
  //     if (singleBoard.isFav) {
  //       const boardRef = collection(database, "boards");
  //       const qu = query(boardRef, where("id", "==", singleBoard.boardID));
  //       const boards2 = await getDocs(qu);
  //       boards2.forEach((board) => {
  //         const singleBoard = board.data() as Board;
  //         _starredBoardsIDS.push(singleBoard.id);
  //       });
  //     }
  //   }
  //   if (_starredBoardsIDS.length > 0) {
  //     setFavBoardsIDS(_starredBoardsIDS);
  //   } else {
  //     setFavBoardsIDS(null);
  //   }
  // };

  const getUserStarredBoards = async (userID: string) => {
    const boardUsersRef = collection(database, "boardUsers");
    const q = query(
      boardUsersRef,
      where("user", "==", userID),
      where("isFav", "==", true)
    );

    let _starredBoardsIDS: string[] = [];

    const boards = await getDocs(q);

    // isFav olan boardID'leri topla
    const boardIDs = boards.docs.map(
      (b) => (b.data() as BoardUsersType).boardID
    );

    if (boardIDs.length > 0) {
      // Tek sorgu ile boards koleksiyonundan tüm gerekli board'ları çek
      const boardRef = collection(database, "boards");
      const qu = query(boardRef, where("id", "in", boardIDs));
      const boardsSnapshot = await getDocs(qu);

      boardsSnapshot.forEach((board) => {
        const singleBoard = board.data() as Board;
        _starredBoardsIDS.push(singleBoard.id);
      });

      setFavBoardsIDS(_starredBoardsIDS);
    } else {
      setFavBoardsIDS(null);
    }
  };

  // const getUserStarredBoards = async (userID: string) => {
  //   const boardUsersRef = collection(database, "boardUsers");
  //   const q = query(boardUsersRef, where("user", "==", userID));

  //   let starredBoards: Board[] = [];

  //   const boards = await getDocs(q);

  //   boards.forEach(async (b) => {
  //     const singleBoard = b.data() as BoardUsersType;
  //     const boardRef = collection(database, "boards");
  //     const qu = query(boardRef, where("boardID", "==", singleBoard.boardID));
  //     const boards2 = await getDocs(qu);
  //     boards2.forEach((board) => {
  //       const singleBoard = board.data() as Board;
  //       starredBoards.push(singleBoard);
  //     });
  //   });
  //   console.log(starredBoards);
  // };

  const getIsBoardFav = async (
    boardID: string,
    email: string
  ): Promise<boolean> => {
    const boardUsersRef = collection(database, "boardUsers");
    const q = query(
      boardUsersRef,
      where("boardID", "==", boardID),
      where("email", "==", email)
    );

    let result: boolean = false;

    const data = await getDocs(q);
    data.forEach((board) => {
      result = (board.data() as BoardUsersType).isFav;
    });

    return result;
  };

  const toggleFavBoard = async (
    boardID: string,
    userID: string
  ): Promise<boolean> => {
    // Referansi verilen isFav degerini true ise false, false ise true yap.
    try {
      const boardUsersRef = collection(database, "boardUsers");
      const q = query(
        boardUsersRef,
        where("boardID", "==", boardID),
        where("user", "==", userID)
      );

      const result = await getDocs(q);
      result.forEach(async (board) => {
        const singleBoard = board.data() as BoardUsersType;
        console.log(singleBoard);

        const docRef = doc(database, "boardUsers", board.id);
        await updateDoc(docRef, { isFav: !singleBoard.isFav });
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const updateBoardDesc = async (boardID: string, desc: string) => {
    try {
      const boardRef = doc(database, "boards", boardID);
      await updateDoc(boardRef, { desc: desc });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteBoard = async (boardID: string): Promise<boolean> => {
    try {
      const boardRef = doc(database, "boards", boardID);
      await deleteDoc(boardRef);

      const listRef = collection(database, "lists");
      const q = query(listRef, where("boardID", "==", boardID));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (list) => {
        await deleteDoc(doc(listRef, list.id));
        await deleteAllListItems(list.id);
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const updateBoardName = async (
    boardID: string,
    updatedName: string
  ): Promise<boolean> => {
    try {
      const boardRef = doc(database, "boards", boardID);
      await updateDoc(boardRef, { name: updatedName });
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateBackground = async (
    boardID: string,
    bgImageURL: string
  ): Promise<boolean> => {
    try {
      const boardRef = doc(database, "boards", boardID);
      await updateDoc(boardRef, { bgImage: bgImageURL });
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkUserIsBoardAdmin = async (
    boardID: string,
    userID: string
  ): Promise<boolean> => {
    let _role: number = 0;
    const boardUsersRef = collection(database, "boardUsers");
    const q = query(
      boardUsersRef,
      where("boardID", "==", boardID),
      where("user", "==", userID)
    );
    const data = await getDocs(q);
    data.forEach((user) => {
      const { role } = user.data() as BoardUsersType;

      _role = role;
    });

    return _role === 0 ? true : false;
  };

  const getUserPublicData = async (
    email?: string,
    uid?: string
  ): Promise<UserPublicDataType[]> => {
    let userPublicData: UserPublicDataType[] = [];
    try {
      if (email) {
        const userRef = collection(database, "users");
        const q = query(userRef, where("email", "==", email));
        const data = await getDocs(q);

        data.forEach((user) => {
          let { id, ...userData } = user.data() as UserPublicDataType;
          userPublicData.push(userData);
        });
      }

      if (uid) {
        const userRef = collection(database, "users");
        const q = query(userRef, where("id", "==", uid));
        const data = await getDocs(q);

        data.forEach((user) => {
          let { id, ...userData } = user.data() as UserPublicDataType;
          userPublicData.push(userData);
        });
      }
    } catch (error) {}

    return userPublicData;
  };

  const getUserName = async (uid: string): Promise<string> => {
    let userPublicData = "";
    try {
      if (uid) {
        const userRef = collection(database, "users");
        const q = query(userRef, where("id", "==", uid));
        const data = await getDocs(q);

        data.forEach((user) => {
          let { displayName } = user.data();
          userPublicData = displayName;
        });
      }
    } catch (error) {}
    return userPublicData;
  };

  const getBoardUsers = async (boardID: string): Promise<BoardUsersType[]> => {
    // Verilen BoardID yi userBoards da arattir. gelen sonuclar BoardUserType olacak.
    // Gelen tum sonuclari bir dizide dondur.

    const boardRef = collection(database, "boardUsers");

    const q = query(boardRef, where("boardID", "==", boardID));
    const boards = await getDocs(q);

    const boardUsers: BoardUsersType[] = [];

    boards.forEach((board) => {
      const singleUser = board.data() as BoardUsersType;
      boardUsers.push(singleUser);
    });

    return boardUsers;
  };

  const approveInvite = async (
    boardID: string,
    userID: string,
    inviteID: string,
    email: string,
    displayName: string
  ): Promise<boolean> => {
    try {
      const invatiationRef = doc(database, "invites", inviteID);

      await updateDoc(invatiationRef, { isApproved: true });
      await deleteDoc(invatiationRef);

      const boardUsersRef = collection(database, "boardUsers");

      await addDoc(boardUsersRef, {
        role: 1,
        user: userID,
        email: email,
        displayName: displayName,
        isFav: false,
        boardID: boardID,
        lastUsingDate: Timestamp.now(),
      });
      if (user) {
        await getTeamBoards(user?.uid);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const getBoardAllDetails = async (boardID: string): Promise<Board | null> => {
    try {
      const boardRef = doc(database, "boards", boardID);
      const data = await getDoc(boardRef);
      const singleData = data.data() as Board;
      return singleData;
    } catch (error) {
      return null;
    }
  };

  const getUserInvitations = async (email: string) => {
    const invitationRef = collection(database, "invites");
    const q = query(invitationRef, where("email", "==", email));
    const data = await getDocs(q);
    let _invitations: Invite[] = [];
    data.forEach((invitation) => {
      let inv = invitation.data() as Invite;
      _invitations.push(inv);
    });

    return _invitations;
  };

  const deleteInvitation = async (invitationID: string): Promise<boolean> => {
    try {
      const invitationRef = doc(database, "invites", invitationID);
      await deleteDoc(invitationRef);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getBoardInvites = async (boardID: string): Promise<Invite[]> => {
    const inviteRef = collection(database, "invites");
    const q = query(inviteRef, where("boardID", "==", boardID));
    const getDatas = await getDocs(q);

    let invites: Invite[] = [];

    getDatas.forEach((invite) => {
      let data = invite.data() as Invite;

      invites.push(data);
    });

    return invites;
  };

  const sendInvitation = async (
    email: string,
    boardID: string,
    sender: string
  ): Promise<string> => {
    try {
      // User var mi?
      const userRef = collection(database, "users");
      const qu = query(userRef, where("email", "==", email));
      const data = await getDocs(qu);
      const isExist = data.size > 0 ? true : false;

      if (!isExist) {
        return "The use is not registed on Zirello!";
      }

      // Kullanici zaten bu boardda var mi varsa return yap.

      const boardRef = collection(database, "boardUsers");
      const boardQuery = query(
        boardRef,
        where("boardID", "==", boardID),
        where("email", "==", email)
      );
      const boardData = await getDocs(boardQuery);
      const isBoardExist = boardData.size > 0 ? true : false;

      if (isBoardExist) {
        return "The user already on this board";
      }

      //Invitation daha once eklenmis mi?
      const inviteRef = collection(database, "invites");
      const q = query(
        inviteRef,
        where("email", "==", email),
        where("boardID", "==", boardID)
      );
      const docs = await getDocs(q);
      console.log(docs.size);
      const size = docs.size;

      if (size > 0) {
        return "You have already sent an invitation to this user. Please wait for the user to approve the invitation.";
      } else {
        const result = await addDoc(inviteRef, {
          email: email,
          boardID: boardID,
          isApproved: false,
          sender: sender,
        });

        const id = result.id;

        const currentDocRef = doc(inviteRef, id);

        await updateDoc(currentDocRef, { id: id });
      }
      return "User successfully invited";
    } catch (error) {
      return "An error occurred on the server. Try again.";
    }
  };

  const handleNotification = (message: string, status: boolean) => {
    setShowNotification(status);
    setNotificationMessage(message);
  };

  const updateItemTitle = async (
    itemID: string,
    title: string
  ): Promise<boolean> => {
    try {
      const cardRef = doc(database, "items", itemID);
      await setDoc(cardRef, { title: title }, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteItem = async (
    itemID: string,
    listID: string
  ): Promise<boolean> => {
    const itemRef = doc(database, "items", itemID);
    try {
      // Firestore'dan öğeyi sil
      await deleteDoc(itemRef);

      // Verilen listeye ait tüm öğeleri Firestore'dan al
      const itemsRef = collection(database, "items");
      const q = query(itemsRef, where("listID", "==", listID));
      const snapshot = await getDocs(q);

      // Kalan öğeleri Firestore'dan alıp indexInList değerine göre sıralayın
      let remainingItems = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        indexInList: doc.data().indexInList,
      }));

      remainingItems.sort((a, b) => a.indexInList - b.indexInList);

      console.log("Firestore'dan kalan öğeler:", remainingItems);

      // `indexInList` değerlerini güncelle
      const updatePromises = remainingItems.map(
        async (item: any, index: number) => {
          const updatedItems = { ...item, indexInList: index }; // Yeni indexInList değeri
          const itemDocRef = doc(database, "items", item.id);

          try {
            await setDoc(itemDocRef, updatedItems); // Firestore'a güncelle
            console.log(
              `Document ${item.id} successfully updated with index ${index}`
            );
          } catch (error) {
            console.error(`Error updating document ${item.id}:`, error);
          }
        }
      );

      // Firestore'daki güncellemelerin tamamlanmasını bekleyin
      await Promise.all(updatePromises);
      await getItem();

      // Local `db` dizisini güncelle: silinen öğeyi çıkar ve `indexInList` değerlerini yeniden sırala
      const updatedDB = db
        .filter((item) => item.id !== itemID) // Silinen öğeyi çıkart
        .map((item, index) => ({ ...item, indexInList: index })); // `indexInList` değerlerini güncelle

      console.log(updatedDB);

      // Local state'i güncelle
      setDB(updatedDB);

      console.log("Local db güncellendi:", updatedDB);

      return true;
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
      return false;
    }
  };

  const deleteAllListItems = async (listID: string) => {
    const itemsRef = collection(database, "items");
    const q = query(itemsRef, where("listID", "==", listID));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (item) => {
      await deleteDoc(doc(database, "items", item.id));
    });
  };

  const deleteList = async (
    listID: string,
    boardID: string
  ): Promise<boolean> => {
    try {
      const listRef = doc(database, "lists", listID);
      await deleteDoc(listRef);

      // Verilen boardID'ye göre kalan listeleri getir
      const listsRef = collection(database, "lists");
      const q = query(listsRef, where("boardID", "==", boardID));
      const snapshot = await getDocs(q);

      let remainingLists = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        indexInBoard: doc.data().indexInBoard,
      }));

      let sortedList = [];

      // remainingLists listesini indexInBoard değerine göre küçükten büyüğe sıralayın
      remainingLists.sort((a, b) => a.indexInBoard - b.indexInBoard);

      // sortedList'e sıralanmış remainingLists'i push yerine kopyalayın
      sortedList = [...remainingLists];
      // Kalan listeleri `indexInList` değerlerine göre sırala
      // remainingLists.sort((a, b) => a - b.indexInList);

      // `indexInList` değerlerini güncelle
      const updatePromises = sortedList.map((list, index) => {
        const updatedList = { ...list, indexInBoard: index };
        const listDocRef = doc(database, "lists", list.id);
        return setDoc(listDocRef, updatedList);
      });

      // Tüm güncellemeleri tamamlayın
      await Promise.all(updatePromises);

      await deleteAllListItems(listID);

      return true;
    } catch (error) {
      console.error("Error deleting list or updating indexes: ", error);
      return false;
    }
  };

  const updateListTitle = async (listID: string, title: string) => {
    try {
      const listRef = doc(database, "lists", listID);
      await setDoc(listRef, { title: title }, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateLastUsingDate = async (
    boardID: string,
    date: Timestamp,
    userID: string
  ) => {
    try {
      // boardUsers koleksiyonunun icinde boardID ve user esit olan dokumani getir.

      const boarUserRef = collection(database, "boardUsers");
      const q = query(
        boarUserRef,
        where("boardID", "==", boardID),
        where("user", "==", userID)
      );

      const docs = await getDocs(q);
      docs.forEach(async (item) => {
        const d = item.id;
        console.log(d);
        const ref = doc(database, "boardUsers", d);
        await setDoc(ref, { lastUsingDate: date }, { merge: true });
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteComment = async (
    itemID: string,
    commentID: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentRef = doc(itemRef, "comments", commentID);
      await deleteDoc(commentRef);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateComment = async (
    itemID: string,
    comment: string,
    commentID: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentRef = doc(itemRef, "comments", commentID);
      await setDoc(commentRef, { comment: comment }, { merge: true });
      console.log(comment);

      console.log("Update comment");

      return true;
    } catch (error) {
      return false;
    }
  };

  const getItemComments = async (itemID: string): Promise<ItemComment[]> => {
    const itemRef = doc(database, "items", itemID);
    const commentsRef = collection(itemRef, "comments");
    const allComments = await getDocs(commentsRef);
    let comments: ItemComment[] = [];
    allComments.forEach((item) => {
      const comment = item.data() as ItemComment;
      comments.push(comment);
      console.log(comment.comment);
    });
    return comments;
  };

  const addCommentToItem = async (
    itemID: string,
    comment: string,
    userID: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentsCollectionRef = collection(itemRef, "comments");

      const result = await addDoc(commentsCollectionRef, {
        createdAt: serverTimestamp(),
        comment: comment,
        userID: userID,
      });
      const docID = result.id;

      const commentRef = doc(commentsCollectionRef, docID);

      console.log(result.id);

      await setDoc(commentRef, { id: docID }, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateDesc = async (id: string, desc: string): Promise<boolean> => {
    try {
      const itemRef = collection(database, "items");
      const docRef = doc(itemRef, id);
      await updateDoc(docRef, { desc: desc });
      return true;
    } catch (error) {
      return false;
    }
  };

  const getDecsForItem = async (id: string): Promise<string> => {
    const itemRef = collection(database, "items");
    const docRef = doc(itemRef, id);
    const document = await getDoc(docRef);
    const item = document.data() as Item;
    console.log(item.desc);
    return item.desc;
  };

  const addDescToItem = async (desc: string, id: string): Promise<boolean> => {
    try {
      const itemRef = collection(database, "items");
      const docRef = doc(itemRef, id);
      await setDoc(docRef, { desc: desc }, { merge: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getListsOfBoard = async (boardID: string): Promise<boolean> => {
    const listRef = collection(database, "lists");

    const q = query(listRef, where("boardID", "==", boardID));
    const querySnapshot = await getDocs(q);
    let lists: List[] = [];
    querySnapshot.forEach((item) => {
      const listData = item.data() as List;
      lists.push({ ...listData, id: item.id });
    });

    setLists(lists);
    return true;
  };

  const getBoardDetails = async (id: string): Promise<Board | null> => {
    const boardRef = collection(database, "boards");
    const q = query(boardRef, where("id", "==", id));
    const docs = await getDocs(q);

    if (!docs.empty) {
      // İlk belgeyi al ve geri döndür
      const firstDoc = docs.docs[0];
      const data = firstDoc.data() as Board;
      return data;
    }

    return null; // Eğer eşleşen belge yoksa null döndür
  };

  const addBoard = async (
    userID: string,
    name: string,
    bgImage: string,
    email: string,
    displayName: string,
    isFav?: boolean
  ): Promise<AddBoardResult> => {
    try {
      const lastUsingDate = Timestamp.now();
      const createdDate = Timestamp.now();
      const boardRef = collection(database, "boards");
      const board = await addDoc(boardRef, {
        name,
        userID,
        bgImage,
        lastUsingDate,
        createdDate,
        desc: name + " board",
        isFav: false,
      });

      const boardDocID = board.id;

      await setDoc(
        doc(database, "boards", boardDocID),
        { id: boardDocID },
        { merge: true }
      );

      const boardUsersRef = collection(database, "boardUsers");

      if (isFav) {
        await addDoc(boardUsersRef, {
          boardID: boardDocID,
          user: userID,
          role: 0,
          email: email,
          lastUsingDate: lastUsingDate,
          displayName: displayName,
          isFav: isFav,
        });
      } else {
        await addDoc(boardUsersRef, {
          boardID: boardDocID,
          user: userID,
          role: 0,
          email: email,
          lastUsingDate: lastUsingDate,
          displayName: displayName,
          isFav: false,
        });
      }

      return { success: true, boardID: boardDocID };
    } catch (error) {
      return { success: false };
    }
  };

  // const getBoards = async (userID: string): Promise<boolean> => {
  //   try {
  //     const boardRef = collection(database, "boards");
  //     const q = query(boardRef, where("userID", "in", [userID]));
  //     const querySnapshot = await getDocs(q);
  //     let boardsData: Board[] = []; // Yeni array

  //     querySnapshot.forEach((item: QueryDocumentSnapshot) => {
  //       const boardData = item.data() as Board;
  //       boardsData.push({ ...boardData });
  //     });
  //     setBoards(boardsData);
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  const getTeamBoards = async (userID: string): Promise<boolean> => {
    try {
      const boardUsersRef = collection(database, "boardUsers");
      const q = query(boardUsersRef, where("user", "==", userID));
      const userBoards = await getDocs(q);

      const matchingBoards: BoardUsersType[] = [];

      userBoards.forEach((board) => {
        const singleBoard = board.data() as BoardUsersType;
        if (singleBoard.role === 1) {
          matchingBoards.push(singleBoard);
        }
      });
      console.log(matchingBoards);

      const userTeamBoards: Board[] = [];

      // Asenkron döngü ve Promises
      for (const board of matchingBoards) {
        const boardRef = doc(database, "boards", board.boardID);
        const userBoard = await getDoc(boardRef);

        if (userBoard.exists()) {
          const data = userBoard.data() as Board;

          console.log(data);
          userTeamBoards.push(data);
        }
      }

      const updatedBoards = await Promise.all(
        userTeamBoards.map(async (board) => {
          const boardUsersRef = collection(database, "boardUsers");

          // Board'a ait kullanıcının verilerini alıyoruz.
          const q = query(
            boardUsersRef,
            where("boardID", "==", board.id),
            where("user", "==", userID)
          );

          const boardUsersSnapshot = await getDocs(q);
          boardUsersSnapshot.forEach((b) => {
            const d = b.data() as BoardUsersType;
            if (board.id === d.boardID) {
              // board'un lastUsingDate'ini güncelliyoruz
              board.lastUsingDate = d.lastUsingDate;
            }
          });

          return board;
        })
      );

      setTeamBoards(updatedBoards);
      return true;
    } catch (error) {
      console.error("Error getting team boards:", error);
      return false;
    }
  };

  const getBoards = async (userID: string): Promise<boolean> => {
    try {
      const boardRef = collection(database, "boards");
      const q = query(boardRef);
      const datas = await getDocs(q);

      const userBoards: Board[] = [];

      datas.forEach((board) => {
        let singleBoard = board.data() as Board;
        if (singleBoard.userID === userID) {
          userBoards.push(singleBoard);
        }
      });

      // boardUsers icine tek tek bak kullanicinin ID sine ait boardlari al ve yukaridaki boardlardan olmayan varsa ekle.

      // Kullanıcının boardlarını aldık. Şimdi bu boardlar için boardUsers verilerini alalım.
      const updatedBoards = await Promise.all(
        userBoards.map(async (board) => {
          const boardUsersRef = collection(database, "boardUsers");

          // Board'a ait kullanıcının verilerini alıyoruz.
          const q = query(
            boardUsersRef,
            where("boardID", "==", board.id),
            where("user", "==", userID)
          );

          const boardUsersSnapshot = await getDocs(q);
          boardUsersSnapshot.forEach((b) => {
            const d = b.data() as BoardUsersType;
            if (board.id === d.boardID) {
              // board'un lastUsingDate'ini güncelliyoruz
              board.lastUsingDate = d.lastUsingDate;
            }
          });

          return board;
        })
      );

      // Güncellenmiş board verilerini state'e set et.
      setBoards(updatedBoards);
      console.log(updatedBoards);

      return true;
    } catch (error) {
      console.error("Error fetching boards: ", error);
      return false;
    }
  };

  // const getBoards = async (userID: string): Promise<boolean> => {
  //   try {
  //     const boardRef = collection(database, "boards");

  //     // Sadece userID'yi kontrol etmek için sorgu
  //     const q1 = query(boardRef, where("userID", "==", userID));

  //     // Hem userID hem de teamMember'ı kontrol etmek için sorgu
  //     const q2 = query(boardRef, where("teamMember", "==", userID));

  //     const querySnapshot1 = await getDocs(q1);
  //     const querySnapshot2 = await getDocs(q2);

  //     let boardsData: Board[] = []; // Yeni array

  //     // İlk sorgudan gelen sonuçlar
  //     querySnapshot1.forEach((item: QueryDocumentSnapshot) => {
  //       const boardData = item.data() as Board;
  //       boardsData.push({ ...boardData });
  //     });

  //     // İkinci sorgudan gelen sonuçlar
  //     querySnapshot2.forEach((item: QueryDocumentSnapshot) => {
  //       const boardData = item.data() as Board;
  //       boardsData.push({ ...boardData });
  //     });

  //     setBoards(boardsData);
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  const addUser = async (
    userID: string,
    email: string,
    displayName: string,
    photoURL: string
  ) => {
    // Check if user exist

    const userRef = collection(database, "users");

    const userExist = query(userRef, where("email", "==", email));

    console.log(userExist);

    const querySnapshot = await getDocs(userExist);
    querySnapshot.forEach((item) => {
      return item.data();
    });

    if (querySnapshot.size > 0) {
      return;
    }

    await addDoc(userRef, {
      email: email,
      displayName: displayName,
      id: userID,
      photoURL: photoURL,
    });
  };

  const getBGImages = async (): Promise<BGType[]> => {
    const imagesRef = collection(database, "assets");

    const bgArray: BGType[] = [];

    const bgs = await getDocs(imagesRef);
    bgs.forEach((item) => {
      const singleData = item.data() as BGType;
      bgArray.push(singleData);
    });

    return bgArray;
  };

  const getItem = async () => {
    const itemRef = collection(database, "items");
    const receivedList: any = [];

    const docs = await getDocs(itemRef);
    docs.docs.forEach((doc) => {
      receivedList.push({ id: doc.id, ...doc.data() });
    });

    setDB(receivedList);
  };

  const addItem = async (
    title: string,
    listID: string,
    index: number,
    indexInList: number
  ): Promise<boolean> => {
    try {
      // Local olarak karti ekle

      setDB([
        ...db,
        {
          title: title,
          listID: listID,
          itemIndex: index,
          desc: "",
          id: "asd",
          indexInList: indexInList,
        },
      ]);

      const itemRef = collection(database, "items");

      const addedItem = await addDoc(itemRef, {
        title: title,
        listID: listID,
        itemIndex: index,
        indexInList: indexInList,
      });

      const id = addedItem.id;

      await setDoc(doc(database, "items", id), { id: id }, { merge: true });

      await getItem();
      return true;
    } catch (error) {
      return false;
    }
  };

  const addList = async (
    title: string,
    boardID: string,
    indexInBoard: number
  ): Promise<AddListResult> => {
    try {
      const id = uuidv4();
      // Once local olarak listeyi ekle.
      setLists([
        ...lists,
        {
          id: id,
          title: title,
          boardID: boardID,
          indexInBoard: indexInBoard,
        },
      ]);

      const listRef = collection(database, "lists");

      const result = await addDoc(listRef, {
        id: id,
        title,
        boardID,
        indexInBoard,
      });
      getListsOfBoard(boardID);

      const listID = result.id;

      return { success: true, listID: listID };
    } catch (error) {
      return { success: false };
    }
  };

  const moveItem = async (index: number, item: Item) => {
    if (index === null) return;

    const updatedDB = db.filter((dbItem) => dbItem.id !== item.id);
    console.log(targetColumnID);

    updatedDB.splice(index, 0, { ...item, listID: targetColumnID });

    setDB(updatedDB);
    console.log(updatedDB);

    // itemIndex değerlerini güncelle
    updatedDB.forEach((item, idx) => {
      item.itemIndex = idx;
    });

    // Firebase'de toplu güncelleme işlemi
    const batch = writeBatch(database);

    updatedDB.forEach((item) => {
      const itemRef = doc(database, "items", item.id); // Burada doc fonksiyonunun doğru kullanıldığından emin olun
      batch.update(itemRef, { listID: item.listID, itemIndex: item.itemIndex });
    });

    try {
      await batch.commit();
      console.log("Firebase güncellemesi başarılı");
      setDB(updatedDB);
    } catch (error) {
      console.error("Firebase güncellemesi sırasında hata: ", error);
    }
  };

  const moveList = async (
    index: number,
    boardID: string,
    setLists: Function,
    lists: List[]
  ): Promise<boolean> => {
    console.log("Move Item Context");
    console.log(lists);

    try {
      console.log("Move list calisiyor");
      console.log("Board IDDD " + boardID);

      // Firebase'den listeleri al
      const boardsRef = collection(database, "lists");
      const q = query(boardsRef, where("boardID", "==", boardID));
      const listsSnapshot = await getDocs(q);
      listsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Mevcut listelerin yedeğini al
      let backupLists = [...lists];

      // Verileri güncelle
      const updatedLists = lists.filter(
        (listItem) => listItem.id !== lists[index].id
      );
      updatedLists.splice(index, 0, lists[index]);

      // indexInList değerlerini güncelle
      updatedLists.forEach((list, idx) => {
        list.indexInBoard = idx;
      });

      console.log(updatedLists);

      // Yerel state'i hemen güncelle
      setLists(updatedLists);

      // Firebase'de toplu güncelleme işlemi
      const batch = writeBatch(database);

      updatedLists.forEach((list) => {
        const listRef = doc(database, "lists", list.id);
        batch.update(listRef, { indexInBoard: list.indexInBoard });
      });

      try {
        await batch.commit();
        console.log("Firebase güncellemesi başarılı");
        return true;
      } catch (error) {
        console.error("Firebase güncellemesi sırasında hata: ", error);
        // Firebase güncellemesi başarısız olursa eski durumu geri yükle
        setLists(backupLists);
        return false;
      }
      return false;
    } catch (error) {
      console.error("moveList fonksiyonunda hata: ", error);
      return false;
    }
  };

  return (
    <MainContext.Provider
      value={{
        addItem,
        addList,
        db,
        lists,
        draggedItemHeight,
        setDraggedItemHeight,
        targetColumnID,
        setTargetColumnID,
        activeItem,
        setActiveItem,
        moveItem,
        activeList,
        setActiveList,
        moveList,
        activeDraggedType,
        setActiveDraggedType,
        activeListIndex,
        setActiveListIndex,
        setActiveItemIndex,
        activeItemIndex,
        user,
        setUser,
        addUser,
        getBoards,
        addBoard,
        boards,
        getListsOfBoard,
        getItem,
        getBGImages,
        getBoardDetails,
        addDescToItem,
        getDecsForItem,
        updateDesc,
        addCommentToItem,
        getItemComments,
        updateComment,
        deleteComment,
        updateLastUsingDate,
        setBoards,
        setDB,
        updateListTitle,
        setLists,
        deleteList,
        updateItemTitle,
        deleteItem,
        showNotification,
        setShowNotification,
        handleNotification,
        notificationMessage,
        setNotificationMessage,
        sendInvitation,
        getBoardInvites,
        deleteInvitation,
        getUserInvitations,
        getBoardAllDetails,
        approveInvite,
        getTeamBoards,
        getBoardUsers,
        teamBoards,
        setTeamBoards,
        getUserPublicData,
        checkUserIsBoardAdmin,
        updateBackground,
        updateBoardName,
        deleteBoard,
        updateBoardDesc,
        toggleFavBoard,
        getIsBoardFav,
        getUserStarredBoards,
        favBoardsIDS,
        setFavBoardsIDS,
        fav,
        setFav,
        removeMemberFromBoard,
        leaveFromBoard,
        canDraggable,
        setCanDraggable,
        itemDragging,
        setItemDragging,
        boardBG,
        setBoardBG,
        getUserName,
        generateData,
        sendInivationToNewUser,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { Provider, MainContext };
