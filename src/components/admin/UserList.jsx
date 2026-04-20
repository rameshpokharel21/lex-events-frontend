import { useState } from "react";
import { deleteUser, fetchAllUsers } from "../../services/api";
import Spinner from "../Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UserList = () => {
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
 
  const {data: users = [], isLoading, error} = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: userId => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users"]});
    },
    onSettled: () => {
      setShowConfirm(false);
      setSelectedUser(null);
    },
  });
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to fetch users. {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <div
          key={user.userId}
          className="flex justify-between border p-2 mb-1 rounded"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-purple-400">{user.userId} </span>
            <span className="text-black-400">{user.username} </span>
            <span className="text-green-600 ml-2">({user.email})</span>
            <span className="text-blue-600 ml-2">({user.phoneNumber})</span>
          </div>
          <button
            onClick={() => confirmDelete(user)}
            disabled={deleteMutation.isPending && selectedUser?.userId === user.userId}
            className={`px-3 py-1 rounded text-white ${
              deleteMutation.isPending && selectedUser?.userId === user.userId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {deleteMutation.isPending && selectedUser?.userId === user.userId ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}

      {showConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure to delete user{" "}
              <strong>{selectedUser.username}</strong>
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={() => deleteMutation.mutate(selectedUser.userId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
