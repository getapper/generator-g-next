import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import React, { memo } from "react";
import { useFormDateRangePicker } from "./index.hooks";
import { Moment } from "moment";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  TextField,
  TextFieldProps,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type FormDateRangePickerProps = {
  startDateName: string;
  endDateName: string;
  label?: string;
  fullWidth?: boolean;
  slotProps?: {
    textField?: TextFieldProps;
  };
} & Record<string, any>;

// Custom day component to highlight range
const RangeDay = memo(
  (
    props: PickersDayProps<Moment> & {
      startDate?: Moment | null;
      endDate?: Moment | null;
    },
  ) => {
    const { startDate, endDate, day, ...other } = props;
    const isStart = startDate && day.isSame(startDate, "day");
    const isEnd = endDate && day.isSame(endDate, "day");
    const isInRange =
      startDate &&
      endDate &&
      day.isAfter(startDate, "day") &&
      day.isBefore(endDate, "day");

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          "&::before": isInRange
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "var(--Brand-50, rgba(0, 122, 255, 0.1))",
                zIndex: 0,
              }
            : {},
        }}
      >
        <PickersDay
          {...other}
          day={day}
          sx={{
            position: "relative",
            zIndex: 1,
            ...(isStart || isEnd
              ? {
                  backgroundColor: "var(--Brand-600, #007AFF)",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "var(--Brand-700, #0066CC)",
                  },
                }
              : {}),
            ...(isInRange
              ? {
                  backgroundColor: "var(--Brand-100, rgba(0, 122, 255, 0.2))",
                  "&:hover": {
                    backgroundColor: "var(--Brand-200, rgba(0, 122, 255, 0.3))",
                  },
                }
              : {}),
          }}
        />
      </Box>
    );
  },
);
RangeDay.displayName = "RangeDay";

export const FormDateRangePicker = memo(
  ({
    startDateName,
    endDateName,
    label,
    fullWidth = false,
    slotProps,
    ...others
  }: FormDateRangePickerProps) => {
    const {
      startDate,
      endDate,
      displayValue,
      handleDateChange,
      error,
      anchorRef,
      open,
      handleOpen,
      handleClickAway,
      pickerValue,
    } = useFormDateRangePicker({
      startDateName,
      endDateName,
    });

    return (
      <>
        <Box ref={anchorRef} onClick={handleOpen}>
          <TextField
            label={label}
            value={displayValue || ""}
            error={!!error}
            helperText={
              error ||
              (displayValue && endDate
                ? ""
                : startDate
                ? "Select end date"
                : "Select start date, then end date")
            }
            fullWidth={fullWidth}
            placeholder="Select date range"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpen();
                    }}
                  >
                    <CalendarTodayIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              cursor: "pointer",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D5D7DA",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D5D7DA",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D5D7DA",
              },
              ...(slotProps?.textField?.sx || {}),
            }}
            {...(slotProps?.textField || {})}
          />
        </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1500 }}
        >
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                overflow: "hidden",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <StaticDatePicker
                  value={pickerValue}
                  onChange={handleDateChange}
                  slots={{
                    day: RangeDay,
                  }}
                  slotProps={{
                    day: {
                      startDate,
                      endDate,
                    } as any,
                    actionBar: {
                      actions: [],
                    },
                  }}
                  {...others}
                />
              </LocalizationProvider>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </>
    );
  },
);
FormDateRangePicker.displayName = "FormDateRangePicker";
