import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get(`/v1/api/account`);
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name
            }
          })
        }
      } catch (error) {
        console.error("Lỗi kết nối Backend:", error);
      } finally {
        setAppLoading(false);
      }
    }
    fetchAccount()
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      {appLoading === true ?
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          <Spin size="large" />
        </div>
        :
        <>
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
        </>
      }
    </div>
  )
}

export default App