// API POST /api/accounts/ban/[id] - proxy sang backend .NET, nhận status

export async function POST(request, { params }) {
  const { id } = params;
  // Lấy trạng thái hiện tại từ backend
  const getRes = await fetch(`http://localhost:5294/api/accounts/get/${id}`);
  const account = await getRes.json();
  // Toggle trạng thái
  const newStatus = account.status === 'active' ? 'banned' : 'active';
  // Gửi trạng thái mới sang backend
  const res = await fetch(`http://localhost:5294/api/accounts/ban/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
} 