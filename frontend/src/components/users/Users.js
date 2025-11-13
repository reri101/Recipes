import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as actions from "./UsersActions"
import { showModal } from "../../modalSlice"
import Icon from "../Icon/Icon"
import { ReactComponent as UsersIcon } from "../../assets/icons/users.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import fallbackImage from "../../assets/images/profile.jpg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Table from "../table/Table"
import Modal from "../modal/Modal"
import PhotoFormatter from "../photoFormatter/PhotoFormatter"

function Users() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getUsers((data) => setUsers(data))
  }, [])

  const handleEdit = (userId) => {
    navigate(`/user/${userId}`)
  }

  const handleDeleteUser = (userId) => {
    actions.deleteUser(userId, () => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    })
  }

  const handleDelete = (userId, userName) => {
    dispatch(showModal({ id: userId, name: userName }))
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Users",
        accessor: "name",
        className: "align-left",
        Cell: ({ row }) => {
          const photoUrl = row.original.photo?.url
            ? `${row.original.photo.url}`
            : null

          return (
            <PhotoFormatter
              photoUrl={photoUrl}
              altText="No image"
              name={`${row.original.name} ${row.original.surname}`}
            />
          )
        },
      },
      {
        Header: "Options",
        accessor: "id",
        className: "align-right",
        Cell: ({ value, row }) => (
          <div className="options">
            <Icon
              icon={EditIcon}
              onClick={() => handleEdit(value)}
              type="options"
            />
            <Icon
              icon={DeleteIcon}
              onClick={() => handleDelete(value, row.original.name)}
              type="options"
            />
          </div>
        ),
      },
    ],
    []
  )
  return (
    <div className="users">
      <BreadcrumbSection
        icon={UsersIcon}
        pathLinks={{ path: "/users", label: "Users" }}
        actionButton={{
          label: "+ Add new",
          onClick: () => navigate("/user"),
        }}
      />

      <Table columns={columns} data={users} />
      <Modal onDelete={handleDeleteUser} itemName="user" />
    </div>
  )
}

export default Users
