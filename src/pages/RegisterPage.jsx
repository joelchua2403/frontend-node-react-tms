import React from 'react'
import axios from 'axios'
import { useState } from 'react'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('Registering user: ', username);
            console.log(password)
            await axios.post('http://localhost:3001/users/register', { username, password, email, role, isDisabled});
            setMessage('Registration successful');
        } catch (error) {
            setMessage('Registration failed');
        }
    }

  return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
            <label>Username:</label>
            <input type="text" name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password:</label>
            <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Email:</label>
            <input type="text" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Role:</label>
            <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
            <button type="submit">Register</button>
        </form>
        {message && <h3>{message}</h3>}
    </div>
  )
}

export default RegisterPage