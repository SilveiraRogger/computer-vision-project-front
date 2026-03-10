import { colors } from "@/theme"
import { TextField, type TextFieldProps } from "@mui/material"
import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form"

type Props<T extends FieldValues> = Omit<TextFieldProps, "error"> & {
  name: Path<T>
  control: Control<T>
  error?: FieldError
}

export default function FormInput<T extends FieldValues>({
  name,
  control,
  error,
  ...rest
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          error={!!error}
          helperText={error?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: colors.bgCard,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.borderHover },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": { color: colors.textMuted },
            "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
            "& .MuiOutlinedInput-input": { color: colors.textPrimary },
            "& .MuiFormHelperText-root": { color: colors.error },
            ...rest.sx,
          }}
        />
      )}
    />
  )
}