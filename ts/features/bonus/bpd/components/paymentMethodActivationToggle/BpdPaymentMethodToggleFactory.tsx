import * as React from "react";
import {
  EnableableFunctionsTypeEnum,
  getPaymentMethodHash,
  PaymentMethod
} from "../../../../../types/pagopa";
import { hasFunctionEnabled } from "../../../../../utils/walletv2";
import { HPan } from "../../store/actions/paymentMethods";
import PaymentMethodBpdToggle from "./base/PaymentMethodBpdToggle";

/**
 * Return a specific toggle based on the WalletTypeEnum
 * @param paymentMethod
 */
export const bpdToggleFactory = (paymentMethod: PaymentMethod) => {
  const hash = getPaymentMethodHash(paymentMethod);
  return hash ? (
    <PaymentMethodBpdToggle
      key={hash}
      hPan={hash as HPan}
      icon={paymentMethod.icon}
      hasBpdCapability={hasFunctionEnabled(
        paymentMethod,
        EnableableFunctionsTypeEnum.BPD
      )}
      caption={paymentMethod.caption}
    />
  ) : null;
};
