"use client";

import React from "react";
import s from "./token-item.module.scss";

interface TokenItemProps {
  name: string;
  symbol: string;
  balance: number;
  price: number;
  valueInUSD: number;
  purchasePrice?: number | null;
  roi?: number | null;
}

export default function TokenItem({
  name,
  symbol,
  balance,
  price,
  valueInUSD,
  purchasePrice,
  roi,
}: TokenItemProps) {
  const calculateFixedInt = (priceInDollars: number | string) =>
    Number(priceInDollars) < 1 ? 6 : 2;
  return (
    <div className={s.tokenItem}>
      <p className={s.tokenInfo}>
        <span className={s.tokenName}>
          {name} ({symbol}):
        </span>{" "}
        <span className={s.tokenBalance}>
          {Number(balance).toFixed(4)} {symbol}
        </span>{" "}
        <span className={s.tokenPrice}>
          (Current Price: $
          {!!price ? Number(price).toFixed(calculateFixedInt(price)) : "N/A"})
        </span>{" "}
        -{" "}
        <span className={s.tokenValue}>
          Value: ${!!valueInUSD && valueInUSD.toFixed(2)}
        </span>
      </p>
      <p className={s.tokenPerformance}>
        Purchase Price: $
        {purchasePrice
          ? purchasePrice.toFixed(calculateFixedInt(purchasePrice))
          : "N/A"}{" "}
        - ROI:{" "}
        {/* <span
          className={`${s.tokenROI} ${
            roi !== undefined && roi !== null
              ? roi >= 0
                ? s.positiveROI
                : s.negativeROI
              : ""
          }`}
        >
          {roi !== undefined && roi !== null ? roi.toFixed(2) : "N/A"}%
        </span> */}
      </p>
    </div>
  );
}
