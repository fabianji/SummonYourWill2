import { useState, useEffect } from 'react'
import './Form.css'

const initialState = {
  name: '',
  description: '',
  main_image_url: '',
  theme_color: '',
  domains: '',
}

function GuideForm({ onSubmit, onCancel, initialValues }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || '',
        description: initialValues.description || '',
        main_image_url: initialValues.main_image_url || '',
        theme_color: initialValues.theme_color || '',
        domains: (initialValues.domains || []).join(', '),
      })
    }
  }, [initialValues])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      domains: form.domains
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean),
    }
    onSubmit(payload)
    setForm(initialState)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <label>
        Main image URL
        <input name="main_image_url" value={form.main_image_url} onChange={handleChange} />
      </label>
      <label>
        Theme color
        <input name="theme_color" value={form.theme_color} onChange={handleChange} placeholder="#0ea5e9" />
      </label>
      <label>
        Domains (comma separated)
        <input name="domains" value={form.domains} onChange={handleChange} placeholder="willpower, compassion" />
      </label>
      <div className="form-actions">
        <button type="submit">Save</button>
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default GuideForm
