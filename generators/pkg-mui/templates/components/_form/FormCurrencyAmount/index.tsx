import React, { memo } from "react";
import { useFormCurrencyAmount } from "components/_form/FormCurrencyAmount/index.hooks";
import { Box, TextField } from "@mui/material";
import { FormSelect } from "components";
import { Control, Controller } from "react-hook-form";

type FormCurrencyAmountProps = {
  control: any;
  currencyName: string;
  amountName: string;
};

export const FormCurrencyAmount = memo(
  ({ control, currencyName, amountName }: FormCurrencyAmountProps) => {
    const {
      currencyOptions,
      inputRef,
      autonumericRef,
      numberOfDecimals,
    } = useFormCurrencyAmount({
      currencyName,
    });

    return (
      <Box>
        <FormSelect
          name={currencyName}
          control={control}
          options={currencyOptions}
        />
        <Controller
          control={control}
          name={amountName}
          defaultValue=""
          render={({ field: { value, onChange, onBlur } }) => {
            const onTextFieldChange = () => {
              // get raw value from autonumeric and pass it to Controller onChange
              onChange(
                Math.round(
                  Number(autonumericRef.current.getNumericString()) *
                    Math.pow(10, numberOfDecimals),
                ),
              );
            };
            return (
              <TextField
                inputRef={inputRef}
                onChange={onTextFieldChange}
                onBlur={onBlur}
              />
            );
          }}
        />
      </Box>
    );
  },
);
