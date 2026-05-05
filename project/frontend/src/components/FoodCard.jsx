import React from "react";

const FoodCard = ({ food }) => {

  const expiryTime = new Date(food.expiry).getTime();
  const now = new Date().getTime();
  const diff = expiryTime - now;

  let expiryText = "Expired";

  if (diff > 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    expiryText = `${hours}h ${minutes}m`;
  }

  return (

    <div className="bg-white shadow-md rounded-lg overflow-hidden">

      {/* Image FIX */}
      {food.image ? (
        <img
          src={`http://localhost:4000/uploads/${food.image}`}
          alt={food.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}

      <div className="p-4">

        <h3 className="text-lg font-semibold">{food.title}</h3>

        <p className="text-gray-600 text-sm">{food.description}</p>

        <div className="mt-2">

          {food.price > 0 ? (
            <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded">
              PAID ₹{food.price}
            </span>
          ) : (
            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">
              FREE
            </span>
          )}

        </div>

        <p className="text-red-500 text-sm mt-2">
          Expires in: {expiryText}
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {food.address}
        </p>

      </div>

    </div>
  );

};

export default FoodCard;