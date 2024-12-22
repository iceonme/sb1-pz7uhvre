import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-mars-sky hover:text-mars-sky/80 transition-colors">
              Mars Colony DAO
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Card className="bg-secondary px-4 py-2">
                  <span className="text-sm">
                    {profile?.username} | <span className="text-mars-sky">{profile?.mars_balance} MARS</span>
                  </span>
                </Card>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-mars-sky hover:text-mars-sky/80 transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;