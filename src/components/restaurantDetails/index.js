import React from "react";
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {
  const { id } = useParams(); 

  React.useEffect(() => {
    console.log("Restaurant ID:", id);
  }, [id]);

  return (
    <div>
      <h2>Restaurant Details</h2>
      <p>Restaurant Email: {atob(id)}</p>
    </div>
  );
};

export default RestaurantDetails;
