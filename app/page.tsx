import { Member } from "@/app/types/Member";


export default async function Home() {

  const res = await fetch('http://localhost:3000/api/members', {
    cache: 'no-store' // Use this if you want fresh data on every request
  });

  const data: Member[] = await res.json()

  return (
  <div className="p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      
      {/* Use .map() to loop through the array. 
        Note the "key" prop on the <li> - React requires a unique key for every item in a list! 
      */}
      <ul className="space-y-3">
        {data.map((member) => (
          <li 
            key={member.id} 
            className="border border-gray-200 p-4 rounded-lg shadow-sm"
          >
            <p className="font-semibold text-lg">{member.name}</p>
            <p className="text-gray-600">{member.email}</p>
          </li>
        ))}
      </ul>
      
    </div>
  );
}
