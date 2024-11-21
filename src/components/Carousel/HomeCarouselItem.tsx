import { FC, useState } from "react";

type Props = {
  getIndex: (index: number) => void;
};

const HomeCarouselItem: FC<Props> = ({ getIndex }) => {
  const [activeItem, setActiveItem] = useState(0);
  const items = [
    {
      id: 0,
      title: "Boards",
      desc: ' Zirello boards keep tasks organized and work moving forward. In a glance, see everything from "things to do to "aww yeah, we did it!"',
    },
    {
      id: 1,
      title: "Lists",
      desc: "The different stages of a task. Start as simple as To Do, Doing or Done-or build a workflow custom fit to your team's needs. There's nowrong wat to Zirello",
    },
    {
      id: 2,
      title: "Cards",
      desc: "Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.",
    },
  ];

  return (
    <div className="w-full lg:w-96 lg:h-full  md:w-full text-left flex flex-col ">
      {items.map((item, index) => {
        return (
          <div
            onClick={() => {
              setActiveItem(index);
              getIndex(index);
            }}
            className={`rounded-md  p-4 cursor-pointer  w-full  lg:mb-4 lg:w-[380px] ${
              activeItem === index
                ? "border-l-8 border-purple-500 bg-white shadow-2xl"
                : "bg-transparent border-l-8 border-transparent"
            }`}
            key={item.id}
          >
            <p className="text-lg mb-1 font-semibold">{item.title}</p>
            <p className="text-md">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HomeCarouselItem;
