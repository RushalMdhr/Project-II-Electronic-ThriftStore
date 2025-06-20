import { toast } from "react-toastify";

const Home = () => {
  const shownoti = () => {
    toast.success("This is a success message!");
  };

  return (
    <div>
      <h1>Hello Wrold</h1>
      <button onClick={shownoti}>Notice Test</button>
    </div>
  );
};

export default Home;