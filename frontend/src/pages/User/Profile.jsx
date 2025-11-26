import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (!userInfo) return <p className="text-emerald-700">Loading…</p>;

  const isVendor = userInfo.isVendor;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- COVER + AVATAR SECTION ---------- */}
      <section className="px-4 pt-4">
        {/* Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-md">
          <img
            src={userInfo.coverImage || "/uploads/cover/default.png"}
            alt="Cover"
            className="w-full h-56 md:h-72 object-cover"
          />
        </div>

        {/* Profile Area */}
        <div className="relative">
          <div className="flex items-end gap-5 -mt-5 ml-[20%]">
            {/* Profile Image Overlap */}
            <img
              src={userInfo.profileImage || "/uploads/profile/default.png"}
              alt="Profile"
              className="w-50 h-50 rounded-full object-cover ring-4 ring-white shadow-xl"
            />

            {/* Name, Email, Button */}
            <div className="pb-5">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {userInfo.username}
              </h1>
              <p className="text-gray-600">{userInfo.email}</p>

              <Link
                to="/profile/edit"
                className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MAIN GRID SECTION ---------- */}
      <section className="pt-20 pb-12 px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* ---------- SHIPPING ADDRESS ---------- */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Shipping Address
          </h2>

          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              ["Street", userInfo.shippingAddress?.street],
              ["City", userInfo.shippingAddress?.city],
              ["District", userInfo.shippingAddress?.district],
              ["Province", userInfo.shippingAddress?.province],
              ["ZIP", userInfo.shippingAddress?.zipCode],
              ["Phone", userInfo.shippingAddress?.phone],
            ].map(([label, val]) => (
              <p key={label}>
                <span className="text-gray-400">{label}:</span>{" "}
                <span className="font-medium">{val || "N/A"}</span>
              </p>
            ))}
          </div>
        </div>

        {/* ---------- MEMBER SINCE ---------- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center">
          <p className="text-sm text-gray-400">Member since</p>
          <p className="text-xl font-semibold text-gray-800">
            {new Date(userInfo.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* ---------- VENDOR SECTION ---------- */}
        {isVendor && (
          <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
            {/* Vendor Card */}
            <div className="md:col-span-2 bg-emerald-50 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                Vendor Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="text-gray-500">Shop Name:</span>{" "}
                  <span className="font-medium">
                    {userInfo.shopName || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Sales:</span>{" "}
                  <span className="font-medium">{userInfo.sales || 0}</span>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-gray-500">Description:</span>{" "}
                  <span className="font-medium">
                    {userInfo.shopDescription || "N/A"}
                  </span>
                </p>
              </div>

              {/* Income Overview */}
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Total", userInfo.income?.total],
                  ["Received", userInfo.income?.received],
                  ["Pending", userInfo.income?.pending],
                ].map(([label, amt]) => (
                  <div
                    key={label}
                    className="bg-white/70 rounded-xl p-3 shadow"
                  >
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-lg font-semibold text-emerald-700">
                      Rs. {amt || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Products */}
            <div className="md:col-span-3 mt-4">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                Your Products
              </h3>

              {userInfo.products?.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {userInfo.products.map((p) => (
                    <Link
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {p.name}
                        </h4>
                        <p className="text-sm text-emerald-600 font-bold mt-1">
                          Rs. {p.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No products added yet.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
