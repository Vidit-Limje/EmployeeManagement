import { useState } from "react";
import { api } from "../api";
import { UserPlusIcon } from "@heroicons/react/24/solid";

function AddEmployee({ setEmployees, showNotification }) {
  const departments = ["APIM", "DM", "DAD", "CS", "AI"];

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    dept: "APIM",
    role: "",
    email: "",
    experience: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    // =========================
    // FRONTEND VALIDATION
    // =========================
    if (!form.employee_id || !form.name || !form.email || !form.dept) {
      showNotification(
        "Employee ID, Name, Email and Department are required.",
        "error"
      );
      return;
    }

    if (Number(form.experience) < 0) {
      showNotification("Experience cannot be negative.", "error");
      return;
    }

    try {
      const payload = {
        ...form,
        employee_id: Number(form.employee_id),
        experience: Number(form.experience || 0),
      };

      const res = await api.post("/employees/", payload);

      setEmployees((prev) => [...prev, res.data]);

      // Reset form
      setForm({
        employee_id: "",
        name: "",
        dept: "APIM",
        role: "",
        email: "",
        experience: "",
        description: "",
      });

      showNotification("Employee added successfully!", "success");

    } catch (error) {
      const backendMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        "Failed to add employee";

      showNotification(backendMessage, "error");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade"
    >
      <div className="flex items-center gap-2 mb-4">
        <UserPlusIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Add Employee</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Employee ID */}
        <input
          type="number"
          placeholder="Employee ID"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.employee_id}
          onChange={(e) =>
            setForm({ ...form, employee_id: e.target.value })
          }
        />

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* Department */}
        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.dept}
          onChange={(e) =>
            setForm({ ...form, dept: e.target.value })
          }
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Role */}
        <input
          type="text"
          placeholder="Role"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Experience */}
        <input
          type="number"
          min="0"
          placeholder="Experience (years)"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.experience}
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
        />

        {/* Description */}
        <input
          type="text"
          placeholder="Description"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="mt-5 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <UserPlusIcon className="w-5 h-5" />
        Add Employee
      </button>
    </form>
  );
}

export default AddEmployee;
