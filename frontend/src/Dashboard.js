import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios'; // Use axios for making API requests

function Dashboard() {
  const [students, setStudents] = useState([]); // For storing student data
  const [searchQuery, setSearchQuery] = useState(''); // For handling search
  const [newStudent, setNewStudent] = useState({
    regNumber: '',
    name: '',
    mobile: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [showAddStudent, setShowAddStudent] = useState(false); // For accordion toggle

  // Fetch student data from server
  useEffect(() => {
    axios.get('http://localhost:8001/students')
      .then((response) => {
        setStudents(response.data); // Set the students data
        setIsLoading(false); // Turn off loading state
      })
      .catch((error) => {
        setError("Error fetching student data");
        setIsLoading(false);
      });
  }, []);

  // Add new student
  const handleAddStudent = () => {
    axios.post('http://localhost:8001/students', newStudent)
      .then((response) => {
        setStudents([...students, newStudent]); // Add new student to the local state
        setNewStudent({ regNumber: '', name: '', mobile: '', email: '' }); // Clear form
      })
      .catch((error) => {
        setError("Error adding student");
      });
  };

  // Edit student data
  const handleEditStudent = (id) => {
    axios.put(`http://localhost:8001/students/${id}`, newStudent)
      .then((response) => {
        const updatedStudents = students.map(student =>
          student.id === id ? { ...student, ...newStudent } : student
        );
        setStudents(updatedStudents); // Update local state with edited student data
      })
      .catch((error) => {
        setError("Error editing student");
      });
  };

  // Delete student
  const handleDeleteStudent = (id) => {
    axios.delete(`http://localhost:8001/students/${id}`)
      .then(() => {
        setStudents(students.filter(student => student.id !== id)); // Remove student from local state
      })
      .catch((error) => {
        setError("Error deleting student");
      });
  };

  // Search functionality with highlighting and moving matched results to top
  const filteredStudents = students
    .filter(student =>
      student.regNumber.includes(searchQuery) || student.mobile.includes(searchQuery)
    )
    .concat(
      students.filter(
        student => !(student.regNumber.includes(searchQuery) || student.mobile.includes(searchQuery))
      )
    );

  if (isLoading) return <p>Loading students data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
     <h1 style={{fontWeight:500, fontFamily: 'times new roman',color:'orange'}}>STUDENT DASHBOARD</h1>

      {/* Accordion Header */}
      <div className="accordion-header">
        <button
          onClick={() => setShowAddStudent(!showAddStudent)}
          className="accordion-toggle  my-3"
        >
          {showAddStudent ? ' Close   ' : 'Add New Student'}
        </button>
      </div>

      {/* Accordion Content with animation */}
      <div className={`accordion-content ${showAddStudent ? 'open' : ''}`}>
        <div className="add-student-form">
          <h3>Add Student</h3>
          <input
            type="text"
            placeholder="Reg Number"
            value={newStudent.regNumber}
            onChange={(e) => setNewStudent({ ...newStudent, regNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile"
            value={newStudent.mobile}
            onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          />
          <button onClick={handleAddStudent} className="add-btn">Add Student</button>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by Reg Number or Mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="student-table my-2 mx-3">
        <thead>
          <tr>
            <th>Reg Number</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} className={searchQuery && (student.regNumber.includes(searchQuery) || student.mobile.includes(searchQuery)) ? 'highlighted' : ''}>
              <td>{student.regNumber}</td>
              <td>{student.name}</td>
              <td>{student.mobile}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEditStudent(student.id)} className="edit-btn mx-3">Edit</button>
                <button onClick={() => handleDeleteStudent(student.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
