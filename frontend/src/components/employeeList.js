import { useState, useMemo } from "react";
import { api } from "../api";
import ConfirmModal from "./confirmModal";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function EmployeeList({
  employees,
  setEmployees,
  getBadge,
  showNotification,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // =========================
  // CONFIRM DELETE
  // =========================
  const confirmDelete = async () => {
    try {
      await api.delete(`/employees/${deleteId}`);

      setEmployees((prev) =>
        prev.filter((e) => e.employee_id !== deleteId)
      );

      showNotification("Employee deleted successfully", "success");
    } catch (error) {
      showNotification("Delete failed", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async () => {
    try {
      const res = await api.put(`/employees/${editingId}`, {
        ...editForm,
        experience: Number(editForm.experience),
      });

      setEmployees((prev) =>
        prev.map((e) =>
          e.employee_id === editingId ? res.data : e
        )
      );

      setEditingId(null);
      showNotification("Employee updated successfully", "success");
    } catch (error) {
      showNotification("Update failed", "error");
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      `${e.name} ${e.role} ${e.dept} ${e.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade">
      <h2 className="text-xl font-semibold mb-4">
        Employee List
      </h2>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-6 border rounded-lg px-3 py-2">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredEmployees.map((e) => (
          <div
            key={e.employee_id}
            className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center border rounded-lg p-3 transition-all duration-300 bg-white hover:shadow"
          >
            {editingId === e.employee_id ? (
              <>
                <input
                  className="border rounded px-2 py-1"
                  value={editForm.name}
                  onChange={(ev) =>
                    setEditForm({ ...editForm, name: ev.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  value={editForm.role}
                  onChange={(ev) =>
                    setEditForm({ ...editForm, role: ev.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  value={editForm.dept}
                  onChange={(ev) =>
                    setEditForm({ ...editForm, dept: ev.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  value={editForm.email}
                  onChange={(ev) =>
                    setEditForm({ ...editForm, email: ev.target.value })
                  }
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  value={editForm.experience}
                  onChange={(ev) =>
                    setEditForm({
                      ...editForm,
                      experience: ev.target.value,
                    })
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  value={editForm.description || ""}
                  onChange={(ev) =>
                    setEditForm({
                      ...editForm,
                      description: ev.target.value,
                    })
                  }
                />

                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <CheckIcon className="w-5 h-5" />
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="font-medium">{e.name}</div>
                <div>{e.role}</div>
                <div>{e.dept}</div>
                <div>{e.email}</div>

                <div className="flex flex-col">
                  <span>{e.experience} yrs</span>
                  <span className="text-xs font-semibold text-gray-600">
                    {getBadge(e.experience)}
                  </span>
                </div>

                <div>{e.description}</div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setEditingId(e.employee_id);
                      setEditForm(e);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setDeleteId(e.employee_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No employees found.
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteId !== null}
        text="Are you sure you want to delete this employee?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default EmployeeList;
