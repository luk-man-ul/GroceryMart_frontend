import { useEffect, useState } from 'react'
import api from '../../api/axios'

interface StockLog {
  id: number
  oldStock: number
  addedQty: number
  newStock: number
  createdAt: string
  product: {
    name: string
  }
  staff: {
    name: string
    email: string
  }
}

const AdminInventoryLogs = () => {
  const [logs, setLogs] = useState<StockLog[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get(
        '/admin/inventory/logs',
      )
      setLogs(res.data)
    } catch (err) {
      console.error('Failed to fetch logs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Inventory Stock Logs
      </h1>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <table className="w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Staff</th>
              <th className="p-3 text-left">Change</th>
              <th className="p-3 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr
                key={log.id}
                className="border-t"
              >
                <td className="p-3">
                  {new Date(
                    log.createdAt,
                  ).toLocaleString()}
                </td>
                <td className="p-3">
                  {log.product.name}
                </td>
                <td className="p-3">
                  {log.staff.name}
                </td>
                <td className="p-3 text-green-700">
                  +{log.addedQty}
                </td>
                <td className="p-3">
                  {log.oldStock} →{' '}
                  <strong>{log.newStock}</strong>
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500"
                >
                  No inventory logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminInventoryLogs
