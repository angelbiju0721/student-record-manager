import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/students';

const initialForm = {
  name: '',
  rollNo: '',
  department: '',
  semester: '',
  cgpa: '',
  contact: '',
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load students from MongoDB through the backend
  async function fetchStudents() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load students');
      }

      setStudents(data);
    } catch (err) {
      setError(
        'Could not connect to the backend. Make sure your server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add a student to the database
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          semester: Number(form.semester),
          cgpa: Number(form.cgpa),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not add student');
      }

      setStudents((previous) => [data, ...previous]);
      setForm(initialForm);
      setSuccess('Student added successfully!');
    } catch (err) {
      setError(err.message || 'Could not add student.');
    }
  }

  // Delete a student from the database
  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete student');
      }

      setStudents((previous) =>
        previous.filter((student) => student._id !== id)
      );

      setSuccess('Student deleted successfully!');
    } catch (err) {
      setError(err.message || 'Could not delete student.');
    }
  }

  const filteredStudents = students.filter((student) => {
    const term = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(term) ||
      student.rollNo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">STUDENT MANAGEMENT SYSTEM</p>
          <h1>Student Record Manager</h1>
          <p className="subtitle">
            Manage student information in one place.
          </p>
        </div>
        <div className="header-icon">🎓</div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <p>Departments</p>
              <h2>
                {new Set(
                  students.map((student) => student.department)
                ).size}
              </h2>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Add New Student</h2>
              <p>Enter the student's details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-grid">
              <label>
                Student Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label>
                Roll Number
                <input
                  name="rollNo"
                  value={form.rollNo}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                />
              </label>

              <label>
                Department
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </label>

              <label>
                Semester
                <input
                  name="semester"
                  type="number"
                  min="1"
                  max="12"
                  value={form.semester}
                  onChange={handleChange}
                  placeholder="1–12"
                  required
                />
              </label>

              <label>
                CGPA
                <input
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="0.00–10.00"
                  required
                />
              </label>

              <label>
                Contact Number
                <input
                  name="contact"
                  type="tel"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </label>
            </div>

            <button className="primary-button" type="submit">
              + Add Student
            </button>
          </form>
        </section>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <section className="panel">
          <div className="section-heading list-heading">
            <div>
              <h2>Student Records</h2>
              <p>View, search, and manage saved student details.</p>
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or roll number..."
              aria-label="Search students"
            />
          </div>

          {loading ? (
            <p className="empty-state">Loading student records...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-state">
              {search
                ? 'No students match your search.'
                : 'No student records yet. Add your first student above.'}
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>CGPA</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="student-name">{student.name}</td>
                      <td>{student.rollNo}</td>
                      <td>{student.department}</td>
                      <td>{student.semester}</td>
                      <td>{Number(student.cgpa).toFixed(2)}</td>
                      <td>{student.contact}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(student._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          Student Record Manager · React · Express · MongoDB
        </footer>
      </main>
    </div>
  );
}

export default App;
