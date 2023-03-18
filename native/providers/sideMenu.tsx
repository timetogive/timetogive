import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { SideMenuDrawer } from '../components/SideMenuDrawer';

interface SideMenu {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Context = createContext<SideMenu>({
  open: false,
  setOpen: () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SideMenuProvider = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Context.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useSideMenu = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      '`useSideMenu` hook must be used within a `SideMenuProvider` component'
    );
  }
  return context;
};
