import React, { useEffect, useState } from "react";

export default function RequestStatus(){

  const [request,setRequest] = useState(null);

  useEffect(()=>{

    const requestId = localStorage.getItem("activeRequest");

    if(!requestId) return;

    fetch(`http://localhost:4000/api/request/${requestId}`)
      .then(res=>res.json())
      .then(data=>{

        setRequest(data);

        if(data.status !== "pending"){
          localStorage.removeItem("activeRequest");
        }

      });

  },[]);

  if(!request){
    return <p className="text-center mt-10">Checking request status...</p>;
  }

  return(

    <div className="max-w-xl mx-auto p-6 text-center">

      <h1 className="text-3xl font-bold mb-6">
        Food Request Status
      </h1>

      <p>Donor: {request.donorName}</p>

      <p>Phone: {request.donorPhone}</p>

      <p className="mt-4 text-xl">
        Status: {request.status}
      </p>

    </div>

  );

}