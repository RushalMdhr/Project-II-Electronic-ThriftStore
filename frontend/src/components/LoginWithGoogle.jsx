import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";

const LoginWithGoogle = () => {
  return (
    <>
      <h1>Login with Google</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
            // const decoded = jwt_decode(credentialResponse.credential);
            // console.log(decoded);
            console.log(credentialResponse); //here are some mistakes u need to tackle
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;
    </>
  );
};

export default LoginWithGoogle;
