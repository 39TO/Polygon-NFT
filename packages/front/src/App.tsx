import { useEffect, useState } from "react";
import "./App.css";
import json from "./utils/My39NFT.json";
import { ethers } from "ethers";
import axios from "axios";

const contractAddress = import.meta.env.VITE_TEST_CONTRACT_ADDRESS;
const abi = json.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [tokenIdInput, setTokenIdInput] = useState("");
  const [tokenUri, setTokenUri] = useState<string>("");
  const [openseaUrl, setOpenseaUrl] = useState<string>("");
  const [metadataUrl, setMetadateUrl] = useState<string>("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      console.error("window.ethereumがない");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      console.error("No authorized account found");
    }
  };

  const connect = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const mint = async () => {
    try {
      console.log("minting");
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Contract: ", contract);
        console.log("signer: ", signer);
        const nft = await contract.mintNFT(addressInput);
        console.log("Mining...", nft);
        await nft.wait();
        console.log("Mined!!!, ", nft);
        alert("Minted successfully");
        setAddressInput("");
      } else {
        console.error("ethereum objectがない");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const urlPrefix = "https://ipfs.io/ipfs/";
  const openseaUrlPrefix = `https://testnets.opensea.io/ja/assets/amoy/${contractAddress}/`;

  interface ImageData {
    image: string;
  }

  const getTokenURI = async (tokenId: number) => {
    const { ethereum } = window as any;
    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const tokenURI = await contract.tokenURI(tokenId);
      const parsedPath = tokenURI.replace("ipfs://", "");
      const res = await axios.get<ImageData>(`${urlPrefix}${parsedPath}`);
      const parsedImage = res.data.image.replace("ipfs://", "");
      setMetadateUrl(`${urlPrefix}${parsedPath}`);
      setTokenUri(`${urlPrefix}${parsedImage}`);
      setOpenseaUrl(`${openseaUrlPrefix}${tokenId}`);
    } else {
      console.error("ethereum objectがない");
      alert("存在しません");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      {currentAccount ? (
        <>
          <div className="font-bold">接続済み</div>
          <div>アカウント: {currentAccount}</div>
          <div className="flex justify-center items-center my-4">
            <input
              type="text"
              placeholder="アドレスを入力"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="p-2 m-4 rounded-lg border-2"
            />
            <button
              className="p-4 bg-emerald-400 content-center"
              onClick={mint}>
              NFTを作成
            </button>
          </div>
        </>
      ) : (
        <button className="p-4 bg-emerald-400 h-12" onClick={connect}>
          接続する
        </button>
      )}
      <div className="border-neutral-800 border-2 mt-8 p-4">
        <div className="flex m-4 items-center justify-center">
          <input
            type="text"
            placeholder="トークンIDを入力"
            value={tokenIdInput}
            onChange={(e) => setTokenIdInput(e.target.value)}
            className="p-2 m-4 rounded-lg border-2"
          />
          <button
            className="rounded-lg bg-sky-400 h-12"
            onClick={() => getTokenURI(Number(tokenIdInput))}>
            取得
          </button>
        </div>
        {tokenUri && (
          <>
            <div className="py-4 border-cyan-400">
              メタデータ：<a href={metadataUrl}>{metadataUrl}</a>
            </div>
            <div className="w-40 mx-auto border-4 hover:border-teal-400">
              <a href={openseaUrl} className="">
                <img src={tokenUri} alt="Content from IPFS" className="" />
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
