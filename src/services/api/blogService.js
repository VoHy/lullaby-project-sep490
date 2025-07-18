import blogs from '../../mock/Blog';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const blogService = {
  getBlogs: async () => {
    if (USE_MOCK) {
      return Promise.resolve(blogs);
    }
    const res = await fetch('/api/blogs');
    return res.json();
  },
  getBlogById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(blogs.find(b => b.BlogID === id));
    }
    const res = await fetch(`/api/blogs/${id}`);
    return res.json();
  },
  createBlog: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, BlogID: blogs.length + 1 });
    }
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateBlog: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...blogs.find(b => b.BlogID === id), ...data });
    }
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteBlog: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default blogService; 