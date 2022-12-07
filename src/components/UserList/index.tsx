import clsx from "clsx";
import { useMemo } from "react";
import { BsTrash } from "react-icons/bs";
import { relativeDateTime } from "../../utils/date";
import { DataTable } from "../DataTable";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";

type UserListProps = {
  data: any[];
  isLoading?: boolean;
  deleteUser: (userId: string) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ cell: { value } }: { cell: { value: Date } }) =>
  relativeDateTime(value);

const getColumns = (deleteUser: (userId: string) => void) => {
  return [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Email",
      accessor: "email",
      Aggregated: ""
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: DateCell,
      sortType: "datetime",
      Aggregated: ""
    },
    {
      Header: "State",
      accessor: "state",
      Aggregated: ""
    },
    {
      Header: "Actions",
      accessor: "id",
      Aggregated: "",
      Cell: ({ row }: any) => {
        const userId = row.values.id;
        return (
          <ActionMenu
            deleteUser={() => {
              deleteUser(userId);
            }}
          />
        );
      }
    }
  ];
};

function ActionMenu({ deleteUser }: { deleteUser: () => void }) {
  return (
    <Menu>
      <Menu.VerticalIconButton />
      <Menu.Items widthClass="w-48 right-32">
        <Menu.Item
          onClick={() => {
            deleteUser();
          }}
        >
          <IconButton
            className="bg-transparent group-hover:inline-block z-5 mr-2"
            ovalProps={{
              stroke: "blue",
              height: "18px",
              width: "18px",
              fill: "transparent"
            }}
            icon={
              <BsTrash
                className="text-gray-600 border-0 border-gray-200 border-l-1"
                size={18}
              />
            }
          />
          Delete
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export function UserList({
  data,
  isLoading,
  className,
  deleteUser,
  ...rest
}: UserListProps) {
  const columns = useMemo(() => {
    return getColumns(deleteUser);
  }, [deleteUser]);

  return (
    <div className={clsx(className)} {...rest}>
      <DataTable
        stickyHead
        columns={columns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        usageSection="user-list"
        style={{ maxHeight: "calc(100vh - 12rem)" }}
      />
    </div>
  );
}
