import { useQuery } from "@tanstack/react-query";

import { FaUserTie, FaBriefcase, FaStar } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";



const MeetOurAgents = () => {

  const axiosSecure = useAxiosSecure();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['featured-agents'],
    queryFn: async () => {
      const res = await axiosSecure.get('/get-agents');
      return res.data;
    }
  });

  if (isLoading) return <p className="text-center py-8">Loading agents...</p>;

  return (
    <section className="px-6 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8">
      
      <div className="mb-10 text-center">
        <h2 className="text-5xl font-bold">Meet Our <span className="text-primary">Agents </span></h2>
        <p className="text-gray-500 mt-2">Get to know our professional and dedicated insurance agents.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map(agent => (
          <div
            key={agent._id}
            className="bg-white space-y-4 shadow-lg rounded-xl p-2 text-center hover:shadow-xl transition"
          >
            <img
              src={agent.photoURL || "https://i.ibb.co/Y3fKn7F/default-banner.jpg"}
              alt={agent.name}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <h3 className="text-xl font-semibold text-primary">{agent.name}</h3>
            <p className="text-gray-600 mt-1 flex justify-center items-center gap-1">
              <FaBriefcase /> {agent.experience || '2+ years'} Experience
            </p>
            <p className="mt-2 text-sm text-gray-500">{agent.specialties || 'Life, Health, Retirement'}</p>
            <p className="mt-1 text-xs text-gray-400">{agent.email}</p>
            <div className="mt-3 flex justify-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetOurAgents;
