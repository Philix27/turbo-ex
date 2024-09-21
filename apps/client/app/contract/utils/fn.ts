import { BrowserProvider, ethers } from 'ethers';
import { geAppContract } from '.';
import { AppContract, TokenAddress } from '../const';

export const deposit = async (props: {
  userAddress: string;
  purpose: string;
  timeInSeconds: number;
  amount: number;
  // _signerAddress: `0x${string}` | undefined
}) => {
  const contract = await geAppContract(props.userAddress);
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(props.userAddress);
  const tokenContract = new ethers.Contract(TokenAddress.CUSD_MAINNET, TokenAddress.erc20Abi, signer);
  // const recipient = to
  const tokenAmount = ethers.parseUnits(props.amount.toString(), 18);
  console.log('In fn deposit', props);

  try {
    // Transfer the tokens
    const tx = await tokenContract.approve!(AppContract.address, tokenAmount);
    console.log('Transaction Payload:', tx);
    console.log('Transaction hash:', tx.hash);

    await tx.wait();

    // const txn = await contract.deposit!(10, tokenAmount, "Dog", {
    //   gasLimit: 500000,
    // })
    const txn = await contract.deposit!(props.timeInSeconds, tokenAmount, props.purpose);

    // const txn = await contract.deposit!(props.timeInSeconds, props.purpose, {
    //   gasLimit: 500000,
    //   value: parseEther(props.amount.toString()),
    // })

    await txn.wait();
  } catch (error) {
    console.log('An error occurred', error);
  }
};

export async function joinGame(props: { userAddress: string; stakeAmount: number }) {
  const contract = await geAppContract(props.userAddress);

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(props.userAddress);
  const tokenContract = new ethers.Contract(TokenAddress.CUSD_MAINNET, TokenAddress.erc20Abi, signer);
  // const recipient = to
  const tokenAmount = ethers.parseUnits(props.stakeAmount.toString(), 18);
  console.log('In fn joinGame', props);

  try {
    const tx = await tokenContract.approve!(AppContract.address, tokenAmount);
    console.log('Transaction Payload:', tx);
    console.log('Transaction hash:', tx.hash);

    await tx.wait();

    const txn = await contract.joinGame!(props.stakeAmount);
    await txn.wait();
  } catch (error) {
    console.error('Error:', error);
    // throw new Error('Failed operation');
  }
}

export async function setWinner(props: { userAddress: string; gameId: number; winner: string }) {
  const contract = await geAppContract(props.userAddress);

  try {
    const txn = await contract.setWinner!(props.gameId, props.winner);
    const data = await txn.wait();
    return data;
  } catch (error) {
    console.error('Error:', error);
    // throw new Error("Failed operation");
  }
}
