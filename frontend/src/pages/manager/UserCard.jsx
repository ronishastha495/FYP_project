import React from "react";

const UsersCard = ({ users }) => (
  <div id="users" className="bg-white shadow-lg rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Users Information</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-center">Appointments</th>
            <th className="py-3 px-6 text-center">Last Activity</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users?.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{user.name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-center">{user.appointmentsCount || 0}</td>
              <td className="py-3 px-6 text-center">{user.lastActivity || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersCard;