import React, { memo, useState } from "react";
import { useFormScheduleExpression } from "./index.hooks";
import {
  TextField,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormTextField } from "../FormTextField";

export type FormScheduleExpressionProps = {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
};

export const FormScheduleExpression = memo(
  ({ name, label, helperText, required }: FormScheduleExpressionProps) => {
    const { value, handleChange, error } = useFormScheduleExpression(name);
    const [expanded, setExpanded] = useState(false);

    const schedulePresets = [
      {
        label: "Every 5 minutes",
        expression: "rate(5 minutes)",
        description: "Runs every 5 minutes",
      },
      {
        label: "Every 15 minutes",
        expression: "rate(15 minutes)",
        description: "Runs every 15 minutes",
      },
      {
        label: "Every hour",
        expression: "rate(1 hour)",
        description: "Runs every hour",
      },
      {
        label: "Every 6 hours",
        expression: "rate(6 hours)",
        description: "Runs every 6 hours",
      },
      {
        label: "Every day at 9 AM",
        expression: "cron(0 9 * * ? *)",
        description: "Runs daily at 9:00 AM UTC",
      },
      {
        label: "Every weekday at 9 AM",
        expression: "cron(0 9 ? * MON-FRI *)",
        description: "Runs Monday-Friday at 9:00 AM UTC",
      },
      {
        label: "Every Monday at 9 AM",
        expression: "cron(0 9 ? * MON *)",
        description: "Runs every Monday at 9:00 AM UTC",
      },
    ];

    const handlePresetClick = (expression: string) => {
      handleChange({ target: { value: expression } } as any);
    };

    return (
      <Box>
        <FormTextField
          name={name}
          label={label || "Schedule Expression"}
          helperText={helperText || "Enter a cron expression or rate"}
          required={required}
          value={value}
          onChange={handleChange}
          error={!!error}
          fullWidth
        />

        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              Schedule Expression Helper
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="body2" gutterBottom>
                Choose a preset or create a custom expression:
              </Typography>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {schedulePresets.map((preset) => (
                  <Box key={preset.expression}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handlePresetClick(preset.expression)}
                      sx={{ mb: 0.5 }}
                    >
                      {preset.label}
                    </Button>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {preset.description}
                    </Typography>
                    <Chip
                      label={preset.expression}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                ))}
              </Stack>

              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Rate expressions:</strong> rate(5 minutes), rate(1
                hour), rate(1 day)
              </Typography>
              <Typography variant="body2">
                <strong>Cron expressions:</strong> cron(0 9 * * ? *) for daily
                at 9 AM
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  },
);

FormScheduleExpression.displayName = "FormScheduleExpression";
