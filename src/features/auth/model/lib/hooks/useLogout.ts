export const useLogout = () => {
  const fetchLogout = () => {
    localStorage.clear();
    window.location.pathname = "/auth/login";
  };

  return { logout: fetchLogout };
};
