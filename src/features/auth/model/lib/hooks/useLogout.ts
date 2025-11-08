import { useState } from "react"
import { logout } from "../../api"
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications"
import { useNavigate } from "react-router-dom"

export const useLogout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [error, setError] = useState<string |null> (null)

    const {showError, showSuccess} = useNotifications()
    const navigate = useNavigate()

    const fetchLogout = async () => {
        try {
            setIsLoading(true)
            setIsError(false)
            setError(null)

            await logout()
            showSuccess("Выход из аккаунта")
            navigate('/auth/login')
        } catch (err) {
            setIsError(true)
            setError(err instanceof Error ? err.message : "Ошибка при выходе")
            showError("Не удалось выйти")    
        } finally {
            setIsLoading(false)
        }
    }

    return {isLoading, isError, error, logout: fetchLogout}
}