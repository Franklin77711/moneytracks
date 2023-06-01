import React, {createContext, useState, PropsWithChildren} from "react";

export const UserContext = createContext<UserContextProps>({
  user: "",
  displayname: "",
  uid: "",
  setUser: () => {},
  setDisplayname: () => {},
  setUID: () => {},
});

export const UserProvider: React.FC<PropsWithChildren<{}>> = ({
    children,
  }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<string|null>('');
    const [displayname, setDisplayname] = useState<string|null>('');
    const [uid, setUID] = useState<string|null>('');
  

    return <UserContext.Provider value={{user, displayname, uid, setUser, setDisplayname, setUID}}>
        {children}
    </UserContext.Provider>    
}