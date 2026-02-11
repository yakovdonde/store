'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/authContext'
import { AdminNav } from '@/components/admin'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface User {
  id: number
  email: string
  role: 'owner' | 'editor'
  status: 'active' | 'inactive'
  created_at: string
}

interface FormData {
  email: string
  password: string
  role: 'owner' | 'editor'
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'editor',
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'owner') {
      setError('Only owners can manage users')
      return
    }
    fetchUsers()
  }, [currentUser])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiClient.get('/users')
      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        setError(response.data.error || 'Failed to fetch users')
      }
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({ email: user.email, password: '', role: user.role })
    } else {
      setEditingUser(null)
      setFormData({ email: '', password: '', role: 'editor' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ email: '', password: '', role: 'editor' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        // Update role
        const response = await apiClient.put(`/users/${editingUser.id}/role`, {
          role: formData.role,
        })
        if (response.data.success) {
          setSuccess('User role updated successfully')
          setUsers(users.map((u) => (u.id === editingUser.id ? response.data.data : u)))
          handleCloseModal()
        }
      } else {
        // Create new user
        if (!formData.email || !formData.password) {
          setError('Email and password are required')
          return
        }
        const response = await apiClient.post('/users', {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        })
        if (response.data.success) {
          setSuccess('User created successfully')
          setUsers([response.data.data, ...users])
          handleCloseModal()
        }
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.response?.data?.error || 'Operation failed')
    }
  }

  const handleUpdateStatus = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      setError('')
      const response = await apiClient.put(`/users/${userId}/status`, {
        status: newStatus,
      })
      if (response.data.success) {
        setSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
        setUsers(users.map((u) => (u.id === userId ? response.data.data : u)))
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.response?.data?.error || 'Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setError('')
      const response = await apiClient.delete(`/users/${userId}`)
      if (response.data.success) {
        setSuccess('User deleted successfully')
        setUsers(users.filter((u) => u.id !== userId))
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  if (!currentUser || currentUser.role !== 'owner') {
    return (
      <>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.errorMessage}>Only owners can access user management</div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>User Management</h1>
          <button className={styles.addButton} onClick={() => handleOpenModal()}>
            + Add User
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {loading ? (
          <div className={styles.loadingMessage}>Loading users...</div>
        ) : users.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No users found</p>
            <p>Click "Add User" to create new team members</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td>
                      <span className={`${styles.roleCell} ${styles[`role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusCell} ${
                          user.status === 'active' ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleOpenModal(user)}
                          title="Edit user role"
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.button} ${user.status === 'active' ? styles.deleteButton : styles.editButton}`}
                          onClick={() =>
                            handleUpdateStatus(user.id, user.status === 'active' ? 'inactive' : 'active')
                          }
                          title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        {users.filter((u) => u.role === 'owner' && u.status === 'active').length > 1 ||
                        user.role === 'editor' ? (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete user"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <div className={`${styles.modal} ${showModal ? styles.open : ''}`}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>{editingUser ? 'Edit User Role' : 'Add New User'}</div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={editingUser ? true : false}
                  placeholder="user@example.com"
                  required
                />
              </div>

              {!editingUser && (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 8 characters"
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className={styles.select}
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="editor">Editor (Manage products & categories)</option>
                  <option value="owner">Owner (Full control)</option>
                </select>
              </div>

              <div className={styles.modalButtons}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingUser ? 'Update Role' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
