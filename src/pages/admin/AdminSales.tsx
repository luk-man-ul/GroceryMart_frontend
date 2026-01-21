import { useEffect, useState } from 'react'
import api from '../../api/axios'

type Summary = {
  range: {
    start: string
    end: string
  }
  local: {
    revenue: number
    bills: number
  }
  online: {
    revenue: number
    orders: number
  }
  totalRevenue: number
}

const AdminSales = () => {
  const [data, setData] = useState<Summary | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // =========================
  // FETCH SALES SUMMARY
  // =========================
  const fetchSummary = async (
    start?: string,
    end?: string,
  ) => {
    try {
      const res = await api.get(
        '/admin/sales/summary',
        {
          params:
            start && end
              ? { startDate: start, endDate: end }
              : {},
        },
      )

      setData(res.data)
    } catch (err) {
      console.error('Failed to load sales summary', err)
    }
  }

  // Default → today
  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Sales Summary
      </h1>

      {/* DATE RANGE PICKER */}
      <div className="flex gap-3 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
          className="border p-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
          className="border p-2"
        />

        <button
          onClick={() =>
            fetchSummary(startDate, endDate)
          }
          className="bg-black text-white px-4 rounded"
        >
          Apply
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LOCAL */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="font-semibold mb-2">
              Local (POS)
            </h2>
            <p>Bills: {data.local.bills}</p>
            <p className="text-lg font-bold text-green-600">
              ₹{data.local.revenue}
            </p>
          </div>

          {/* ONLINE */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="font-semibold mb-2">
              Online Orders
            </h2>
            <p>
              Orders: {data.online.orders}
            </p>
            <p className="text-lg font-bold text-blue-600">
              ₹{data.online.revenue}
            </p>
          </div>

          {/* TOTAL */}
          <div className="bg-black text-white p-5 rounded shadow">
            <h2 className="font-semibold mb-2">
              Total Revenue
            </h2>
            <p className="text-2xl font-bold">
              ₹{data.totalRevenue}
            </p>
            <p className="text-sm opacity-70">
              {data.range.start} →{' '}
              {data.range.end}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSales
