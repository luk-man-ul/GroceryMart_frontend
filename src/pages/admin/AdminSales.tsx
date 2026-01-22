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

type Filter =
  | 'CUSTOM'
  | 'TODAY'
  | 'LAST_7_DAYS'
  | 'MONTH'

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`

const toISO = (d: Date) =>
  d.toISOString().slice(0, 10)

const AdminSales = () => {
  const [data, setData] = useState<Summary | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] =
    useState<Filter>('TODAY')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // =========================
  // FETCH SUMMARY
  // =========================
  const fetchSummary = async (
    start?: string,
    end?: string,
  ) => {
    try {
      setLoading(true)
      setError('')

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
      console.error(err)
      setError('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FILTER HANDLERS
  // =========================
  const applyToday = () => {
    const today = toISO(new Date())
    setActiveFilter('TODAY')
    setStartDate(today)
    setEndDate(today)
    fetchSummary(today, today)
  }

  const applyLast7Days = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)

    const startISO = toISO(start)
    const endISO = toISO(end)

    setActiveFilter('LAST_7_DAYS')
    setStartDate(startISO)
    setEndDate(endISO)
    fetchSummary(startISO, endISO)
  }

  const applyMonthly = () => {
    const now = new Date()
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    )

    const startISO = toISO(start)
    const endISO = toISO(now)

    setActiveFilter('MONTH')
    setStartDate(startISO)
    setEndDate(endISO)
    fetchSummary(startISO, endISO)
  }

  const applyCustom = () => {
    setActiveFilter('CUSTOM')
    fetchSummary(startDate, endDate)
  }

  // DEFAULT → TODAY
  useEffect(() => {
    applyToday()
  }, [])

  const filterBtn = (filter: Filter) =>
    `px-4 py-2 rounded border transition ${
      activeFilter === filter
        ? 'bg-black text-white'
        : 'bg-white hover:bg-gray-100'
    }`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Sales & Revenue Report
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div>
          <label className="block text-sm mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e =>
              setStartDate(e.target.value)
            }
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e =>
              setEndDate(e.target.value)
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={applyCustom}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Apply
        </button>

        {/* QUICK FILTERS */}
        <button
          onClick={applyToday}
          className={filterBtn('TODAY')}
        >
          Today
        </button>

        <button
          onClick={applyLast7Days}
          className={filterBtn(
            'LAST_7_DAYS',
          )}
        >
          Last 7 Days
        </button>

        <button
          onClick={applyMonthly}
          className={filterBtn('MONTH')}
        >
          This Month
        </button>
      </div>

      {/* STATUS */}
      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      {/* CONTENT (NO FLICKER) */}
      {data && (
        <>
          {loading && (
            <p className="text-sm text-gray-500 mb-3">
              Updating…
            </p>
          )}

          <p className="text-sm text-gray-500 mb-4">
            Showing data from{' '}
            <strong>{data.range.start}</strong>{' '}
            to{' '}
            <strong>{data.range.end}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded shadow">
              <h2 className="font-semibold mb-1">
                Local (POS)
              </h2>
              <p className="text-sm text-gray-500">
                Bills: {data.local.bills}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  data.local.revenue,
                )}
              </p>
            </div>

            <div className="bg-white p-5 rounded shadow">
              <h2 className="font-semibold mb-1">
                Online Orders
              </h2>
              <p className="text-sm text-gray-500">
                Orders:{' '}
                {data.online.orders}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  data.online.revenue,
                )}
              </p>
            </div>

            <div className="bg-black text-white p-5 rounded shadow">
              <h2 className="font-semibold mb-1">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold">
                {formatCurrency(
                  data.totalRevenue,
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminSales
