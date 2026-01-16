import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

type BaseInstructionLike = {
  _id: string;
  version: string;
  description: string;
  instructions: string;
  tools: unknown;
};

export const useFormBaseInstructionVersionSelector = (
  baseInstruction: string,
  baseInstructionId: string,
  baseInstructionTools: string,
  baseInstructionsList: BaseInstructionLike[],
) => {
  const { watch, setValue } = useFormContext();

  const selectedVersion = watch(baseInstructionId);

  const options = useMemo(() => {
    const baseOptions = (baseInstructionsList ?? []).map((instruction) => ({
      value: instruction._id,
      label: `${instruction.version} - ${instruction.description}`,
    }));

    const customOption = {
      value: "custom",
      label: "Custom",
    };

    return [...baseOptions, customOption];
  }, [baseInstructionsList]);

  useEffect(() => {
    const selectedInstruction = baseInstructionsList.find(
      (instruction) => instruction._id === selectedVersion,
    );

    if (selectedInstruction) {
      setValue(baseInstruction, selectedInstruction.instructions);
      setValue(
        baseInstructionTools,
        JSON.stringify(selectedInstruction.tools, null, 2),
      );
      setValue(baseInstructionId, selectedInstruction._id);
    }
  }, [
    selectedVersion,
    baseInstructionsList,
    baseInstruction,
    baseInstructionTools,
    baseInstructionId,
    setValue,
  ]);

  return {
    options,
    version: selectedVersion,
  };
};
