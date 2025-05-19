import express, { Request, Response } from 'express';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/mern-ts-tasks';

// GitHub user interface for typing response data
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.info('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

interface GitHubUserParams {
  username: string;
}

// API route to get GitHub user profile
app.get('/api/github/user/:username', async (req: Request<GitHubUserParams>, res: Response) => {
  const { username } = req.params;

  try {
    const response = await axios.get<GitHubUser>(`https://api.github.com/users/${username}`);
    const { login, avatar_url, html_url, name, bio, public_repos, followers, following } =
      response.data;

    res.json({
      login,
      avatar_url,
      html_url,
      name,
      bio,
      public_repos,
      followers,
      following,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 404) {
      res.status(404).json({ error: 'GitHub user not found' });
    } else {
      console.error('Failed to fetch GitHub profile:', axiosError.message);
      res.status(500).json({ error: 'Failed to fetch GitHub profile' });
    }
  }
});

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});
