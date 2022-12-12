import { useEffect, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import {
  deleteUser,
  getRegisteredUsers,
  inviteUser,
  RegisteredUser
} from "../api/services/users";
import { Modal } from "../components";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import {
  InviteUserForm,
  InviteUserFormValue
} from "../components/InviteUserForm";
import { SearchLayout } from "../components/Layout";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { UserList } from "../components/UserList";
import { useLoader } from "../hooks";

export function UsersPage() {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [deletedUserId, setDeletedUserId] = useState<string>();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { loading, setLoading } = useLoader();

  const onSubmit = async (val: InviteUserFormValue) => {
    try {
      await inviteUser(val);
      const userName = `${val.firstName} ${val.lastName}`;
      toastSuccess(`${userName} invited successfully`);
      setIsOpen(false);
      fetchUsersList();
    } catch (ex) {
      toastError(ex as any);
    }
  };

  async function fetchUsersList() {
    setLoading(true);
    try {
      const { data } = await getRegisteredUsers();
      setUsers(data || []);
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  }

  async function deleteUserAction(userId: string | undefined) {
    if (!userId) {
      return;
    }
    try {
      const { data } = await deleteUser(userId);
      fetchUsersList();
      if (data) {
        toastSuccess(`user deleted successfully`);
      }
    } catch (ex) {
      toastError(ex);
    }
  }

  useEffect(() => {
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchLayout
      title={<div className="flex text-xl font-semibold">Users</div>}
      onRefresh={() => {
        fetchUsersList();
      }}
      contentClass="p-0 h-full"
      loading={loading}
    >
      <div className="max-w-screen-xl mx-auto h-full space-y-6 flex flex-col mt-6">
        <div className="flex justify-end">
          <button className="btn-primary w-36" onClick={(e) => setIsOpen(true)}>
            <ImUserPlus className="mr-2" />
            Invite User
          </button>
        </div>
        <UserList
          className="mt-6 overflow-y-hidden"
          data={users}
          isLoading={loading}
          deleteUser={(userId) => {
            setDeletedUserId(userId);
            setOpenDeleteConfirmDialog(true);
          }}
        />
        <Modal
          title="Invite User"
          onClose={() => {
            setIsOpen(false);
          }}
          open={isOpen}
          bodyClass=""
        >
          <InviteUserForm
            className="flex flex-col bg-white p-4"
            onSubmit={onSubmit}
          />
        </Modal>
        <DeleteConfirmDialog
          isOpen={openDeleteConfirmDialog}
          title="Delete User ?"
          description="Are you sure you want to delete this user ?"
          onClose={() => setOpenDeleteConfirmDialog(false)}
          onDelete={() => {
            deleteUserAction(deletedUserId);
          }}
        />
      </div>
    </SearchLayout>
  );
}
