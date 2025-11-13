import React from "react"
import { useTable } from "react-table"
import "./Table.scss"
import classNames from "classnames"

const Table = ({ columns, data, variant, handleAddNew }) => {
  const tableInstance = useTable({ columns, data })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <div
      className={classNames("table-container", {
        "ingredients-table": variant === "ingredients",
      })}
    >
      <div className="wrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      style: column.style,
                    })}
                    className={column.className}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps({
                        style: cell.column.style,
                      })}
                      className={cell.column.className}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {variant === "ingredients" && (
        <button type="button" className="add-new" onClick={handleAddNew}>
          + Add New
        </button>
      )}

    </div>
  )
}

export default Table
