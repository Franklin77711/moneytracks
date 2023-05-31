import React, {createContext, useState, PropsWithChildren} from "react";

export const UserContext = createContext<UserContextProps>({
  user: "",
  displayname: "",
  setUser: () => {},
  setDisplayname: () => {},
});

export const UserProvider: React.FC<PropsWithChildren<{}>> = ({
    children,
  }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<string|null>('');
    const [displayname, setDisplayname] = useState<string|null>('');
  

    return <UserContext.Provider value={{user, displayname, setUser, setDisplayname}}>
        {children}
    </UserContext.Provider>    
}