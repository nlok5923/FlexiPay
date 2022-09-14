import React from 'react';
import { useSigner, useContract } from 'wagmi';

const GetContract = (addr, abidata) => {
    const { data: signer, isError, isLoading } = useSigner()

  const contract = useContract({
    addressOrName: addr,
    contractInterface: abidata,
    signerOrProvider: signer,
  })
  
  return contract;
}

export default GetContract;