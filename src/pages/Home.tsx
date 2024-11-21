import { Link } from "react-router-dom";
import Zirello_Hero from "../assets/zirello-hero.webp";
import HomeCarousel from "../components/Carousel/HomeCarousel";
import { BiWorld } from "react-icons/bi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import ZirelloWhite from "../assets/zirello-white.png";

const Home = () => {
  const footerItems = [
    {
      id: 0,
      title: "About Zirello",
      desc: "What is behind the boards.",
    },
    {
      id: 1,
      title: "Jobs",
      desc: "Learn about open roles on the Zirello team.",
    },
    {
      id: 2,
      title: "Apps",
      desc: "Download the Zirello App for your Desktop or Mobile devices.",
    },
    {
      id: 3,
      title: "Contact us",
      desc: "Need anything? Get in touch and we can help.",
    },
  ];
  //bg-gradient-to-tr from-purple-500 via-purple-500 to-purple-900
  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-purple-500 via-purple-500 to-purple-900">
      <header className=" w-full px-5  ">
        <div className=" flex flex-col justify-between items-center w-full pt-40  mx-auto xl:max-w-[1140px] lg:max-w-[1100px] lg:min-w-[1100px] md:max-w-[1100px] sm:max-w-[540px] lg:flex-row lg:items-start xl:items-start xl:pt-40  ">
          <div className="flex flex-col text-left text-white  w-full md:px-5 lg:min-w-[448px] lg:mt-10 lg:px-0 xl:w-[540px] xl:mt-0 ">
            <div className="text-[1.9rem] md:text-[2.6rem] lg:text-[2.7rem] xl:text-[2.8rem] font-semibold ">
              <p className="leading-10 text-center md:leading-tight lg:text-left">
                Zirello brings all your tasks, teammates, and tools together
              </p>
            </div>
            <p className="text-[1.2rem] px-3 sm:text-[1.4rem] mt-5 text-center lg:text-left lg:p-0 lg:text-[1.3rem]">
              Keep everything in the same place—even if your team isn’t.
            </p>
            <Link
              to={"/login"}
              className="text-center mx-auto bg-blue-600 p-3 mt-12 text-slate-100 w-full rounded-md px-12 hover:bg-blue-900 transition-colors md:w-6/12 lg:w-fit lg:mx-0 "
            >
              Sign up - it's free!
            </Link>
          </div>

          <img
            src={Zirello_Hero}
            className="translate-x-0 lg:translate-x-0  w-full mt-10 md:p-10 lg:w-[633px] lg:p-0 lg:m-0 xl:w-[633px] xl:translate-x-20 xl:-translate-y-14 "
          />
        </div>
      </header>

      <img
        src="https://images.ctfassets.net/rz1oowkt5gyp/7lTGeXbBRNRLaVk2MdBjtJ/99c266ed4cb8cc63bd0c388071f01ff6/white-wave-bg.svg"
        className=" -mt-20 md:-mt-36 w-full lg:-mt-24 xl:-mt-48"
      />
      <main className="w-full bg-gradient-to-b from-white to-purple-200 px-5  pt-20  pb-24">
        <div className="mx-auto xl:max-w-[1140px] lg:max-w-[1100px] md:max-w-[720px] sm:max-w-[540px] ">
          <h1 className="text-slate-800  text-md font-semibold  text-left mb-0">
            ZIRELLO 101
          </h1>
          <h1 className="text-slate-900 font-semibold text-2xl text-left mb-4 md:text-[2.1rem] md:w-72 md:leading-tight xl:w-full">
            A productivity powerhouse
          </h1>
          <p className="text-lg text-left w-full md:w-7/12 md:text-[1.2rem] md:leading-normal xl:mb-10">
            Simple, flexible, and powerful. All it takes are boards, lists, and
            cards to get a clear view of who’s doing what and what needs to get
            done. Learn more in our guide for getting started.
          </p>
          <HomeCarousel />
        </div>
      </main>

      <footer className="bg-[rgb(23,43,77)] h-full pb-12 pt-5  w-full px-5 ">
        <div className="mx-auto xl:max-w-[1140px] lg:max-w-[1100px] md:max-w-[720px] sm:max-w-[540px] flex flex-col">
          <div className="flex flex-col  gap-2 justify-between w-full lg:flex-row  lg:items-start">
            <Link to={"/"}>
              <img src={ZirelloWhite} className="w-44" />
            </Link>
            {footerItems.map((item) => (
              <>
                <div className="border-b border-slate-600 mx-1 "></div>
                <div
                  key={item.id}
                  className="lg:flex-1 text-left cursor-pointer hover:bg-[rgb(34,58,99)] px-3 text-white"
                >
                  <p>{item.title}</p>
                  <p className="text-xs mt-2">{item.desc}</p>
                </div>
              </>
            ))}
          </div>

          <div className="border-b border-slate-600 my-3 mx-1"></div>

          <div className="flex flex-col justify-between items-start  gap-8 px-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3 md:w-40">
              <BiWorld className="text-slate-100 w-6 h-6" />
              <select className="w-52 h-12 p-3 rounded-md bg-transparent text-slate-100">
                <option>Deutsch</option>
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Português</option>
                <option>中文</option>
                <option>हिन्दी</option>
                <option>العربية</option>
                <option>Русский</option>
                <option>日本語</option>
                <option>Türkçe</option>
              </select>
            </div>

            <div className="text-white text-left text-xs flex flex-col  gap-4 cursor-pointer md:w-full md:flex-row">
              <p className="hover:underline">Your privacy choices</p>
              <p className="hover:underline">Privacy Policy</p>
              <p className="hover:underline">Terms</p>
              <p>Copyright © 2024 Zirello by Emre Karaduman</p>
            </div>

            <div className="flex gap-6 mt-4 text-slate-50 w-full md:items-center md:justify-center md:mt-0 md:w-fit ">
              <FaInstagram className="w-7 h-7 hover:text-slate-300 cursor-pointer" />
              <FaFacebook className="w-7 h-7 hover:text-slate-300 cursor-pointer" />
              <FaLinkedin className="w-7 h-7 hover:text-slate-300 cursor-pointer" />
              <FaTwitter className="w-7 h-7 hover:text-slate-300 cursor-pointer" />
              <FaYoutube className="w-7 h-7 hover:text-slate-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>

    // <div className="bg-yellow-600 w-full">
    //   <section className="bg-gradient-to-tr from-purple-500 via-purple-500 to-purple-900 pt-52 flex flex-col items-center justify-center w-full ">
    //     <div className="xl:w-[1400px] lg:w-[1200px] md:w-[700px]  flex flex-row items-start justify-center xl:bg-yellow-400 lg:bg-red-400 md:bg-blue-500 lg:px-20 md:px-14">
    //       <div className="flex flex-col items-start">
    //         <p className="text-white xl:min-w-[700px] xl:w-[700px]  lg:min-w-[500px] lg:w-[500px] md:w-[350px] md:min-w-[350px] text-5xl text-left font-semibold leading-tight">
    //           Zirello brings all your tasks, teammates, and tools together.
    //         </p>
    //         <p className="text-2xl text-left">
    //           Keep everything in the same place—even if your team isn’t.
    //         </p>
    //         <Link to={"/login"} className="bg-blue-500 px-8 py-3">
    //           <p>Sign up - it's free!</p>
    //         </Link>
    //       </div>
    //       <img
    //         src={Zirello_Hero}
    //         className="xl:min-w-[700px] xl:w-[700px]  lg:min-w-[500px] lg:w-[500px] md:w-[350px] md:min-w-[350px]"
    //       />
    //     </div>
    //   </section>
    // </div>
  );
};

export default Home;
