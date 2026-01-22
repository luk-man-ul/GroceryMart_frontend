interface ToastProps {
  message: string
  show: boolean
  type?: 'success' | 'error'
}

const Toast = ({ message, show, type = 'success' }: ToastProps) => {
  if (!show) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white transition-all
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
      `}
    >
      {message}
    </div>
  )
}

export default Toast
