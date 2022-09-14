import { useProvider } from "wagmi";

function UseProvider () {
  const provider =  useProvider();
  return provider;
}

export default UseProvider;