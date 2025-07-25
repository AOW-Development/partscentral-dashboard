import Sidebar from "../components/Sidebar";

export default function InClients() {
  return (
    <div className="min-h-screen bg-main text-white font-exo flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">In Clients</h1>
        <p className="text-gray-400">This is the InClients page.</p>
        {/* Additional content can be added here */}
      </main>
    </div>
  );
}
