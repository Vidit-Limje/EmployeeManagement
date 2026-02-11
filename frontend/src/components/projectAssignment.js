import { useState } from "react";

function ProjectAssignment({ employees }) {
  const departments = ["APIM", "DM", "DAD", "CS", "AI"];

  const [form, setForm] = useState({
    department: "APIM",
    deadline: "average",
    count: 3,
  });

  const [assigned, setAssigned] = useState([]);

  // 🔥 Determine level
  const getLevel = (exp) => {
    if (exp <= 2) return "junior";
    if (exp <= 5) return "mid";
    return "senior";
  };

  const assignEmployees = () => {
    const deptEmployees = employees.filter(
      (e) => e.dept === form.department
    );

    if (deptEmployees.length === 0) {
      alert("No employees in this department");
      return;
    }

    if (form.count < 1) {
      alert("Count must be at least 1");
      return;
    }

    // Split by hierarchy
    const seniors = deptEmployees
      .filter((e) => getLevel(e.experience) === "senior")
      .sort((a, b) => b.experience - a.experience);

    const mids = deptEmployees
      .filter((e) => getLevel(e.experience) === "mid")
      .sort((a, b) => b.experience - a.experience);

    const juniors = deptEmployees
      .filter((e) => getLevel(e.experience) === "junior")
      .sort((a, b) => b.experience - a.experience);

    let selected = [];

    // ✅ Ensure at least one from each level (if available)
    if (seniors.length) selected.push(seniors[0]);
    if (mids.length) selected.push(mids[0]);
    if (juniors.length) selected.push(juniors[0]);

    let remaining = form.count - selected.length;

    // Deadline-based priority
    let priorityOrder;

    if (form.deadline === "tight") {
      priorityOrder = [...seniors, ...mids, ...juniors];
    } else if (form.deadline === "average") {
      priorityOrder = [...mids, ...seniors, ...juniors];
    } else {
      priorityOrder = [...juniors, ...mids, ...seniors];
    }

    for (let emp of priorityOrder) {
      if (remaining <= 0) break;

      if (!selected.find((e) => e.employee_id === emp.employee_id)) {
        selected.push(emp);
        remaining--;
      }
    }

    setAssigned(selected.slice(0, form.count));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Assign Project (Smart Allocation)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ✅ Department Dropdown */}
        <select
          className="border rounded px-3 py-2"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Deadline */}
        <select
          className="border rounded px-3 py-2"
          value={form.deadline}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
        >
          <option value="tight">Tight</option>
          <option value="average">Average</option>
          <option value="lenient">Lenient</option>
        </select>

        {/* Count */}
        <input
          type="number"
          min="1"
          placeholder="No. of Employees"
          className="border rounded px-3 py-2"
          value={form.count}
          onChange={(e) =>
            setForm({ ...form, count: Number(e.target.value) })
          }
        />
      </div>

      <button
        onClick={assignEmployees}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign Employees
      </button>

      {assigned.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Assigned Employees:
          </h3>

          {assigned.map((e) => (
            <div
              key={e.employee_id}
              className="border p-2 rounded mb-2 flex justify-between"
            >
              <span>{e.name}</span>
              <span>{e.experience} yrs</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectAssignment;
