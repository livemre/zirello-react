const BoardCardSkeleton = () => {
  return (
    <div className=" bg-gray-200 relative w-52 min-h-24 min-w-52 h-24 rounded-md cursor-pointer border hover:border border-slate-900 hover:border-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center filter brightness-50 animate-pulse"></div>
      <div className="relative h-full w-full flex flex-col justify-between p-3 z-10"></div>
    </div>
  );
};

export default BoardCardSkeleton;
