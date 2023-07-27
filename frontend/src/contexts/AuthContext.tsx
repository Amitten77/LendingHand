'use client'
import { PropsWithChildren, createContext, useContext, useState } from "react";


type AccountState = {
    account: any;
    changeAccount(account: any): void;
};

const AuthContext = createContext<any>(null);


const useAccount = (): AccountState => {
    const context = useContext(AuthContext)
    return context;
}

export const AuthProvider = (props: PropsWithChildren) => {
    const [account, setAccount] = useState<any>("system");

    const changeAccount = (acc: any) => {
      console.log("IM BEING CALLED")
      console.log(acc)
      setAccount(acc)
      console.log(account)
      console.log("WE DONE")
    }
    return (
      <AuthContext.Provider value={{ account, changeAccount}}>
        {props.children}
      </AuthContext.Provider>
    );
  };

export default useAccount;
