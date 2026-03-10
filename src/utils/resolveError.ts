import toast from "react-hot-toast"

export const resolveError = (err: unknown) => {
    const error = err as {
        response: {
            data: {
                message: string
            }
        }
        
    }
    toast.error(error?.response?.data?.message)
}















