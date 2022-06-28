import "./App.css";
import Web3 from "web3";
import dotenv from "dotenv";
import uniswapABI from "./contract/uniswapABI.js";
import { useState, useEffect } from "react";

dotenv.config();

const rpcURL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`;
const web3 = new Web3(rpcURL);
const uniswapContract = new web3.eth.Contract(
  uniswapABI,
  "0xc4F0fF5e1DDc6752A13Bf0f59ad2beb2FC25F175"
);

function App() {
  const [pooledCprx, setPooledCprx] = useState(0);
  const [pooledUsdt, setPooledUsdt] = useState(0);
  const [usdt, setUsdt] = useState(0);
  const [cprx, setCprx] = useState(0);
  const [usdtResult, setUsdtResult] = useState("Enter Amount of CPRX");
  const [cprxResult, setCprxResult] = useState(0);

  const firstTypeusdtToCprx = async function (cprx) {
    let { _reserve0, _reserve1 } = await uniswapContract.methods
      .getReserves()
      .call();
    let pooledCprx = Number(Web3.utils.fromWei(_reserve0, "ether"));
    let pooledUsdt = Number(Web3.utils.fromWei(_reserve1, "Mwei"));
    let k = pooledCprx * pooledUsdt; // x * y = k

    let calculatedAmountOfCprx = pooledCprx - cprx;
    let calculatedAmountOfUsdt = k / calculatedAmountOfCprx - pooledUsdt;
    let resultPriceOfCprx =
      (pooledUsdt + calculatedAmountOfUsdt) / calculatedAmountOfCprx;

    if (cprx === 0) {
      setUsdt(0);
      setCprxResult(0);
      setUsdtResult("Enter Amount of CPRX");

      return alert("❗️ Please enter the amount of CPRX");
    }

    if (cprx > pooledCprx) {
      setUsdt(0);
      setCprxResult(0);
      setUsdtResult("Enter Amount of CPRX");

      return alert(`❗️ CPRX Balance is under ${pooledCprx.toFixed(5)} CPRX`);
    }

    // console.log(
    //   `You should pay at least ${calculatedAmountOfUsdt} USDT. The price of CPRX will be ${resultPriceOfCprx} USDT.`
    // );

    setUsdt(calculatedAmountOfUsdt.toFixed(5));
    setUsdtResult(calculatedAmountOfUsdt.toFixed(5));
    setCprx(resultPriceOfCprx.toFixed(5));
    setCprxResult(resultPriceOfCprx.toFixed(5));
  };

  const onInputHandler = (e) => {
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    setCprx(Number(e.target.value));
  };

  const onClickHandler = () => {
    firstTypeusdtToCprx(cprx);
  };

  useEffect(() => {
    uniswapContract.methods
      .getReserves()
      .call()
      .then((data) => {
        setPooledCprx(
          Number(Web3.utils.fromWei(data._reserve0, "ether")).toFixed(5)
        );
        setPooledUsdt(
          Number(Web3.utils.fromWei(data._reserve1, "Mwei")).toFixed(5)
        );
      });
  }, []);

  return (
    <div id="wrapper" className="flex_container">
      <nav>
        <a
          id="home-name"
          title="Go to Homepage"
          href="/Users/vamprodo47/coding-test/index.html"
        >
          <img
            className="cprx_logo"
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/13421.png"
            alt="CPRX"
          />
          CPRX-Calculator
        </a>
      </nav>
      <main>
        <h1>Price Action Calculator</h1>
        <div className="info">
          You can predict the price action on Uniswap for CPRX-USDT Pair.
        </div>
        <div className="info">
          Please note that this feature does not include fees.
        </div>
        <div id="pool-page">
          <div>
            <span id="pool-name"> Uniswap Pool </span>
          </div>
          <div>
            <a
              id="uniswap"
              href="https://app.uniswap.org/#/swap?outputCurrency=0xc6e145421fd494b26dcf2bfeb1b02b7c5721978f&chain=mainnet"
            >
              🦄 CPRX Uniswap
            </a>
            <a
              id="chart"
              href="https://www.dextools.io/app/ether/pair-explorer/0xc4f0ff5e1ddc6752a13bf0f59ad2beb2fc25f175"
            >
              📈 CPRX-USDT Chart
            </a>
            <br />
            <span>
              Pooled CPRX:
              <span id="pool-cprx"> {pooledCprx} </span>
              CPRX
            </span>
          </div>
          <div>
            <span>
              Pooled USDT:
              <span id="pool-usdt"> {pooledUsdt} </span>
              USDT
            </span>
          </div>
          <br />
          <span>
            CPRX Price:
            <span id="pool-usdt"> {(pooledUsdt / pooledCprx).toFixed(5)} </span>
            (USDT/CPRX)
          </span>
        </div>
        <div className="info">Get Info about USDT required for purchase</div>
        <div id="swap-mid-info" className="info">
          and CPRX price after trade.
        </div>
        <div className="info">
          Enter the quantity you want to buy in the CPRX input box.
        </div>
        <div id="swap-page">
          <div id="swap-name">Calculator</div>
          <div className="swap-box">
            <span id="swap-currency-input">{usdtResult}</span>
            <span>USDT</span>
          </div>
          <svg
            id="arrow"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8F96AC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <div className="swap-box">
            <input
              id="swap-currency-output"
              onInput={onInputHandler}
              placeholder="0.0"
            />
            <span>CPRX</span>
          </div>
          <button id="swap-currency-button" onClick={onClickHandler}>
            Enter
          </button>
        </div>
        <div id="result-page">
          <div>
            <span id="result-name"> Result </span>
          </div>
          <div>
            <span>You should pay at least </span>
            <span id="result-output">{usdt} </span>
            <span>USDT.</span>
          </div>
          <div>
            <span>The Price of CPRX will be </span>
            <span id="result-price">{cprxResult} </span>
            <span>USDT.</span>
          </div>
        </div>
      </main>
      <footer>
        <a href="https://app.uniswap.org/#/swap?outputCurrency=0xc6e145421fd494b26dcf2bfeb1b02b7c5721978f&chain=mainnet">
          <img className="footer-logo" src="uniswap-logo.jpeg" alt="Uniswap" />
          Uniswap
        </a>
        <a href="https://www.cryptoperx.com/">
          <img className="footer-logo" src="cprx-logo-1.png" alt="CPRX" />
          CPRX Official
        </a>
        <a href="https://t.me/joinchat/KUZXDUeBnD1kNWU0">
          <img
            className="footer-logo"
            src="telegram-logo.jpeg"
            alt="Telegram"
          />
          CPRX Telegram
        </a>
        <a href="https://t.me/+GH4vQJJ0l6UxMzJl">
          <img
            id="korea-logo"
            className="footer-logo"
            src="korea-logo.png"
            alt="Korea"
          />
          CPRX Korea
        </a>
        <a href="https://www.abra.com/">
          <img className="footer-logo" src="abra-logo.jpeg" alt="ABRA" />
          ABRA Official
        </a>
        <span id="copyright"> &copy; copyright 2022 CPRX Korea </span>
      </footer>
    </div>
  );
}

export default App;
