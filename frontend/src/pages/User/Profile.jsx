import { useSelector ,useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import Tabs from "../../components/Product/Tabs";
import { useGetCurrentUserQuery } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";

const Profile = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: currentUser, isFetching, isSuccess } = useGetCurrentUserQuery();

  // --- FIX: Correct sync state with backend user ---
  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(setCredentials(currentUser)); // updates Redux + localStorage
    }
  }, [isSuccess, currentUser, dispatch]);

  const user = currentUser || userInfo; // fallback

  if (isFetching || !user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- COVER + AVATAR SECTION ---------- */}
      <section className="px-4 pt-4">
        {/* Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-md">
          <img
            src={user.coverImage || "/uploads/cover/default.png"}
            alt="Cover"
            className="w-full h-56 md:h-72 object-cover"
          />
        </div>

        {/* Profile Area */}
        <div className="relative -mt-4">
          <div className="flex items-center gap-6 ml-[20%]">
            {/* Profile Image */}
            <img
              src={user.profileImage || "/uploads/profile/default.png"}
              alt={user.username}
              className="w-40 h-40 rounded-full ring-4 ring-white shadow-2xl object-cover"
            />

            {/* LEFT COLUMN – Username / Email / Vendor Badge / Edit */}
            <div className="flex flex-col justify-center gap-2">
              {/* Username */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.username}
              </h1>

              {/* Email */}
              <p className="text-gray-600">{user.email}</p>

              {/* Vendor Badge */}
              <span
                className="inline-flex items-center bg-blue-100 border border-blue-300 text-blue-700 
               px-3 py-1 rounded-full text-xs font-medium w-fit"
              >
                {user?.isAdmin
                  ? "Admin"
                  : user?.isVendor
                  ? "Vendor"
                  : "Customer"}
              </span>

              {/* Market-ready CTA
              <Link
                to="/profile/edit"
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5
               bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
               text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl
               transition-all duration-200 active:scale-[0.98]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
                Edit Profile
              </Link> */}
            </div>

            {/* RIGHT SIDE BADGES */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                {/* Admin Badge */}
                <span className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold shadow-md">
                  A
                </span>

                {/* Vendor Badge */}
                <span className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold shadow-md">
                  V
                </span>

                {/* Sales Badge */}
                <span className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-500 text-white text-base font-bold shadow-md">
                  ⭐
                </span>

                {/* Blacklist Badge */}
                <span className="w-20 h-20 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold shadow-md">
                  !
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TABS SECTION ---------- */}
      <section className="pt-12 pb-12 px-4 max-w-5xl mx-auto">
        <Tabs labels={["About", "Products", "Reviews"]}>
          <div label="About">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                  Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  {[
                    ["Street", user.shippingAddress?.street],
                    ["City", user.shippingAddress?.city],
                    ["District", user.shippingAddress?.district],
                    ["Province", user.shippingAddress?.province],
                    ["ZIP", user.shippingAddress?.zipCode],
                    ["Phone", user.shippingAddress?.phone],
                  ].map(([label, val]) => (
                    <p key={label}>
                      <span className="text-gray-400">{label}:</span>{" "}
                      <span className="font-medium">{val || "N/A"}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center">
                <p className="text-sm text-gray-400">Member since</p>
                <p className="text-xl font-semibold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 mt-6">{user.bio || "No bio yet."}</p>
          </div>

          <div label="Products">
            <p className="text-gray-600">
              Products listed by {user.username} appear here.
            </p>
          </div>

          <div label="Reviews">
            <p className="text-gray-600">
              Reviews for {user.username} appear here.
            </p>
          </div>
        </Tabs>
      </section>
    </div>
  );
};

export default Profile;
