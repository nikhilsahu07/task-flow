import express from 'express';
import cors from 'cors';
import axios from 'axios';
import mongoose from 'mongoose';
const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/mern-ts-tasks';
// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use(cors());
app.use(express.json());
// API route to get GitHub user profile
app.get('/api/github/user/:username', async (req, res) => {
    const { username } = req.params;
    // Username presence is guaranteed by the route pattern, but a check doesn't hurt
    // if (!username) {
    //   return res.status(400).json({ error: 'GitHub username is required' });
    // }
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { login, avatar_url, html_url, name, bio, public_repos, followers, following } = response.data;
        res.json({ login, avatar_url, html_url, name, bio, public_repos, followers, following });
    }
    catch (error) {
        const axiosError = error;
        if (axiosError.response && axiosError.response.status === 404) {
            res.status(404).json({ error: 'GitHub user not found' });
        }
        else {
            console.error('Failed to fetch GitHub profile:', axiosError.message);
            res.status(500).json({ error: 'Failed to fetch GitHub profile' });
        }
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map