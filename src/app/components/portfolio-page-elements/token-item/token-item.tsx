"use client";

import React from "react";
import s from "./token-item.module.scss";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";

interface TokenItemProps {
  token: any;
  purchasePrice?: number | null;
  roi?: number | null;
}

export default function TokenItem({
  token,
  purchasePrice,
  roi,
}: TokenItemProps) {
  const calculateFixedInt = (priceInDollars: number | string) =>
    Number(priceInDollars) < 1 ? 6 : 2;

  const { name, symbol, balance, price, valueInUSD, logo } = token || {};
  const isRoiPositive = !!roi && roi >= 0;
  const applyRoiClass = () => {
    if (!!roi) {
      return isRoiPositive ? s.positiveROI : s.negativeROI;
    }
    if (!roi) {
      return "";
    }
  };

  return (
    <div className={s.tokenItem}>
      <div>
        <img src={logo} className={s.tokenLogo} />
        <span className={s.tokenName}>
          {name} ({symbol})
        </span>
      </div>

      <div>
        <span className={s.tokenBalance}>
          Balance: {Number(balance).toFixed(4)} {symbol}
        </span>
        <span className={s.tokenValue}>
          Value: ${!!valueInUSD && valueInUSD.toFixed(2)}
        </span>
      </div>

      <div className={s.tokenPrice}>
        (Current Price: $
        {!!price ? Number(price).toFixed(calculateFixedInt(price)) : "N/A"})
      </div>

      {!!purchasePrice && (
        <>
          <div>
            Purchase Price: $
            {purchasePrice.toFixed(calculateFixedInt(purchasePrice))}
          </div>
          {!!roi && (
            <div className={`${s.tokenROI} ${applyRoiClass()}`}>
              ROI:
              {isRoiPositive && <FaArrowUpLong />}
              {!isRoiPositive && <FaArrowDownLong />}
              {roi.toFixed(2)}%
            </div>
          )}
        </>
      )}
    </div>
  );
}
