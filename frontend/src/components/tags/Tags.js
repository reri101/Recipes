import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as actions from "./TagsActions"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Table from "../table/Table"
import Icon from "../Icon/Icon"
import { ReactComponent as TagsIcon } from "../../assets/icons/tags-svg.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"

function Tags() {
  const [tags, setTags] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getTags((data) => setTags(data))
  }, [])

  const handleEdit = (tagId) => {
    navigate(`/tag/${tagId}`)
  }

  const handleDeleteTag = (tagId) => {
    actions.deleteTag(tagId, () => {
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId))
    })
  }

  const handleDelete = (tagId, tagName) => {
    dispatch(showModal({ id: tagId, name: tagName }))
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Tag",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="info">
            <div className="name">{row.original.name}</div>
          </div>
        ),
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
    <div className="tags">
      <BreadcrumbSection
        icon={TagsIcon}
        pathLinks={{ path: "/tags", label: "Tags" }}
        actionButton={{
          label: "+ Add new",
          onClick: () => navigate("/tag"),
        }}
      />

      <Table columns={columns} data={tags} />
      <Modal onDelete={handleDeleteTag} itemName="tag" />
    </div>
  )
}

export default Tags
