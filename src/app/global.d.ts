interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request?: (...args: any[]) => Promise<any>;
    on?: (...args: any[]) => void;
  };
}

interface Navigator {
  brave?: {
    isBrave: () => Promise<boolean>;
  };
}
