import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/DataTable";
import { RootState } from "../redux/store";
import {
  setUsers,
  setTotalUsers,
  setUserPageSize,
} from "../redux/slices/userSlice";
import { IUser } from "../utils/interface";
import { IFilterKeys } from "../utils/interface";
import { API_URLS, DATA_TYPES } from "../constants/global";

const Users: React.FC = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, userPageSize } = useSelector(
    (state: RootState) => state.users
  );

  const columns: { header: string; accessor: keyof IUser }[] = [
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Maiden Name", accessor: "maidenName" },
    { header: "Birth Date", accessor: "birthDate" },
    { header: "Gender", accessor: "gender" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Username", accessor: "username" },
    { header: "Height", accessor: "height" },
    { header: "Blood Group", accessor: "bloodGroup" },
    { header: "Eye Color", accessor: "eyeColor" },
  ];

  const filterKeys: IFilterKeys[] = [
    { title: "Name", key: "firstName", type: "text" },
    { title: "Email", key: "email", type: "text" },
    { title: "Birth Date", key: "birthDate", type: "date" },
    {
      title: "Gender",
      key: "gender",
      type: "select",
      dropdownValues: ["male", "female"],
    },
  ];

  return (
    <div>
      <DataTable<IUser>
        columns={columns}
        fetchUrl={API_URLS.USERS}
        dataType={DATA_TYPES.USERS}
        setData={(data: IUser[]) => dispatch(setUsers(data))}
        data={users}
        setTotalData={(total: number) => dispatch(setTotalUsers(total))}
        totalData={totalUsers}
        filterKeys={filterKeys}
        pageSize={userPageSize}
        setPageSize={(size: number) => dispatch(setUserPageSize(size))}
      />
    </div>
  );
};

export default Users;
