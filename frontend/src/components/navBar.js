function Navbar({ activeView, setActiveView }) {
  const navItems = [
    { key: "directory", label: "Employee Directory" },
    { key: "add", label: "Add Employee" },
    { key: "project", label: "Project Allocation" },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-3 mb-6 flex justify-center gap-6">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveView(item.key)}
          className={`px-4 py-2 rounded-lg font-medium transition
            ${
              activeView === item.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Navbar;
