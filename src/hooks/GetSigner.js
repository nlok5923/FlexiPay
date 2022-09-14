import { useSigner } from "wagmi";

const GetSigner = () => {
    const {data: signer} = useSigner();
    return signer;
}

export default GetSigner;