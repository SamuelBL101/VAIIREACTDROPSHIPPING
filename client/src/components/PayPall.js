//sb-xs1sr29321009@personal.example.com
//biC|>7}j

import React, { useRef, useEffect } from "react";

const PayPal = ({ totalCost, onSuccess }) => {
  const paypal = useRef();

  useEffect(() => {
    if (!totalCost) {
      console.error("Total costs not provided.");
      return;
    }

    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "EUR",
                  value: totalCost.toFixed(2), // Use the dynamic totalCosts value
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          onSuccess(order);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, [totalCost, onSuccess]);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
};

export default PayPal;
