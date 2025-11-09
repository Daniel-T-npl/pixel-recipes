import Link from 'next/link';
import { useUserData } from '../lib/hooks';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, username, loading } = useUserData();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/'); // Redirect to home after sign out
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-indigo-600">
            EditLog
          </span>
        </Link>

        {/* Right Side Buttons */}
        <div className="flex md:order-2 space-x-3">
          {/* 1. Loading State */}
          {loading && (
            <div className="px-4 py-2 text-sm font-medium text-gray-400">Loading...</div>
          )}

          {/* 2. User is Logged In */}
          {user && (
            <div className="flex items-center gap-4">
              <Link href="/create">
                <button className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                  + New Log
                </button>
              </Link>
              <Link href="/dashboard">
                <img className="w-10 h-10 rounded-full border-2 border-indigo-200 cursor-pointer" src={user.photoURL || "https://api.dicebear.com/9.x/lorelei/svg"} alt="User dropdown" />
              </Link>
              <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-red-600 font-medium text-sm px-3 py-2"
              >
                  Sign Out
              </button>
              {/* We can add an avatar link later */}
            </div>
          )}

          {/* 3. User is Logged Out */}
          {!user && !loading && (
            <Link href="/enter">
              <button className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}