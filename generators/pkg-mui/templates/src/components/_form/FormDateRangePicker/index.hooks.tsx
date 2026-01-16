import useFormField from "@/hooks/useFormField";
import moment, { Moment } from "moment";
import { useMemo, useCallback, useRef, useState, useEffect } from "react";

type UseFormDateRangePickerProps = {
  startDateName: string;
  endDateName: string;
};

export const useFormDateRangePicker = ({
  startDateName,
  endDateName,
}: UseFormDateRangePickerProps) => {
  const {
    value: startDateValue,
    setValue: setStartDateValue,
    error: startDateError,
  } = useFormField<Moment | null>({ name: startDateName });

  const {
    value: endDateValue,
    setValue: setEndDateValue,
    error: endDateError,
  } = useFormField<Moment | null>({ name: endDateName });

  const startDate = useMemo(
    () =>
      startDateValue && moment(startDateValue).isValid()
        ? moment(startDateValue)
        : null,
    [startDateValue],
  );

  const endDate = useMemo(
    () =>
      endDateValue && moment(endDateValue).isValid()
        ? moment(endDateValue)
        : null,
    [endDateValue],
  );

  const handleDateChange = useCallback(
    (newValue: Moment | null) => {
      if (!newValue) {
        setStartDateValue(null);
        setEndDateValue(null);
        return;
      }

      // Create a new Moment object from the value (like FormDatePicker does)
      // This ensures we always pass a fresh object to setValue, avoiding read-only property issues
      const newMoment = moment(newValue);

      // If no start date is set, first click always sets start date
      if (!startDate) {
        setStartDateValue(moment(newValue));
        setEndDateValue(null);
        return;
      }

      // If start date is set but no end date, second click always sets end date
      // If the new date is before start date, swap them
      if (!endDate) {
        if (newMoment.isBefore(startDate, "day")) {
          // Swap: new date becomes start, old start becomes end
          setStartDateValue(moment(newValue));
          setEndDateValue(moment(startDate));
        } else if (newMoment.isSame(startDate, "day")) {
          // Same date: clear end date (allows resetting)
          setEndDateValue(null);
        } else {
          // Normal case: set as end date
          setEndDateValue(moment(newValue));
        }
        return;
      }

      // If both dates are set, clicking a new date resets and starts a new selection
      // The clicked date becomes the new start date
      setStartDateValue(moment(newValue));
      setEndDateValue(null);
    },
    [startDate, endDate, setStartDateValue, setEndDateValue],
  );

  // Handle range change from DateRangePicker (array format)
  const handleRangeChange = useCallback(
    (newValue: [Moment | null, Moment | null] | null) => {
      if (!newValue || !newValue[0]) {
        setStartDateValue(null);
        setEndDateValue(null);
        return;
      }
      // Create new Moment objects from the values (like FormDatePicker does)
      // This ensures we always pass fresh objects to setValue, avoiding read-only property issues
      const startMoment = newValue[0] ? moment(newValue[0]) : null;
      const endMoment = newValue[1] ? moment(newValue[1]) : null;
      setStartDateValue(startMoment);
      setEndDateValue(endMoment);
    },
    [setStartDateValue, setEndDateValue],
  );

  // Display value: show range if both dates are set, otherwise show start date or empty
  const displayValue = useMemo(() => {
    if (startDate && endDate) {
      return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
    }
    if (startDate) {
      return `${startDate.format("MMM D, YYYY")} - ...`;
    }
    return null;
  }, [startDate, endDate]);

  // Error: show error from either field
  const error = useMemo(() => {
    return startDateError || endDateError || null;
  }, [startDateError, endDateError]);

  // Popper/Calendar state management
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // IMPORTANT: ignore click-away events triggered by clicking the anchor itself,
      // otherwise the calendar would open and immediately close on the same click.
      const targetNode = event.target as Node | null;
      if (targetNode && anchorRef.current?.contains(targetNode)) {
        return;
      }
      handleClose();
    },
    [handleClose],
  );

  // Close ONLY when the end date is selected during the current open session.
  // If both start/end are already set (existing range), opening the calendar should NOT auto-close.
  const prevEndDateRef = useRef<Moment | null>(null);
  useEffect(() => {
    const prevEndDate = prevEndDateRef.current;
    prevEndDateRef.current = endDate || null;

    // endDate transitioned null -> value while open => close
    if (open && !prevEndDate && endDate) {
      // Let form state settle, then close
      const t = setTimeout(() => handleClose(), 0);
      return () => clearTimeout(t);
    }
  }, [endDate, open, handleClose]);

  // Use startDate as the value for the DatePicker
  const pickerValue = startDate;

  return {
    startDate,
    endDate,
    displayValue,
    handleDateChange,
    handleRangeChange,
    error,
    anchorRef,
    open,
    handleOpen,
    handleClose,
    handleClickAway,
    pickerValue,
  };
};
