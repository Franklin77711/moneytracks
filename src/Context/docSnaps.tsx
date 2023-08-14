import React, {createContext, useState, PropsWithChildren} from "react";

export const TransactionContext = createContext<TransactionContextProps>({
  userDoc: "",
  transactionDoc: "",
  userDocRef: "",
  transactionDocRef: "",
  setUserDoc: () => {},
  setTransactionDoc: () => {},
  setUserDocRef: () => {},
  setTransactionDocRef: () => {}
});

export const TransactionProvider: React.FC<PropsWithChildren<{}>> = ({
    children,
  }: PropsWithChildren<{}>) => {

    const [userDoc, setUserDoc] = useState<any>();
    const [transactionDoc, setTransactionDoc] = useState<any>();
    const [userDocRef, setUserDocRef] = useState<any>();
    const [transactionDocRef, setTransactionDocRef] = useState<any>();
  

    return <TransactionContext.Provider value={{userDoc, transactionDoc, userDocRef, transactionDocRef, setUserDoc, setTransactionDoc, setUserDocRef, setTransactionDocRef}}>
        {children}
    </TransactionContext.Provider>    
}