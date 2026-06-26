import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load active session on startup
const loadSession = () => {
  try {
    const token = localStorage.getItem('mock_token');
    const user = localStorage.getItem('mock_user');
    if (token && user) {
      return { token, user: JSON.parse(user), isAuthenticated: true };
    }
  } catch (e) {
    console.error('Failed to load session:', e);
  }
  return { token: null, user: null, isAuthenticated: false };
};

// Local storage "DB" for users
const getUsersDB = () => {
  try {
    const db = localStorage.getItem('mock_users_db');
    return db ? JSON.parse(db) : [];
  } catch (e) {
    return [];
  }
};

const saveUserToDB = (user) => {
  try {
    const db = getUsersDB();
    db.push(user);
    localStorage.setItem('mock_users_db', JSON.stringify(db));
  } catch (e) {
    console.error('Failed to write to mock user DB:', e);
  }
};

// Thunks to simulate JWT server authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    await delay(1000); // Simulate API latency
    const db = getUsersDB();
    const user = db.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return rejectWithValue('No user found with this email.');
    }
    if (user.password !== password) {
      return rejectWithValue('Incorrect password.');
    }

    // Generate simulated JWT
    const mockToken = btoa(JSON.stringify({ sub: user.email, exp: Date.now() + 3600000 }));
    
    // Save credentials to localStorage
    const userPayload = { name: user.name, email: user.email };
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(userPayload));

    return { token: mockToken, user: userPayload };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    await delay(1000); // Simulate API latency
    const db = getUsersDB();
    const exists = db.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return rejectWithValue('Email is already registered.');
    }

    const newUser = { name, email, password };
    saveUserToDB(newUser);

    // Auto-login after registration
    const mockToken = btoa(JSON.stringify({ sub: email, exp: Date.now() + 3600000 }));
    const userPayload = { name, email };
    
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(userPayload));

    return { token: mockToken, user: userPayload };
  }
);

const session = loadSession();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: session.user,
    token: session.token,
    isAuthenticated: session.isAuthenticated,
    loading: false,
    error: null,
    successMsg: null
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('mock_token');
      localStorage.removeItem('mock_user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMsg = 'Successfully logged out!';
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMsg = 'Logged in successfully!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMsg = 'Registration completed and logged in!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
