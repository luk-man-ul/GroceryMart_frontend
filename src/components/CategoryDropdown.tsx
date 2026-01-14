import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Category } from '../types'

interface Props {
  onSelect: (categoryId: number | null) => void
}

const CategoryDropdown = ({ onSelect }: Props) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-green-600 font-bold"
      >
        Shop by Category ▼
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-64 bg-white border rounded shadow z-50">
          <div
            onClick={() => {
              onSelect(null)
              setOpen(false)
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            All Products
          </div>

          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => {
                onSelect(category.id)
                setOpen(false)
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
