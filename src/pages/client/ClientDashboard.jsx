import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../hooks/auth";
import AlbumView from "../../components/AlbumView";

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 overflow-y-auto">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Welcome,
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 break-words">
              {user.email}
            </h2>
          </div>
        </section>

        
        {/* Album List Section */}
        <section>
          <AlbumView />
        </section>
      </main>
    </div>
  );
}
