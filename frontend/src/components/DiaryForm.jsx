import { useEffect, useState } from 'react'
import './Form.css'

const initialState = {
  title: '',
  content: '',
  entry_type: 'personal',
  guide_ids: '',
  mood_tags: '',
}

function DiaryForm({ onSubmit, onCancel, initialValues, guides }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        content: initialValues.content || '',
        entry_type: initialValues.entry_type || 'personal',
        guide_ids: (initialValues.guide_ids || []).join(', '),
        mood_tags: (initialValues.mood_tags || []).join(', '),
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
      guide_ids: form.guide_ids
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      mood_tags: form.mood_tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    onSubmit(payload)
    setForm(initialState)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Entry type
        <select name="entry_type" value={form.entry_type} onChange={handleChange}>
          <option value="personal">Personal</option>
          <option value="single_guide">Single guide</option>
          <option value="multi_guide">Multi guide</option>
        </select>
      </label>
      <label>
        Guides (comma separated IDs)
        <input
          name="guide_ids"
          value={form.guide_ids}
          onChange={handleChange}
          placeholder={guides?.length ? guides.map((g) => g.name).join(', ') : 'guide ids'}
        />
      </label>
      <label>
        Mood tags (comma separated)
        <input name="mood_tags" value={form.mood_tags} onChange={handleChange} placeholder="gratitude, clarity" />
      </label>
      <label>
        Content
        <textarea name="content" value={form.content} onChange={handleChange} rows={5} required />
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

export default DiaryForm
