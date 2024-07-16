"use client";

import { Descriptive } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api } from "~/trpc/react";
import { invoiceGenUseStore } from "../stores/invoice-gen-store";
import { useRouter } from "next/navigation";

export default function DescriptivesList() {
  const descriptives = api.descriptive.getAllDescriptives.useQuery(undefined, {
    initialData: [],
  });
  const updateDescriptive = invoiceGenUseStore(
    (state) => state.updateDescriptive,
  );
  const route = useRouter();

  const columnHelper = createColumnHelper<Descriptive>();

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("clientName", {
      header: () => "Age",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("clientAddress", {
      header: () => <span>Visits</span>,
    }),
    columnHelper.display({
      id: "edit",
      cell: (info) => (
        <button
          className="btn btn-circle"
          onClick={() => {
            updateDescriptive(info.row.original);
            route.push("invoiceGen");
          }}
        >
          <svg
            className="inline-block h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path>
          </svg>
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: descriptives.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
