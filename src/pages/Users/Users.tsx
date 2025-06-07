import { User } from "lucide-react";
import UserTable from "../../components/UsersPage/UserTable/UserTable";

const Users = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <User className="h-6 w-6 mr-2" />
        All Users
      </h2>
      <UserTable />
    </div>
  );
};

export default Users;
