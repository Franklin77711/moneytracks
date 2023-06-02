/// <reference types="react-scripts" />
interface LoginProps {
    onSwitchForm: () => void;
  }

  interface ThemeContextProps {
    theme: string;
    setTheme: (theme: string) => void;
  }

  interface UserContextProps {
    user: string|null;
    displayname: string|null;
    uid: string|null;
    setUser: (user: string|null) => void;
    setDisplayname: (user: string|null) => void;
    setUID: (user: string|null) => void;
  }
  interface NavbarProps {
    onTabChange: (tab: string) => void;
  }
  