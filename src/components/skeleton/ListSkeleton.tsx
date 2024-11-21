const ListSkeleton = () => {
  return (
    <div className="w-56 lg:w-72 h-40  p-4 mx-1 rounded-xl dark:bg-gray-800 bg-gray-400 animate-pulse ">
      <div className="h-6 bg-gray-500 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-500 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 g-slate-700 rounded w-5/6"></div>
    </div>
  );
};

export default ListSkeleton;
