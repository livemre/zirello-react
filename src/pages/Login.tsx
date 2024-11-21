import { useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { MainContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { setUser, addUser, user } = context;

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const navigate = useNavigate();

  const signIn = async () => {
    return await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user);

        if (user) {
          console.log("user var");

          setUser(user);
          let userImage: string =
            "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

          if (user.email && user.displayName) {
            console.log("email ve displayname var");
            if (user.photoURL !== null) {
              userImage = user.photoURL;
            }

            addUser(user.uid, user.email, user.displayName, userImage);
          }
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);

        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  if (user) {
    navigate("/boards");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen pt-20 bg-gradient-to-b from-white to-purple-200">
      <div className="border shadow-lg full p-8 bg-white m-4">
        <p className="px-4 text-lgl">
          Sign in with your Google account to use Zirello
        </p>

        <div
          className="flex items-center justify-center border m-2 p-2 cursor-pointer hover:bg-gray-100"
          onClick={signIn}
        >
          <FcGoogle size={32} />
          <p className="font-bold  ml-2">Google</p>
        </div>
        {/* <div className="flex items-center justify-between px-4 mt-12">
          <div className="bg-black h-[1px] flex-1"></div>
          <div className="px-4">Soon</div>
          <div className="bg-black h-[1px] flex-1"></div>
          <div className="border "></div>
        </div> */}
        {/* <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <TiVendorMicrosoft size={32} />
          <p className="font-bold ml-2">Microsoft</p>
        </div>
        <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <FaGithub size={32} />
          <p className="font-bold ml-2">Github</p>
        </div>
        <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <FaSlack size={32} />
          <p className="font-bold ml-2">Slack</p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
