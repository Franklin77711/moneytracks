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

  interface TransactionContextProps {
    userDoc: any;
    transactionDoc: any;
    userDocRef: any;
    transactionDocRef: any;
    setUserDoc: (userDoc: any) => void;
    setTransactionDoc: (transactionDoc: any) => void;
    setUserDocRef:(userDocRef: any) => void;
    setTransactionDocRef: (transactionDocRef: any) => void;
  }
  interface NavbarProps {
    onTabChange: (tab: string) => void;
  }
  