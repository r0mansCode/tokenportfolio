"use client";

import React, { useState } from "react";
import s from "./token-item.module.scss";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { Token } from "@/store/useTokenStore";
import { SlArrowDown } from "react-icons/sl";

interface TokenItemProps {
  token: Token;
  purchasePrice?: number | null;
  roi?: number | null;
}

export default function TokenItem({
  token,
  purchasePrice,
  roi,
}: TokenItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className={s.tokenItem} onClick={() => setIsExpanded(!isExpanded)}>
      <SlArrowDown
        className={`${!isExpanded ? s.expandArrow : s.collapseArrow}`}
      />
      <div className={s.tokenItemRow}>
        <img src={logo} className={s.tokenLogo} />
        <span className={s.tokenName}>
          {name} ({symbol})
        </span>
      </div>

      <div className={s.tokenItemRow}>
        <span className={s.tokenBalance}>
          Balance: {Number(balance).toFixed(4)} {symbol}
        </span>
      </div>
      <div className={s.tokenItemRow}>
        <span className={s.tokenValue}>
          USD Value: ${!!valueInUSD && Number(valueInUSD).toFixed(2)}
        </span>
      </div>
      <div className={`${s.expandableSection} ${isExpanded && s.showDetails}`}>
        <div>
          <div className={`${s.tokenPrice} ${s.tokenItemRow}`}>
            (Current Price: $
            {!!price ? Number(price).toFixed(calculateFixedInt(price)) : "N/A"})
          </div>

          {!!purchasePrice && (
            <>
              <div className={s.tokenItemRow}>
                Average Purchase Price: $
                {purchasePrice.toFixed(calculateFixedInt(purchasePrice))}
              </div>
              {!!roi && (
                <div
                  className={`${s.tokenROI} ${applyRoiClass()} ${
                    s.tokenItemRow
                  }`}
                >
                  ROI:
                  {isRoiPositive && <FaArrowUpLong />}
                  {!isRoiPositive && <FaArrowDownLong />}
                  {roi.toFixed(2)}%
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
