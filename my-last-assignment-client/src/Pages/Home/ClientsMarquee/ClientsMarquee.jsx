import React from 'react';
import Marquee from "react-fast-marquee";
import client1 from "../../../assets/clients/client1.jpg";
import client2 from "../../../assets/clients/client2.jpg"
import client3 from "../../../assets/clients/client3.jpg"
import client4 from "../../../assets/clients/client4.jpg"
import client5 from "../../../assets/clients/client6.jpg"
import client6 from "../../../assets/clients/client1.jpg"


const ClientsMarquee = () => {

  const clients = [
  client1,
  client2,
  client3,
  client4,
  client5,
  client6,
];
    return (
      <div className="py-18">
      <h2 className="text-center text-5xl text-primary font-bold mb-16">Our <span className='text-gray-600'>Clients</span></h2>
      <Marquee speed={50} pauseOnHover={true} gradient={false}>
        {clients.map((client, index) => (
          <div key={index} className="mx-4 w-[350px] h-[400px] flex items-center">
            <img src={client} alt={`Client ${index}`} className="h-full object-contain" />
          </div>
        ))}
      </Marquee>
    </div>
        
    );
};

export default ClientsMarquee;