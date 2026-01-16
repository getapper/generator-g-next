import React, { memo } from "react";
import { useFormCurrencyAmount } from "@/components/_form/FormCurrencyAmount/index.hooks";
import { Stack, TextField } from "@mui/material";
import { FormCurrencyCodePicker } from "@/components/_form/FormCurrencyCodePicker";

type FormCurrencyAmountProps = {
  label?: string;
  amountName: string;
  currencyCode: string;
  decimals?: number;
  index?: number;
  amountTextFieldDisabled?: boolean;
};

export const FormCurrencyAmount = memo(
  ({
    label,
    amountName,
    currencyCode,
    decimals,
    index,
    amountTextFieldDisabled,
  }: FormCurrencyAmountProps) => {
    const { amountError, onAmountChange, inputRef } = useFormCurrencyAmount({
      amountName,
      index,
      decimals,
    });

    return (
      <Stack direction="row" sx={{ width: "100%" }}>
        <FormCurrencyCodePicker
          value={currencyCode}
          currencyCodes={[currencyCode]}
          disabled={true}
          sx={{
            minWidth: "100px",
            flexShrink: 0,
          }}
          selectProps={{
            sx: {
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              "&>fieldset": {
                borderRight: "none",
              },
            },
          }}
        />
        <TextField
          name={amountName}
          inputRef={inputRef}
          InputLabelProps={{ shrink: true }}
          disabled={amountTextFieldDisabled}
          label={label}
          onChange={onAmountChange}
          InputProps={{
            sx: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
          error={!!amountError}
          helperText={amountError}
        />
      </Stack>
    );
  },
);
FormCurrencyAmount.displayName = "FormCurrencyAmount";
