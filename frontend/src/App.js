import { useEffect, useState, useMemo } from "react";
import AddEmployee from "./components/addEmployee";
import EmployeeList from "./components/employeeList";
import ProjectAssignment from "./components/projectAssignment";
import { api } from "./api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [activeView, setActiveView] = useState("directory");

  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  // 🔔 Global Notification State
  const [notification, setNotification] = useState(null);

  // =========================
  // Show Notification
  // =========================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // =========================
  // Fetch Employees
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees/");
        setEmployees(res.data);
      } catch (error) {
        showNotification("Failed to fetch employees", "error");
      }
    };

    fetchEmployees();
  }, []);

  // =========================
  // Badge Logic
  // =========================
  const getBadge = (experience) => {
    if (experience <= 2) return "Junior 🟢";
    if (experience <= 5) return "Mid 🟡";
    return "Senior 🔵";
  };

  // =========================
  // Filter + Sort
  // =========================
  const processedEmployees = useMemo(() => {
    let data = [...employees];

    if (filterDept !== "All") {
      data = data.filter((e) => e.dept === filterDept);
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "experience") {
      data.sort((a, b) => b.experience - a.experience);
    }

    if (sortBy === "role") {
      data.sort((a, b) => a.role.localeCompare(b.role));
    }

    return data;
  }, [employees, filterDept, sortBy]);

  const departments = [
    "All",
    ...new Set(employees.map((e) => e.dept)),
  ];

  return (
    <div className="min-h-screen bg-slate-100 relative">
      
      {/* 🔔 Notification Toast */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition
            ${
              notification.type === "error"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Employee Management System
        </h1>

        {/* NAVBAR */}
        <div className="bg-white shadow-md rounded-xl p-3 mb-6 flex justify-center gap-6">
          <button
            onClick={() => setActiveView("directory")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeView === "directory"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Employee Directory
          </button>

          <button
            onClick={() => setActiveView("add")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeView === "add"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Add Employee
          </button>

          <button
            onClick={() => setActiveView("project")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeView === "project"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Project Allocation
          </button>
        </div>

        {/* ========================= */}
        {/* DIRECTORY VIEW */}
        {/* ========================= */}
        {activeView === "directory" && (
          <>
            {/* FILTER + SORT */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                className="border rounded-lg px-3 py-2"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="none">No Sorting</option>
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="role">Sort by Role</option>
              </select>
            </div>

            <EmployeeList
              employees={processedEmployees}
              setEmployees={setEmployees}
              getBadge={getBadge}
              showNotification={showNotification}
            />
          </>
        )}

        {/* ADD EMPLOYEE VIEW */}
        {activeView === "add" && (
          <AddEmployee
            setEmployees={setEmployees}
            showNotification={showNotification}
          />
        )}

        {/* PROJECT VIEW */}
        {activeView === "project" && (
          <ProjectAssignment
            employees={employees}
            showNotification={showNotification}
          />
        )}
      </div>
    </div>
  );
}

export default App;
