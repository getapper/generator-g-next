import { Stack } from "@mui/material";
import { FormTextField } from "../FormTextField";
import { useFormBaseInstructionVersionSelector } from "./index.hooks";
import { FormSelect } from "@/components/_form/FormSelect";

type BaseInstructionLike = {
  _id: string;
  version: string;
  description: string;
  instructions: string;
  tools: unknown;
};

type FormBaseInstructionVersionSelectorProps = {
  baseInstruction: string;
  baseInstructionId: string;
  baseInstructionTools: string;
  baseInstructionsList: BaseInstructionLike[];
};

export const FormBaseInstructionVersionSelector = ({
  baseInstruction,
  baseInstructionId,
  baseInstructionTools,
  baseInstructionsList,
}: FormBaseInstructionVersionSelectorProps) => {
  const { options, version } = useFormBaseInstructionVersionSelector(
    baseInstruction,
    baseInstructionId,
    baseInstructionTools,
    baseInstructionsList,
  );

  return (
    <Stack spacing={2} py={2}>
      <FormSelect
        options={options}
        label="Instruction Version"
        name={baseInstructionId}
      />
      <Stack spacing={2} direction="row">
        <FormTextField
          name={baseInstruction}
          label="Base Instructions *"
          fullWidth
          rows={8}
          multiline
          disabled={version !== "custom"}
        />
        <FormTextField
          name={baseInstructionTools}
          label="Base Tools *"
          fullWidth
          rows={8}
          multiline
          disabled={version !== "custom"}
        />
      </Stack>
    </Stack>
  );
};
