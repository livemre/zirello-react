import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/Context";
import { IoMdNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const Notification = () => {
  const [visible, setVisible] = useState(false); // Başlangıçta görünür değil

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  const { showNotification, setShowNotification, notificationMessage } =
    context;

  useEffect(() => {
    if (showNotification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setShowNotification(false), 300); // Bildirim kaybolduktan sonra gösterimi kapat
      }, 3000); // Bildirimin ekranda kalacağı süre

      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [showNotification, setShowNotification]);

  return (
    <>
      {showNotification && (
        <div
          className={`w-full z-[10000] bg-blue-700 dark:bg-black  fixed right-0 shadow-2xl top-0 p-4 transition-all duration-300 ease-linear ${
            visible ? "-translate-y-0 opacity-100" : " -translate-y-0 opacity-0"
          }`}
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <IoMdNotifications size={24} className="text-slate-200" />
              <p className="text-slate-200">
                {notificationMessage || "New card added..."}
              </p>
            </div>
            <IoClose
              size={24}
              className="text-slate-200 cursor-pointer hover:text-slate-300"
              onClick={() => setShowNotification(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
