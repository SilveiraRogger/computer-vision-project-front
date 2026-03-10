import { Button, CircularProgress, type ButtonProps } from "@mui/material"
import { colors } from "@/theme/colors"

type Props = ButtonProps & {
  loading?: boolean
  label: string
}

export default function FormButton({ loading, label, ...rest }: Props) {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      size="large"
      disabled={loading}
      {...rest}
      sx={{
        mt: 1,
        py: 1.5,
        borderRadius: 2,
        backgroundColor: colors.primary,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontSize: 13,
        "&:hover": { backgroundColor: colors.primaryHover },
        "&:disabled": { backgroundColor: colors.primaryDisabled },
        ...rest.sx,
      }}
    >
      {loading ? <CircularProgress size={22} sx={{ color: colors.textPrimary }} /> : label}
    </Button>
  )
}