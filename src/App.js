import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "paimdev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media1.giphy.com/media/IwAZ6dvvvaTtdI8SD5/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g",
  "https://media2.giphy.com/media/dXFKDUolyLLi8gq6Cl/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g",
  "https://media0.giphy.com/media/cXblnKXr2BQOaYnTni/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g",
  "https://media0.giphy.com/media/jp7jSyjNNz2ansuOS8/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g",
  "https://media2.giphy.com/media/l0amJzVHIAfl7jMDos/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g",
  "https://media4.giphy.com/media/BpGWitbFZflfSUYuZ9/200.webp?cid=ecf05e47yj3ujorwmg7snjz5aq441nmjom1ulec22vav7mgq&rid=200.webp&ct=g"
];

const App = () => {
  const [walletAddress, setWalletAdress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet was found!!👻");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with public key:",
            response.publicKey.toString()
          );
          setWalletAdress(response.publicKey.toString());
        }
      } else {
        console.log("No wallet found :( go get a Phantom 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key:", response.publicKey.toString());
      setWalletAdress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("The link input can't be empty!")
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect your wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button"> Submit </button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching gif list...");
      // Sum stuff later
      setGifList(TEST_GIFS);
    }

  }, [walletAddress])

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">💼 The office GIF Portal</p>
          <p className="sub-text">
            Because was the first thing that came to my mind ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
