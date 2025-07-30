const fs = require('fs');
const path = require('path');

const API_ROUTES = [
  'Booking',
  'CustomizePackage',
  'CustomizeTask',
  'FeedBack',
  'Holiday',
  'Invoice',
  'MedicalNote',
  'Notification',
  'Relative',
  'ServiceTask',
  'ServiceType',
  'TransactionHistory',
  'Wallet',
  'WorkSchedule'
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

function createRouteFile(apiName) {
  const basePath = path.join(__dirname, '../src/app/api', apiName);
  
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Main route file
  const mainRouteContent = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(\`\${backendUrl}/api/${apiName}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Không thể lấy danh sách ${apiName.toLowerCase()}' },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: \`Server error: \${response.status} - \${errorText.substring(0, 100)}\` },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: \`Không thể kết nối đến server: \${error.message}\` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(\`\${backendUrl}/api/${apiName}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Không thể tạo ${apiName.toLowerCase()}' },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: \`Server error: \${response.status} - \${errorText.substring(0, 100)}\` },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: \`Không thể kết nối đến server: \${error.message}\` },
      { status: 500 }
    );
  }
}
`;

  fs.writeFileSync(path.join(basePath, 'route.js'), mainRouteContent);

  // Dynamic route for [id]
  const dynamicPath = path.join(basePath, '[id]');
  if (!fs.existsSync(dynamicPath)) {
    fs.mkdirSync(dynamicPath, { recursive: true });
  }

  const dynamicRouteContent = `import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(\`\${backendUrl}/api/${apiName}/\${id}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Không thể lấy thông tin ${apiName.toLowerCase()}' },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: \`Server error: \${response.status} - \${errorText.substring(0, 100)}\` },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: \`Không thể kết nối đến server: \${error.message}\` },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(\`\${backendUrl}/api/${apiName}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể cập nhật ${apiName.toLowerCase()}' }, { status: response.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: \`Server error: \${response.status} - \${errorText.substring(0, 100)}\` }, { status: response.status });
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: \`Không thể kết nối đến server: \${error.message}\` }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(\`\${backendUrl}/api/${apiName}/\${id}\`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể xóa ${apiName.toLowerCase()}' }, { status: response.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: \`Server error: \${response.status} - \${errorText.substring(0, 100)}\` }, { status: response.status });
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: \`Không thể kết nối đến server: \${error.message}\` }, { status: 500 });
  }
}
`;

  fs.writeFileSync(path.join(dynamicPath, 'route.js'), dynamicRouteContent);
}

// Create all API routes
console.log('🚀 Creating API routes...');

API_ROUTES.forEach(apiName => {
  createRouteFile(apiName);
  console.log(`✅ Created routes for ${apiName}`);
});

console.log('\n🎉 All API routes created successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set NEXT_PUBLIC_BACKEND_URL in your .env file');
console.log('2. Update your services to use the new routes');
console.log('3. Test the routes with your backend');
console.log('\n🔗 API Routes created:');
API_ROUTES.forEach(apiName => {
  console.log(`   - /api/${apiName} (GET, POST)`);
  console.log(`   - /api/${apiName}/[id] (GET, PUT, DELETE)`);
}); 